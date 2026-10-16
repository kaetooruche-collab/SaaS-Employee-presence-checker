import "dotenv/config";
import "./types";
import express from "express";
import cookieSession from "cookie-session";
import { attachEmployee } from "./middleware/auth";
import { authRouter } from "./routes/auth";
import { statusRouter } from "./routes/status";
import { rosterRouter } from "./routes/roster";
import { adminRouter } from "./routes/admin";
import { startScheduledJobs } from "./services/jobs";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  })
);
app.use(attachEmployee);

app.use(authRouter);
app.use(statusRouter);
app.use(rosterRouter);
app.use(adminRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Presence app listening on http://localhost:${port}`);
  startScheduledJobs();
});
