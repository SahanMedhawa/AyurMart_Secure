import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    Grid,
    Alert,
    CircularProgress,
    Card,
    CardMedia,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpaIcon from '@mui/icons-material/Spa';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSellerAuthContext } from '../../hooks/useSellerAuthContext';
import { useSellerLogout } from '../../hooks/useSellerLogout';
import { cleanImageUrl } from '../../utils/imageUtils';

const EditProductForm = () => {
    const { id } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [googleLinkConverted, setGoogleLinkConverted] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch product details
                const response = await fetch(`http://localhost:7005/api/product/${id}`);
                const data = await response.json();

                if (response.ok && data) {
                    const rawImg = data.images && data.images.length > 0 ? (data.images[0].url || '') : '';
                    const cleaned = cleanImageUrl(rawImg);
                    setProduct({
                        title: data.title || '',
                        description: data.description || '',
                        price: data.price !== undefined ? data.price : '',
                        category: data.category || '',
                        brand: data.brand || '',
                        quantity: data.quantity !== undefined ? data.quantity : '',
                        images: [{ url: cleaned }],
                    });
                } else {
                    setStatus({ type: 'error', message: 'Failed to find product.' });
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setStatus({ type: 'error', message: 'Error connecting to product service.' });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setStatus({ type: '', message: '' });

        // Ensure final image url is cleaned
        const cleanedImages = product.images.map(img => ({
            url: cleanImageUrl(img.url)
        }));

        const payload = {
            ...product,
            images: cleanedImages
        };

        try {
            // First attempt to update via Seller-Service (port 7004), then fallback to Product-Service (port 7005)
            try {
                await axios.put(`http://localhost:7004/api/seller/${id}`, payload);
            } catch (err) {
                await axios.put(`http://localhost:7005/api/product/${id}`, payload);
            }

            setStatus({ type: 'success', message: 'Product updated successfully! Redirecting to dashboard...' });
            setTimeout(() => {
                navigate('/seller-dashboard');
            }, 1200);
        } catch (error) {
            console.error("Error updating product:", error);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to update product. Please check your inputs.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const currentImageUrl = product.images && product.images[0] ? product.images[0].url : '';

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
                        Dashboard
                    </Button>
                    <Button
                        component={Link}
                        to="/addProduct"
                        startIcon={<AddCircleOutlineIcon />}
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

            {/* Main Content */}
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

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                Edit Product
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Update product details, pricing, stock, and imagery
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
                                            value={currentImageUrl}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                            placeholder="https://example.com/image.jpg or Google Images search URL"
                                            helperText="Paste direct image URLs (.jpg, .png, etc.) or Google Images search links (auto-extracted)"
                                        />
                                    </Grid>

                                    {/* Live Image Preview */}
                                    {currentImageUrl && (
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569' }}>
                                                Image Preview:
                                            </Typography>
                                            <Card sx={{ maxWidth: 220, p: 1, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                                                <CardMedia
                                                    component="img"
                                                    height="180"
                                                    image={currentImageUrl}
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
                                            disabled={submitting}
                                            sx={{
                                                backgroundColor: '#063970',
                                                textTransform: 'none',
                                                px: 4,
                                                '&:hover': { backgroundColor: '#042750' }
                                            }}
                                        >
                                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default EditProductForm;
