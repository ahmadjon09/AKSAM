import { describe, expect, it } from "vitest";
import { isValidPhone, isValidSlug, normalizePhone, slugify } from "../lib/utils";

describe("phone helpers", () => {
  it("normalizes local Uzbek numbers to +998", () => {
    expect(normalizePhone("90 123 45 67")).toBe("+998901234567");
    expect(normalizePhone("+998 90 123 45 67")).toBe("+998901234567");
    expect(normalizePhone("998901234567")).toBe("+998901234567");
  });

  it("accepts valid formats and rejects junk", () => {
    expect(isValidPhone("+998 90 123 45 67")).toBe(true);
    expect(isValidPhone("901234567")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("abcdefghij")).toBe(false);
  });
});

describe("slug helpers", () => {
  it("transliterates cyrillic and uzbek characters", () => {
    expect(slugify("Атласные ленты")).toBe("atlasnye-lenty");
    expect(slugify("To'qilgan yorliqlar")).toMatch(/^t/);
  });

  it("validates slug shape", () => {
    expect(isValidSlug("atlas-lentalar")).toBe(true);
    expect(isValidSlug("bad slug!")).toBe(false);
    expect(isValidSlug("-leading")).toBe(false);
  });
});
