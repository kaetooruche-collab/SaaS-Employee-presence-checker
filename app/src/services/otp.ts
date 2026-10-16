import bcrypt from "bcryptjs";
import { db } from "../db";

const OTP_TTL_MINUTES = 10;

export interface OtpSender {
  send(phoneNumber: string, code: string): Promise<void>;
}

// Dev default: logs the code instead of sending it. Always available so
// the login flow stays fully testable without real WhatsApp credentials.
export const consoleOtpSender: OtpSender = {
  async send(phoneNumber, code) {
    console.log(`[OTP STUB] Would send to ${phoneNumber}: your code is ${code}`);
  },
};

// Real delivery via Meta's WhatsApp Cloud API. WhatsApp requires a
// pre-approved "Authentication" category template for business-initiated
// messages like this — you cannot just send free text. Setup (not
// something this code can do for you — it needs your own Meta Business
// account): create a Meta Business Manager account, add a WhatsApp
// product, get a phone number ID, get an access token (a System User
// token for production, not the 24h test token), and submit an
// authentication-category template for approval (Meta's template review
// is usually fast for this category, but it is still external review you
// have to wait on). Once approved, set WHATSAPP_ACCESS_TOKEN,
// WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_OTP_TEMPLATE_NAME.
export const whatsAppOtpSender: OtpSender = {
  async send(phoneNumber, code) {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME;
    const templateLang = process.env.WHATSAPP_OTP_TEMPLATE_LANG || "en_US";

    if (!accessToken || !phoneNumberId || !templateName) {
      throw new Error(
        "WhatsApp OTP sender is selected (OTP_CHANNEL=whatsapp) but WHATSAPP_ACCESS_TOKEN, " +
          "WHATSAPP_PHONE_NUMBER_ID, or WHATSAPP_OTP_TEMPLATE_NAME is missing. See src/services/otp.ts."
      );
    }

    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
          name: templateName,
          language: { code: templateLang },
          components: [{ type: "body", parameters: [{ type: "text", text: code }] }],
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`WhatsApp API send failed (${response.status}): ${body}`);
    }
  },
};

function resolveDefaultSender(): OtpSender {
  return process.env.OTP_CHANNEL === "whatsapp" ? whatsAppOtpSender : consoleOtpSender;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function issueOtp(employeeId: string, phoneNumber: string, sender: OtpSender = resolveDefaultSender()) {
  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await db.otpCode.create({
    data: { employeeId, codeHash, expiresAt },
  });

  await sender.send(phoneNumber, code);
}

export async function verifyOtp(employeeId: string, code: string): Promise<boolean> {
  const candidates = await db.otpCode.findMany({
    where: { employeeId, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 5, // guard against a backlog of unused codes, not against brute force (see NOTES.md)
  });

  for (const candidate of candidates) {
    if (await bcrypt.compare(code, candidate.codeHash)) {
      await db.otpCode.update({
        where: { id: candidate.id },
        data: { consumedAt: new Date() },
      });
      return true;
    }
  }
  return false;
}
