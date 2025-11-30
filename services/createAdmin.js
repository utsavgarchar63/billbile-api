const logger = require("../logger/logger.js");
const Admin = require("../models/Admin.js")

module.exports = {
    createDefaultAdmin: async () => {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;

            // Check if admin exists
            const adminExists = await Admin.findOne({ email: adminEmail });

            if (adminExists) {
                logger.info("✅ Admin already exists");

                return;
            }

            // Create new admin
            await Admin.create({
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });

            logger.info("🎉 Default admin created successfully!");


        } catch (err) {
            console.error("❌ Error creating admin:", err.message);
        }
    }

} 