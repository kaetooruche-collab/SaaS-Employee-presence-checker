import { test } from "node:test";
import assert from "node:assert/strict";
import { isWithinBoundaryWindow } from "./jobs";

// The day-boundary cron now runs every 5 minutes (vercel.json), not every
// minute, so resetAtDayBoundary needs a window check instead of an exact
// string match — this pins the window math, including the midnight wrap.

test("exactly at the boundary is within the window", () => {
  assert.equal(isWithinBoundaryWindow("00:00", "00:00", 5), true);
});

test("a few minutes after the boundary is within the window", () => {
  assert.equal(isWithinBoundaryWindow("00:03", "00:00", 5), true);
});

test("at the edge of the window is excluded (half-open interval)", () => {
  assert.equal(isWithinBoundaryWindow("00:05", "00:00", 5), false);
});

test("well before the boundary is not within the window", () => {
  assert.equal(isWithinBoundaryWindow("23:50", "00:00", 5), false);
});

test("wraps correctly across midnight", () => {
  // boundary at 23:58, now at 00:02 -> 4 minutes past, wrapping through midnight
  assert.equal(isWithinBoundaryWindow("00:02", "23:58", 5), true);
});

test("non-default boundary time works the same way", () => {
  assert.equal(isWithinBoundaryWindow("06:02", "06:00", 5), true);
  assert.equal(isWithinBoundaryWindow("06:10", "06:00", 5), false);
});
