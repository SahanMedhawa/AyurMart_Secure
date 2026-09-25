import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Link } from "react-router-dom";
import {
    Box,
    Paper,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Rating,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Container,
    CircularProgress,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import SpaIcon from '@mui/icons-material/Spa';

const Home = () => {
    const items = [
        {
            image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cms/banners/hp-cleansebanners040523_001hden-us.jpg',
            caption: 'Natural Cleansing & Wellness'
        },
        {
            image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cms/banners/hp-bcaabanner-040523_002hden-us.jpg',
            caption: 'Ayurvedic Supplements & Nutrition'
        },
        {
            image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cms/banners/wdhdbanner0405_004hden-us.jpg',
            caption: 'Herbal Care & Holistic Living'
        }
    ];

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("");

    const fetchAllProducts = (url = "http://localhost:7005/api/product") => {
        setLoading(true);
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading products:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleFilterButtonClick = () => {
        let url = `http://localhost:7005/api/product?`;

        if (minPrice) {
            url += `price[gte]=${minPrice}&`;
        }
        if (maxPrice) {
            url += `price[lte]=${maxPrice}&`;
        }
        if (category) {
            url += `category=${encodeURIComponent(category)}&`;
        }
        if (brand) {
            url += `brand=${encodeURIComponent(brand)}&`;
        }
        if (sortBy) {
            url += `sort=${sortBy}&`;
        }
        if (url.endsWith('&') || url.endsWith('?')) {
            url = url.slice(0, -1);
        }

        fetchAllProducts(url);
    };

    const handleClearButtonClick = () => {
        setMinPrice("");
        setMaxPrice("");
        setCategory("");
        setBrand("");
        setSortBy("");
        fetchAllProducts();
    };

    return (
        <Box sx={{ overflowX: "hidden", marginTop: "70px", bgcolor: "#f8fafc", minHeight: "100vh", pb: 6 }}>
            {/* Banner Carousel */}
            <Box sx={{ width: "100%", maxHeight: 360, overflow: "hidden" }}>
                <Carousel
                    animation="slide"
                    timeout={500}
                    indicators={false}
                    navButtonsAlwaysVisible
                    navButtonsProps={{
                        style: {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            borderRadius: 4
                        }
                    }}
                >
                    {items.map((item, index) => (
                        <Box key={index} sx={{ height: { xs: 200, sm: 280, md: 360 }, width: "100%", position: "relative" }}>
                            <img
                                src={item.image}
                                alt={item.caption}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                    ))}
                </Carousel>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {/* Search & Filter Toolbar */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        bgcolor: "white",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                        Explore Ayurvedic Products
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                size='small'
                                placeholder="e.g. Herb"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                label="Brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                size='small'
                                placeholder="e.g. Siddhalepa"
                            />
                        </Grid>

                        <Grid item xs={6} md={2}>
                            <TextField
                                type='number'
                                fullWidth
                                label="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                size='small'
                            />
                        </Grid>

                        <Grid item xs={6} md={2}>
                            <TextField
                                type='number'
                                fullWidth
                                label="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                size='small'
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size='small'>
                                <InputLabel>Sort by</InputLabel>
                                <Select
                                    label="Sort by"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem value="createdAt">Newest</MenuItem>
                                    <MenuItem value="-createdAt">Oldest</MenuItem>
                                    <MenuItem value="-price">Price: High to Low</MenuItem>
                                    <MenuItem value="price">Price: Low to High</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={3} md={1}>
                            <Button
                                variant='contained'
                                startIcon={<FilterAltIcon />}
                                onClick={handleFilterButtonClick}
                                fullWidth
                                sx={{
                                    backgroundColor: '#063970',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    height: 40,
                                    '&:hover': { backgroundColor: '#042750' }
                                }}
                            >
                                Filter
                            </Button>
                        </Grid>

                        <Grid item xs={6} sm={3} md={1}>
                            <Button
                                variant='outlined'
                                startIcon={<ClearIcon />}
                                color='inherit'
                                onClick={handleClearButtonClick}
                                fullWidth
                                sx={{ textTransform: 'none', height: 40 }}
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Products Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : products.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                        <SpaIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No products match your criteria
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                            Try adjusting your filters or search keywords
                        </Typography>
                        <Button variant="outlined" onClick={handleClearButtonClick} sx={{ textTransform: 'none' }}>
                            Reset All Filters
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                    <Card
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                            borderRadius: 3,
                                            border: "1px solid #e2e8f0",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                            transition: "all 0.25s ease-in-out",
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                                boxShadow: "0 12px 20px -8px rgba(0, 0, 0, 0.12)",
                                                borderColor: "#cbd5e1",
                                            }
                                        }}
                                    >
                                        <Box sx={{ height: 200, bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                                            {product.images && product.images.length > 0 && product.images[0].url ? (
                                                <CardMedia
                                                    component="img"
                                                    image={product.images[0].url}
                                                    alt={product.title}
                                                    sx={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                                />
                                            ) : (
                                                <SpaIcon sx={{ fontSize: 64, color: "#cbd5e1" }} />
                                            )}
                                        </Box>

                                        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", pt: 1.5 }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#0f172a",
                                                    lineHeight: 1.3,
                                                    mb: 0.5,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    height: 42,
                                                }}
                                            >
                                                {product.title}
                                            </Typography>

                                            <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 700, mb: 1 }}>
                                                Rs. {product.price}.00
                                            </Typography>

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                                                <Rating value={Number(product.totalrating) || 0} precision={0.5} size="small" readOnly />
                                                <Typography variant="caption" color="text.secondary">
                                                    ({product.ratings ? product.ratings.length : 0})
                                                </Typography>
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mt: "auto",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {product.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Home;
