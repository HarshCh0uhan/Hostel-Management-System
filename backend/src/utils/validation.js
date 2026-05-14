import validator from "validator";

export const validateRegister = ({ username, email, password }) => {
    if (!username || !email || !password) throw new Error("All fields are required");
    if (username.length < 3 || username.length > 30)
        throw new Error("Username must be between 3-30 characters");
    if (!validator.isEmail(email)) throw new Error("Invalid email address");
    if (!validator.isStrongPassword(password))
        throw new Error(
            "Password must be 8+ chars with uppercase, lowercase, number, and symbol"
        );
};

export const validateLogin = ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password are required");
    if (!validator.isEmail(email)) throw new Error("Invalid email address");
};