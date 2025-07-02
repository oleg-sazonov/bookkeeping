const usernameRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

describe("usernameRegex", () => {
    test("should match valid usernames", () => {
        expect(usernameRegex.test("Password1!")).toBe(true); // Valid
        expect(usernameRegex.test("Strong@123")).toBe(true); // Valid
        expect(usernameRegex.test("MyPass$word9")).toBe(true); // Valid
    });

    test("should not match usernames without a lowercase letter", () => {
        expect(usernameRegex.test("PASSWORD1!")).toBe(false); // No lowercase
    });

    test("should not match usernames without an uppercase letter", () => {
        expect(usernameRegex.test("password1!")).toBe(false); // No uppercase
    });

    test("should not match usernames without a digit", () => {
        expect(usernameRegex.test("Password!")).toBe(false); // No digit
    });

    test("should not match usernames without a special character", () => {
        expect(usernameRegex.test("Password1")).toBe(false); // No special character
    });

    test("should not match usernames shorter than 8 characters", () => {
        expect(usernameRegex.test("P@ss1")).toBe(false); // Too short
    });

    test("should match usernames with exactly 8 characters", () => {
        expect(usernameRegex.test("P@ssw0rd")).toBe(true); // Exactly 8 characters
    });
});
