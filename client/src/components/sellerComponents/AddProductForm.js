import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpaIcon from '@mui/icons-material/Spa';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Card, CardMedia } from '@mui/material';
import { useSellerAuthContext } from '../../hooks/useSellerAuthContext';
import { useSellerLogout } from '../../hooks/useSellerLogout';
import { cleanImageUrl } from '../../utils/imageUtils';

const AddProductForm = () => {
    const navigate = useNavigate();
    const { seller } = useSellerAuthContext();
    const { sellerlogout } = useSellerLogout();

    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        quantity: '',
        images: [{ url: '' }],
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [googleLinkConverted, setGoogleLinkConverted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const cleanedImages = product.images.map(img => ({
            url: cleanImageUrl(img.url)
        }));

        const payload = {
            ...product,
            images: cleanedImages
        };

        try {
            await axios.post('http://localhost:7004/api/seller', payload);
            setStatus({ type: 'success', message: 'Product added successfully! Redirecting to dashboard...' });
            setTimeout(() => {
                navigate('/seller-dashboard');
            }, 1200);
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to add product. Please check your inputs.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "images") {
            const cleaned = cleanImageUrl(value);
            if (value.includes('google.') && value.includes('imgurl=')) {
                setGoogleLinkConverted(true);
            } else {
                setGoogleLinkConverted(false);
            }
            setProduct({
                ...product,
                images: [{ url: cleaned }],
            });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 70px)', marginTop: '70px', bgcolor: '#f8fafc' }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: { xs: '100%', sm: 240 },
                    flexShrink: 0,
                    backgroundColor: '#063970',
                    color: 'white',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                    <SpaIcon sx={{ color: '#66bb6a', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
                        Seller Portal
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                        component={Link}
                        to="/seller-dashboard"
                        startIcon={<DashboardIcon />}
                        sx={{
                            color: 'rgba(255,255,255,0.85)',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 1.5,
                            px: 2,
                            py: 1,
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' },
                        }}
                    >
                        Dashboard
                    </Button>
                    <Button
                        component={Link}
                        to="/addProduct"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            color: 'white',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 1.5,
                            px: 2,
                            py: 1,
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
                        }}
                    >
                        Add Product
                    </Button>
                </Box>

                {seller && (
                    <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                            Logged in as:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 2, wordBreak: 'break-all' }}>
                            {seller.email}
                        </Typography>
                        <Button
                            onClick={() => sellerlogout()}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.4)',
                                textTransform: 'none',
                                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                            }}
                        >
                            Log Out
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Main content area */}
            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ maxWidth: 800, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Button
                            component={Link}
                            to="/seller-dashboard"
                            startIcon={<ArrowBackIcon />}
                            sx={{ textTransform: 'none', color: '#475569', mr: 2 }}
                        >
                            Back to Inventory
                        </Button>
                    </Box>

                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                            Add New Product
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Fill in the product details to publish it on the marketplace
                        </Typography>

                        {status.message && (
                            <Alert severity={status.type} sx={{ mb: 3 }}>
                                {status.message}
                            </Alert>
                        )}

                        {googleLinkConverted && (
                            <Alert
                                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                                severity="info"
                                sx={{ mb: 3 }}
                            >
                                Google Images link detected! The direct image URL was automatically extracted and applied.
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Product Title"
                                        name="title"
                                        value={product.title}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="e.g., Organic Ashwagandha Powder"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={product.description}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        multiline
                                        rows={4}
                                        placeholder="Describe the product, benefits, and usage instructions..."
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Price (Rs.)"
                                        name="price"
                                        type="number"
                                        value={product.price}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        inputProps={{ min: 0, step: "1" }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Quantity in Stock"
                                        name="quantity"
                                        type="number"
                                        value={product.quantity}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Category"
                                        name="category"
                                        value={product.category}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="e.g., Herbs, Oils, Skincare"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Brand"
                                        name="brand"
                                        value={product.brand}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="e.g., Siddhalepa, Link Natural"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Image URL (Direct link or Google image search link)"
                                        name="images"
                                        value={product.images[0]?.url}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="https://example.com/image.jpg or Google Images search URL"
                                        helperText="Paste direct image URLs (.jpg, .png, etc.) or Google Images search links (auto-extracted)"
                                    />
                                </Grid>

                                {product.images[0]?.url && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569' }}>
                                            Image Preview:
                                        </Typography>
                                        <Card sx={{ maxWidth: 220, p: 1, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={product.images[0].url}
                                                alt="Preview"
                                                sx={{ objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/300x300?text=Invalid+Image+URL';
                                                }}
                                            />
                                        </Card>
                                    </Grid>
                                )}

                                <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        component={Link}
                                        to="/seller-dashboard"
                                        variant="outlined"
                                        color="inherit"
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{
                                            backgroundColor: '#2e7d32',
                                            textTransform: 'none',
                                            px: 4,
                                            '&:hover': { backgroundColor: '#1b5e20' }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish Product'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default AddProductForm;
