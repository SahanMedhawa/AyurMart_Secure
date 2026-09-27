import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import CouponRoutes from "./routes/CouponRoutes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

dotenv.config();

const app = express();
const PARAMS = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};
const URI = process.env.MONGOOSE_URI;
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(morgan('dev'));
app.use(express.json());

// Restrict CORS to your actual frontend origin instead of allowing everything
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(cookieParser());

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'default-src': ["'none'"],
            'frame-ancestors': ["'none'"],
            'form-action': ["'self'"],
        },
    },
}));
// Permissions-Policy isn't set by Helmet by default — add it manually
app.use((req, res, next) => {
    res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), fullscreen=(self)'
    );
    next();
});

// Disable X-Powered-By header to prevent information exposure
app.disable('x-powered-by');

app.use("/api/Coupon", CouponRoutes);

mongoose.set("strictQuery", false);
mongoose.connect(URI, PARAMS)
    .then(() => app.listen(PORT, 
        () => console.info(`Coupon Service running on PORT ${PORT} 🔥`)))
    .catch((err) => console.error(err.message));