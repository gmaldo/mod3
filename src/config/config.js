import dotenv from "dotenv"

dotenv.config({
    path: "./src/config/.env"
});

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
};