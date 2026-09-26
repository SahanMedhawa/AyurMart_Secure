import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormControl, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert"

const SellerSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [role, setRole] = useState('Seller');

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password, firstName, lastName, mobile, role)
    }

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
                                Create a Seller Account
                            </h1>
                        </Box>

                        <TextField
                            id="seller-register-firstname"
                            label="First Name"
                            multiline
                            maxRows={4}
                            onChange={(e) => setfirstName(e.target.value)}
                            value={firstName}
                            style={{ width: '100%' }}
                        />

                        <TextField
                            id="seller-register-lastname"
                            label="Last Name"
                            multiline
                            maxRows={4}
                            onChange={(e) => setlastName(e.target.value)}
                            value={lastName}
                            style={{ width: '100%' }}
                        />

                        <TextField
                            id="seller-register-email"
                            label="Email"
                            multiline
                            maxRows={4}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            style={{ width: '100%' }}
                        />

                        <TextField
                            id="seller-register-mobile"
                            label="Mobile"
                            multiline
                            maxRows={4}
                            onChange={(e) => setMobile(e.target.value)}
                            value={mobile}
                            style={{ width: '100%' }}
                        />

                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="seller-register-password">Password</InputLabel>
                            <OutlinedInput
                                id="seller-register-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                endAdornment={
                                    <InputAdornment position="end">
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
                                label="Password" />
                        </FormControl>

                        <Button variant="contained" disabled={isLoading} type="submit"
                            sx={{ color: 'white', backgroundColor: "#063970", borderColor: 'green', width: '100%', padding: 1.5, margin: 1, fontWeight: "bold" }}
                        >Signup</Button>

                        <p className="text" style={{ color: "#063970", textAlign: "center" }}>Already have an account? <span><Link to="/login" style={{ fontWeight: "bold", color: "#063970" }}>Sign in</Link></span></p>
                        {error && <Alert variant="filled" severity="error" style={{ fontWeight: "bold", width: "100%" }}>{error}</Alert>}
                    </Box>
                </Grid>
            </Box>
        </div>
    )

}

export default SellerSignup;