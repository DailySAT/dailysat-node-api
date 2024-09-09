import crypto from 'crypto';
import { cluster } from '../libs/redis.js';
import { html, transporter } from '../libs/nodeMailerConfig.js';
import { user } from '../schema.js';
import { db } from '../utils/db.js';
import { eq } from 'drizzle-orm';

export const generateCode = async (email: string, type: 'verify' | 'reset') => {
    try {
        const foundUser = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1)
            .execute(); // Execute the query

        const userObject = foundUser[0];

        if (!userObject) {
            throw new Error("No such user exists. Invalid email provided.");
        }

        if (type !== 'verify' && type !== 'reset') {
            throw new Error("Type is incorrect. It can only be 'verify' or 'reset'.");
        }

        if (type === 'verify' && userObject.isVerified) {
            throw new Error("User is already verified. No need for another verification code.");
        }

        // Generate a random integer between 1000 and 9999
        const token = crypto.randomInt(1000, 10000);
        const tokenString = token.toString();
        const tokenList = Array.from(tokenString); // Convert string to array of characters

        // Put token into Redis with email as key, and set expiration to 5 minutes
        await cluster.setex(`${type}:${email}`, 300, token.toString());
        const htmlCode = await html(userObject.name, tokenList, type);

        // Send email
        await transporter.sendMail({
            from: "hemitvpatel@gmail.com",
            to: email,
            subject: `Your ${type} code`,
            html: htmlCode
        });

        return { success: true, message: "Token sent to the user" };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
