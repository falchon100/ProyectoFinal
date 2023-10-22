import dotenv from 'dotenv';


dotenv.config();


export default {
    port: process.env.PORT,
    MONGO_URL :process.env.MONGO_URL,
    KEY_SECRET : process.env.KEY_SECRET,
    ADMIN_EMAIL : process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD : process.env.ADMIN_PASSWORD,
    ENV : process.env.ENV,
    GMAIL_USER : process.env.GMAIL_USER,
    GMAIL_PASSWORD : process.env.GMAIL_PASSWORD,
    JWT_SECRET :process.env.JWT_SECRET,
    KEY_PRIVATE_STRIPE : process.env.KEY_PRIVATE_STRIPE,
    KEY_PUBLIC_STRIPE : process.env.KEY_PUBLIC_STRIPE,
    DOMAIN : process.env.DOMAIN
}