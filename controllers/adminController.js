const Admin = require("../models/Admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { emailExpression, validateFields } = require("../utils/utils.js");
const { HTTP_CODES } = require("../json/enums.json");
const { ADMIN_NOT_FOUND, INCORRECT_PASSWORD } = require("../json/messages.json");

module.exports = {
    adminLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            // ====================================================
            // 🔍 1. REQUIRED FIELDS VALIDATION
            // ====================================================
            const missingFields = validateFields(
                [email, password],
                ["email", "password"]
            );

            if (missingFields) {
                return res.status(HTTP_CODES.BAD_REQUEST).json({
                    status: false,
                    message: missingFields,
                });
            }

            // ====================================================
            // 🔍 2. EMAIL FORMAT VALIDATION (your custom regex)
            // ====================================================
            if (!emailExpression(email)) {
                return res.status(HTTP_CODES.BAD_REQUEST).json({
                    status: false,
                    message: "Invalid email format",
                });
            }

            // ====================================================
            // 🔍 3. PASSWORD LENGTH CHECK
            // ====================================================
            if (password.length < 6) {
                return res.status(HTTP_CODES.BAD_REQUEST).json({
                    status: false,
                    message: "Password must be at least 6 characters long",
                });
            }

            // ====================================================
            // 🔍 4. CHECK ADMIN EXISTS
            // ====================================================
            const admin = await Admin.findOne({ email });

            if (!admin) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    status: false,
                    message: ADMIN_NOT_FOUND,
                });
            }
            console.log(admin.password, password)
            // ====================================================
            // 🔍 5. COMPARE PASSWORD
            // ====================================================
            const isMatch = await bcrypt.compare(password, admin.password);
            console.log(isMatch)
            if (!isMatch) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    status: false,
                    message: INCORRECT_PASSWORD,
                });
            }

            // ====================================================
            // 🔐 6. GENERATE JWT TOKEN
            // ====================================================
            const token = jwt.sign(
                { id: admin._id, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(HTTP_CODES.OK).json({
                status: true,
                message: "Login successful",
                token,
                admin: {
                    name: admin.name,
                    email: admin.email
                }
            });

        } catch (err) {
            console.error("Login Error:", err.message);
            return res.status(500).json({
                status: false,
                message: "Internal server error",
            });
        }
    }

} 