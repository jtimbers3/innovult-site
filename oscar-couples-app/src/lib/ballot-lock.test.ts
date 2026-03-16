import { describe, expect, it } from "vitest";

function isBallotLocked(lockAt: Date, now = new Date()) {
  return now >= lockAt;
}

describe("ballot locking", () => {
  it("locks at or after lock time", () => {
    const lockAt = new Date("2026-03-01T01:00:00Z");
    expect(isBallotLocked(lockAt, new Date("2026-03-01T01:00:00Z"))).toBe(true);
    expect(isBallotLocked(lockAt, new Date("2026-03-01T01:00:01Z"))).toBe(true);
  });

  it("stays editable before lock", () => {
    const lockAt = new Date("2026-03-01T01:00:00Z");
    expect(isBallotLocked(lockAt, new Date("2026-03-01T00:59:59Z"))).toBe(false);
  });
});
