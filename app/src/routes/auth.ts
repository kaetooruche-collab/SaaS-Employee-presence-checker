import { Router } from "express";
import { db } from "../db";
import { issueOtp, verifyOtp } from "../services/otp";
import { page } from "../views/layout";

export const authRouter = Router();

authRouter.get("/login", (req, res) => {
  if (req.employee) return res.redirect("/");
  res.send(
    page(
      "Log in",
      `<div class="card">
        <h1>Log in</h1>
        <form method="post" action="/login/request-otp">
          <p>Phone number</p>
          <input type="tel" name="phoneNumber" placeholder="e.g. 05xxxxxxxx" required autofocus>
          <p></p>
          <input type="submit" value="Send code">
        </form>
      </div>`
    )
  );
});

authRouter.post("/login/request-otp", async (req, res) => {
  const phoneNumber = String(req.body.phoneNumber || "").trim();
  if (!phoneNumber) return res.redirect("/login");

  // Deliberately do not reveal whether the number matches an account — avoids
  // leaking which phone numbers are registered employees.
  const employee = await db.employee.findFirst({
    where: { phoneNumber, deactivatedAt: null },
  });

  if (employee) {
    await issueOtp(employee.id, phoneNumber);
    req.session!.pendingOtpEmployeeId = employee.id;
  }

  res.send(
    page(
      "Enter code",
      `<div class="card">
        <h1>Enter the code</h1>
        <p>If that number is registered, a code was sent. In development, check the server console log.</p>
        <form method="post" action="/login/verify-otp">
          <input type="text" name="code" inputmode="numeric" placeholder="6-digit code" required autofocus>
          <p></p>
          <input type="submit" value="Log in">
        </form>
      </div>`
    )
  );
});

authRouter.post("/login/verify-otp", async (req, res) => {
  const pendingId = req.session?.pendingOtpEmployeeId;
  const code = String(req.body.code || "").trim();
  if (!pendingId || !code) return res.redirect("/login");

  const ok = await verifyOtp(pendingId, code);
  if (!ok) {
    return res.send(
      page(
        "Enter code",
        `<div class="card"><h1>That code didn't work</h1><p><a href="/login">Try again</a></p></div>`
      )
    );
  }

  req.session!.employeeId = pendingId;
  req.session!.pendingOtpEmployeeId = undefined;
  res.redirect("/");
});

authRouter.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
