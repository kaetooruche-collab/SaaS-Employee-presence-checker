import "dotenv/config";
import "./types";
import express from "express";
import cookieSession from "cookie-session";
import { attachEmployee } from "./middleware/auth";
import { authRouter } from "./routes/auth";
import { statusRouter } from "./routes/status";
import { rosterRouter } from "./routes/roster";
import { adminRouter } from "./routes/admin";

// The Express app itself — no .listen(), no scheduled-job startup. Split out
// from src/server.ts (local dev entry) and api/index.ts (Vercel entry) so
// both can share exactly the same app without either one accidentally
// pulling in the other's startup behavior. In particular, the in-process
// setInterval job scheduler (src/services/jobs.ts) must never be started
// here: on Vercel, functions are not guaranteed to stay alive between
// requests, so recurring work goes through Vercel Cron hitting api/cron/*
// instead — see vercel.json and docs/01-decision-log.md Decision D9.
export const app = express();

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
