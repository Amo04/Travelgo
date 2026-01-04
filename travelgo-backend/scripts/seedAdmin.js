const bcrypt = require('bcrypt');
const db = require('../config/db');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        const password = '123456';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Updating Admin Password...');

        // Update Admin
        await db.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, 'admin@travelgo.com']
        );

        // Update User
        await db.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, 'user@travelgo.com']
        );

        console.log('Passwords updated to: 123456');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
