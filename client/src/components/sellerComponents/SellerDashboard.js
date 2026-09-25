import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {
    Box,
    CardMedia,
    Typography,
    Rating,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Button,
    CircularProgress,
    Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import SpaIcon from '@mui/icons-material/Spa';
import { useProductsContext } from '../../hooks/useProductsContext';
import { useSellerLogout } from '../../hooks/useSellerLogout';
import { useSellerAuthContext } from '../../hooks/useSellerAuthContext';
import { cleanImageUrl } from '../../utils/imageUtils';

const SellerDashboard = () => {
    const { products, dispatch } = useProductsContext();
    const { seller } = useSellerAuthContext();
    const [loading, setLoading] = useState(true);
    const { sellerlogout } = useSellerLogout();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:7004/api/seller');
                const json = await response.json();

                if (response.ok) {
                    dispatch({ type: 'SET_PRODUCTS', payload: json });
                }
            } catch (err) {
                console.error("Error fetching seller products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [dispatch]);

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const response = await fetch('http://localhost:7005/api/product/' + productId, {
                method: 'DELETE'
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'DELETE_PRODUCT', payload: json });
            }
        } catch (err) {
            console.error("Error deleting product:", err);
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

            {/* Main content area */}
            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, minWidth: 0, overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <div>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            Product Inventory
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage and view all your published products
                        </Typography>
                    </div>
                    <Button
                        component={Link}
                        to="/addProduct"
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            backgroundColor: '#2e7d32',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#1b5e20' }
                        }}
                    >
                        Add New Product
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : !products || products.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                        <SpaIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Products Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            You haven't listed any products yet. Start selling today!
                        </Typography>
                        <Button
                            component={Link}
                            to="/addProduct"
                            variant="contained"
                            sx={{ backgroundColor: '#063970', textTransform: 'none' }}
                        >
                            Add Your First Product
                        </Button>
                    </Paper>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Table sx={{ minWidth: 700 }}>
                            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Product</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Ratings</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#475569', textAlign: 'center' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => {
                                    const cleanedImgUrl = product.images && product.images.length > 0 && product.images[0].url
                                        ? cleanImageUrl(product.images[0].url)
                                        : '';

                                    return (
                                        <TableRow key={product._id} hover>
                                            <TableCell sx={{ maxWidth: 220 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {cleanedImgUrl ? (
                                                        <CardMedia
                                                            component="img"
                                                            image={cleanedImgUrl}
                                                            alt={product.title}
                                                            sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1 }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://placehold.co/100x100?text=No+Img';
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ width: 48, height: 48, bgcolor: '#e2e8f0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <SpaIcon sx={{ color: '#94a3b8' }} />
                                                        </Box>
                                                    )}
                                                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: '#0f172a' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, '&:hover': { color: '#063970' } }}>
                                                            {product.title}
                                                        </Typography>
                                                    </Link>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={product.category || 'General'} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>
                                                Rs. {product.price}.00
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Rating value={Number(product.totalrating) || 0} size="small" readOnly />
                                                    <Typography variant="caption" color="text.secondary">
                                                        ({product.ratings ? product.ratings.length : 0})
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 250 }}>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {product.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Button
                                                        component={Link}
                                                        to={`/editProduct/${product._id}`}
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<DeleteOutlineIcon />}
                                                        onClick={() => handleDelete(product._id)}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default SellerDashboard;

