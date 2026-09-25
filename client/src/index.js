import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ProductsContextProvider } from './context/ProductContext';
import { SellerAuthContextProvider } from './context/SellerAuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
        <React.StrictMode>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <AuthContextProvider>
                    <SellerAuthContextProvider>
                        <ProductsContextProvider>
                            <App />
                        </ProductsContextProvider>
                    </SellerAuthContextProvider>
                </AuthContextProvider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    </BrowserRouter>

);