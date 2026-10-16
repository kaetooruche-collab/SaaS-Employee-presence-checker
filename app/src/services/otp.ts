import bcrypt from "bcryptjs";
import { db } from "../db";

const OTP_TTL_MINUTES = 10;

export interface OtpSender {
  send(phoneNumber: string, code: string): Promise<void>;
}

// Doc 11 left SMS vs. WhatsApp Business API as an open item for TRNC
// reachability. Neither is wired up yet — this stub logs to the console so
// the login flow is fully testable before a real vendor is chosen. Swap
// this out (not the rest of the auth code) once that decision is made.
export const consoleOtpSender: OtpSender = {
  async send(phoneNumber, code) {
    console.log(`[OTP STUB] Would send to ${phoneNumber}: your code is ${code}`);
  },
};

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function issueOtp(employeeId: string, phoneNumber: string, sender: OtpSender = consoleOtpSender) {
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
