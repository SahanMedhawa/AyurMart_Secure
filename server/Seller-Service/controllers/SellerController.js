import asyncHandler from "express-async-handler";
import Seller from "../models/Seller.js";
import jwt from "jsonwebtoken";
import axios from "axios";

//function to get a specific product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`http://product:7005/api/product/${id}`)
        res.status(200).json(response.data)
    } catch (error) {
        throw new Error(error);
    }
});

//function to get all products to the seller dashboard
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get(`http://product:7005/api/product/`)
        res.status(200).json(response.data)

    } catch (error) {
        throw new Error(error);
    }
});

//function to add product
const createProdcut = asyncHandler(async (req, res) => {
    const product = req.body
    try {
        const productResponse = await axios.post('http://product:7005/api/product/', product);

        res.status(201).json({
            message: 'Product created',
            newProduct: productResponse.data.newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating product',
            error
        });
    }
})

// function to create token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

// login a user
const loginSeller = async (req, res) => {
    const { email, password } = req.body
    try {
        const seller = await Seller.login(email, password)

        // create a token
        const token = createToken(seller._id)

        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// signup a user
const signupSeller = async (req, res) => {
    const { firstName, lastName, email, mobile, address, password } = req.body

    try {
        const seller = await Seller.signup(firstName, lastName, email, mobile, address, password)

        // create a token
        const token = createToken(seller._id)

        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// function to update product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    try {
        const response = await axios.put(`http://product:7005/api/product/${id}`, product);
        res.json({
            message: 'Product updated',
            product: response.data
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
});

export default {
    getAllProducts,
    getaProduct,
    loginSeller,
    signupSeller,
    createProdcut,
    updateProduct
}