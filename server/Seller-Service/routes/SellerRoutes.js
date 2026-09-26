import express from "express";
import rateLimit from "express-rate-limit";
import requireAuth from '../middlewares/requireAuth.js'
import SellerController from '../controllers/SellerController.js';

const router = express.Router();
const sellerLoginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: 'Too many login attempts, please try again later.' },
});

router.post('/login', sellerLoginLimiter, SellerController.loginSeller)
router.post('/signup', SellerController.signupSeller)
router.get('/:id', SellerController.getaProduct);
router.post('/', SellerController.createProdcut);
router.put('/:id', SellerController.updateProduct);
router.get('/', SellerController.getAllProducts);

export default router;