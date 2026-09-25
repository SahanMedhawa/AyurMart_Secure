import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SpaIcon from '@mui/icons-material/Spa';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSellerAuthContext } from "../../hooks/useSellerAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { useSellerLogout } from "../../hooks/useSellerLogout";

const DrawerComp = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { user } = useAuthContext();
    const { seller } = useSellerAuthContext();
    const { logout } = useLogout();
    const { sellerlogout } = useSellerLogout();

    const handleClose = () => setOpenDrawer(false);

    return (
        <>
            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={handleClose}
                PaperProps={{ sx: { width: 280 } }}
            >
                <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, bgcolor: "#063970", color: "white" }}>
                    <SpaIcon sx={{ fontSize: 32, color: "#66bb6a" }} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'white',
                        }}
                    >
                        AYURMART
                    </Typography>
                </Box>

                <List sx={{ pt: 1 }}>
                    <ListItemButton component={Link} to="/" onClick={handleClose}>
                        <ListItemIcon><HomeIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>

                    <ListItemButton component={Link} to="/about" onClick={handleClose}>
                        <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="About Us" />
                    </ListItemButton>

                    <ListItemButton component={Link} to="/contact" onClick={handleClose}>
                        <ListItemIcon><ContactSupportIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Contact Us" />
                    </ListItemButton>
                </List>

                <Divider sx={{ my: 1 }} />

                <List>
                    {user ? (
                        <>
                            <ListItemButton component={Link} to="/cart" onClick={handleClose}>
                                <ListItemIcon><ShoppingCartIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="My Cart" />
                            </ListItemButton>

                            <ListItemButton component={Link} to={user.role === "admin" ? "/admin-dashboard" : "/user-profile"} onClick={handleClose}>
                                <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={user.role === "admin" ? "Admin Dashboard" : "My Profile"} />
                            </ListItemButton>

                            <ListItemButton onClick={() => { handleClose(); logout(); }}>
                                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
                            </ListItemButton>
                        </>
                    ) : seller ? (
                        <>
                            <ListItemButton component={Link} to="/seller-dashboard" onClick={handleClose}>
                                <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Seller Dashboard" />
                            </ListItemButton>

                            <ListItemButton component={Link} to="/addProduct" onClick={handleClose}>
                                <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Add Product" />
                            </ListItemButton>

                            <ListItemButton onClick={() => { handleClose(); sellerlogout(); }}>
                                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
                            </ListItemButton>
                        </>
                    ) : (
                        <>
                            <ListItemButton component={Link} to="/login" onClick={handleClose}>
                                <ListItemIcon><LoginIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Buyer Login" />
                            </ListItemButton>

                            <ListItemButton component={Link} to="/signup" onClick={handleClose}>
                                <ListItemIcon><AppRegistrationIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Buyer Register" />
                            </ListItemButton>

                            <Divider sx={{ my: 1 }} />

                            <ListItemButton component={Link} to="/sellerLogin" onClick={handleClose}>
                                <ListItemIcon><StorefrontIcon color="secondary" /></ListItemIcon>
                                <ListItemText primary="Seller Login" />
                            </ListItemButton>

                            <ListItemButton component={Link} to="/sellerSignup" onClick={handleClose}>
                                <ListItemIcon><StorefrontIcon color="secondary" /></ListItemIcon>
                                <ListItemText primary="Become a Seller" />
                            </ListItemButton>
                        </>
                    )}
                </List>
            </Drawer>
            <IconButton
                sx={{ color: "white" }}
                onClick={() => setOpenDrawer(!openDrawer)}
                aria-label="open drawer"
            >
                <MenuIcon />
            </IconButton>
        </>
    );
};

export default DrawerComp;