import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Tooltip,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
    Button,
    Divider,
    ListItemIcon,
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SpaIcon from '@mui/icons-material/Spa';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import DrawerComp from "./Drawer";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { useSellerAuthContext } from "../../hooks/useSellerAuthContext";
import { useSellerLogout } from "../../hooks/useSellerLogout";

const Header = () => {
    const { user } = useAuthContext();
    const { seller } = useSellerAuthContext();
    const location = useLocation();
    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down("md"));

    const { logout } = useLogout();
    const { sellerlogout } = useSellerLogout();

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElSellerPortal, setAnchorElSellerPortal] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenSellerPortalMenu = (event) => {
        setAnchorElSellerPortal(event.currentTarget);
    };

    const handleCloseSellerPortalMenu = () => {
        setAnchorElSellerPortal(null);
    };

    const handleUserLogout = () => {
        handleCloseUserMenu();
        logout();
    };

    const handleSellerLogout = () => {
        handleCloseUserMenu();
        sellerlogout();
    };

    // Calculate active tab value based on location
    const getTabValue = () => {
        if (location.pathname === "/") return 0;
        if (location.pathname === "/about") return 1;
        if (location.pathname === "/contact") return 2;
        return false;
    };

    return (
        <AppBar position="fixed" sx={{ background: "#063970", zIndex: (theme) => theme.zIndex.drawer + 1, px: { xs: 1, sm: 2 } }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "70px !important" }}>
                {/* Brand Logo & Name */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Link to="/" style={{ textDecoration: "none", color: "white", display: "flex", alignItems: "center" }}>
                        <SpaIcon sx={{ fontSize: 32, mr: 1, color: "#66bb6a" }} />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                            }}
                        >
                            AYURMART
                        </Typography>
                    </Link>
                </Box>

                {/* Mobile Drawer & Actions */}
                {isMatch ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {user && (
                            <Tooltip title="Cart">
                                <IconButton component={Link} to="/cart" sx={{ color: "white" }}>
                                    <ShoppingCartIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Profile / Account button for mobile */}
                        {(user || seller) && (
                            <>
                                <Tooltip title="Account Settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: user ? "#2e7d32" : "#0288d1",
                                                width: 36,
                                                height: 36,
                                                fontSize: "0.95rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {user
                                                ? (user.email ? user.email.charAt(0).toUpperCase() : "U")
                                                : (seller.email ? seller.email.charAt(0).toUpperCase() : "S")}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {user && [
                                        <Box key="user-info" sx={{ px: 2, py: 1 }}>
                                            <Typography variant="caption" color="text.secondary">Signed in as Buyer</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user.email}</Typography>
                                        </Box>,
                                        <Divider key="div-1" />,
                                        <MenuItem key="profile" component={Link} to={user.role === "admin" ? "/admin-dashboard" : "/user-profile"} onClick={handleCloseUserMenu}>
                                            <ListItemIcon>{user.role === "admin" ? <AdminPanelSettingsIcon fontSize="small" /> : <PersonIcon fontSize="small" />}</ListItemIcon>
                                            {user.role === "admin" ? "Admin Dashboard" : "Profile"}
                                        </MenuItem>,
                                        <MenuItem key="logout" onClick={handleUserLogout}>
                                            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    ]}

                                    {seller && [
                                        <Box key="seller-info" sx={{ px: 2, py: 1 }}>
                                            <Typography variant="caption" color="text.secondary">Signed in as Seller</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{seller.email}</Typography>
                                        </Box>,
                                        <Divider key="div-2" />,
                                        <MenuItem key="dashboard" component={Link} to="/seller-dashboard" onClick={handleCloseUserMenu}>
                                            <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                            Seller Dashboard
                                        </MenuItem>,
                                        <MenuItem key="add-prod" component={Link} to="/addProduct" onClick={handleCloseUserMenu}>
                                            <ListItemIcon><AddCircleOutlineIcon fontSize="small" /></ListItemIcon>
                                            Add Product
                                        </MenuItem>,
                                        <MenuItem key="logout-seller" onClick={handleSellerLogout}>
                                            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    ]}
                                </Menu>
                            </>
                        )}

                        <DrawerComp />
                    </Box>
                ) : (
                    /* Desktop Layout */
                    <>
                        {/* Center Navigation Tabs */}
                        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                            <Tabs
                                textColor="inherit"
                                indicatorColor="secondary"
                                value={getTabValue()}
                                sx={{
                                    '& .MuiTab-root': {
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        minWidth: 100,
                                        color: 'rgba(255,255,255,0.85)',
                                        '&.Mui-selected': { color: '#ffffff' }
                                    }
                                }}
                            >
                                <Tab label="Home" component={Link} to="/" />
                                <Tab label="About Us" component={Link} to="/about" />
                                <Tab label="Contact" component={Link} to="/contact" />
                            </Tabs>
                        </Box>

                        {/* Right-side Auth & Profile Section */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {user ? (
                                /* Buyer Logged In State */
                                <>
                                    <Tooltip title="View Cart">
                                        <IconButton component={Link} to="/cart" sx={{ color: "white", p: 1 }}>
                                            <ShoppingCartIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Account menu">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#2e7d32",
                                                    width: 38,
                                                    height: 38,
                                                    fontWeight: "bold",
                                                    fontSize: "1rem",
                                                    border: "2px solid rgba(255,255,255,0.8)"
                                                }}
                                            >
                                                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                        PaperProps={{
                                            elevation: 4,
                                            sx: { minWidth: 200, mt: 1, borderRadius: 2 }
                                        }}
                                    >
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: '#f5f5f5' }}>
                                            <Typography variant="caption" color="text.secondary">Signed in as Buyer</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{user.email}</Typography>
                                        </Box>
                                        <Divider />
                                        <MenuItem component={Link} to={user.role === "admin" ? "/admin-dashboard" : "/user-profile"} onClick={handleCloseUserMenu}>
                                            <ListItemIcon>{user.role === "admin" ? <AdminPanelSettingsIcon fontSize="small" /> : <PersonIcon fontSize="small" />}</ListItemIcon>
                                            {user.role === "admin" ? "Admin Dashboard" : "Profile"}
                                        </MenuItem>
                                        <MenuItem onClick={handleUserLogout}>
                                            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                                            <Typography color="error">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : seller ? (
                                /* Seller Logged In State */
                                <>
                                    <Button
                                        component={Link}
                                        to="/seller-dashboard"
                                        startIcon={<DashboardIcon />}
                                        variant="outlined"
                                        sx={{
                                            color: "white",
                                            borderColor: "rgba(255,255,255,0.6)",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            '&:hover': { borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)" }
                                        }}
                                    >
                                        Seller Dashboard
                                    </Button>

                                    <Button
                                        component={Link}
                                        to="/addProduct"
                                        startIcon={<AddCircleOutlineIcon />}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#2e7d32",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            '&:hover': { backgroundColor: "#1b5e20" }
                                        }}
                                    >
                                        Add Product
                                    </Button>

                                    <Tooltip title="Seller settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#0288d1",
                                                    width: 38,
                                                    height: 38,
                                                    fontWeight: "bold",
                                                    fontSize: "1rem",
                                                    border: "2px solid rgba(255,255,255,0.8)"
                                                }}
                                            >
                                                {seller.email ? seller.email.charAt(0).toUpperCase() : "S"}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>

                                    <Menu
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                        PaperProps={{
                                            elevation: 4,
                                            sx: { minWidth: 220, mt: 1, borderRadius: 2 }
                                        }}
                                    >
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: '#e1f5fe' }}>
                                            <Typography variant="caption" color="text.secondary">Verified Seller</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{seller.email}</Typography>
                                        </Box>
                                        <Divider />
                                        <MenuItem component={Link} to="/seller-dashboard" onClick={handleCloseUserMenu}>
                                            <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                            Seller Dashboard
                                        </MenuItem>
                                        <MenuItem component={Link} to="/addProduct" onClick={handleCloseUserMenu}>
                                            <ListItemIcon><AddCircleOutlineIcon fontSize="small" /></ListItemIcon>
                                            Add Product
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={handleSellerLogout}>
                                            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                                            <Typography color="error">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                /* Logged Out State - Neither Buyer nor Seller */
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        variant="text"
                                        sx={{ color: "white", textTransform: "none", fontWeight: 600 }}
                                    >
                                        Login
                                    </Button>

                                    <Button
                                        component={Link}
                                        to="/signup"
                                        variant="outlined"
                                        sx={{
                                            color: "white",
                                            borderColor: "rgba(255,255,255,0.7)",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            '&:hover': { borderColor: "white", backgroundColor: "rgba(255,255,255,0.08)" }
                                        }}
                                    >
                                        Register
                                    </Button>

                                    {/* Seller Portal Dropdown */}
                                    <Button
                                        onClick={handleOpenSellerPortalMenu}
                                        endIcon={<ArrowDropDownIcon />}
                                        startIcon={<StorefrontIcon />}
                                        sx={{
                                            color: "#a5d6a7",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            ml: 1,
                                            '&:hover': { backgroundColor: "rgba(255,255,255,0.08)" }
                                        }}
                                    >
                                        Seller Portal
                                    </Button>
                                    <Menu
                                        anchorEl={anchorElSellerPortal}
                                        open={Boolean(anchorElSellerPortal)}
                                        onClose={handleCloseSellerPortalMenu}
                                        PaperProps={{
                                            elevation: 4,
                                            sx: { minWidth: 180, mt: 1, borderRadius: 2 }
                                        }}
                                    >
                                        <MenuItem component={Link} to="/sellerLogin" onClick={handleCloseSellerPortalMenu}>
                                            Seller Login
                                        </MenuItem>
                                        <MenuItem component={Link} to="/sellerSignup" onClick={handleCloseSellerPortalMenu}>
                                            Become a Seller
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;