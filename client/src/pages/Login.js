import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import { GoogleLogin } from "@react-oauth/google";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormControl, Grid, Divider, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin()
    const { googleLogin, isLoading: googleLoading, error: googleError } = useGoogleLogin();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email, password)
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        await googleLogin(credentialResponse);
    };

    const handleGoogleError = () => {
        console.error("Google Sign-In failed");
    };

    return (
        <div className="container" style={{ marginTop: "96px" }}>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    flexDirection: { xs: "column", sm: "row" }
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: 'calc(100vh - 96px)', padding: '20px' }}>
                    <Box sx={{
                        maxWidth: 450,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Box textAlign="center" sx={{ mb: 2 }}>
                            <h1>
                                Welcome Back 👋🏼
                            </h1>
                        </Box>

                        <TextField
                            id="login-email"
                            label="Email"
                            multiline
                            maxRows={4}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            style={{ width: '100%' }}
                        />

                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="login-password">Password</InputLabel>
                            <OutlinedInput
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                endAdornment={
                                    <InputAdornment position="end" >
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            style={{ width: '2rem', boxShadow: 'none', backgroundColor: 'transparent' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <Button variant="contained" disabled={isLoading || googleLoading} type="submit"
                            sx={{ color: 'white', backgroundColor: "#063970", borderColor: 'green', width: '100%', padding: 1.5, margin: 1, fontWeight: "bold" }}
                        >Login</Button>

                        {/* Divider with "or" text */}
                        <Divider sx={{ width: '100%', my: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                OR
                            </Typography>
                        </Divider>

                        {/* Google Sign-In Button */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            mb: 2
                        }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                width="350"
                                text="signin_with"
                                shape="rectangular"
                            />
                        </Box>

                        <p className="text" style={{ color: "#063970", textAlign: "center" }}>New User? <span><Link to="/signup" style={{ fontWeight: "bold", color: "#063970" }}>Signup</Link></span></p>
                        <p className="text" style={{ color: "#063970", textAlign: "center" }}><span><Link to="/reset-password" style={{ fontWeight: "bold", color: "#063970" }}>Forgot Password?</Link></span></p>

                        {error && <Alert variant="filled" severity="error" style={{ fontWeight: "bold", width: "100%" }}>{error}</Alert>}
                        {googleError && <Alert variant="filled" severity="error" style={{ fontWeight: "bold", width: "100%" }}>{googleError}</Alert>}
                    </Box>
                </Grid>
            </Box>
        </div>
    )

}

export default Login;