import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * Custom hook for Google OAuth 2.0 authentication.
 * 
 * Uses the Google Identity Services credential response to extract
 * user profile data and send it to the backend for login/registration.
 * 
 * Follows the same pattern as the existing useLogin hook to maintain
 * consistency in the auth flow.
 */
export const useGoogleLogin = () => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const googleLogin = async (credentialResponse) => {
        setIsLoading(true);
        setError(null);

        try {
            // Decode the Google ID token to extract user info
            const decoded = jwtDecode(credentialResponse.credential);

            const data = {
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub, // Google's unique user ID
            };

            const response = await axios.post(
                "http://localhost:7002/api/user/google/login",
                data,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                const json = response.data;
                // Store user data in localStorage (same as regular login)
                localStorage.setItem("user", JSON.stringify(json));
                // Dispatch LOGIN action to update AuthContext
                dispatch({ type: "LOGIN", payload: json });
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setError(response.message || "Google login failed.");
            }
        } catch (err) {
            setIsLoading(false);
            setError(
                err.response?.data?.message ||
                    "Google authentication failed. Please try again."
            );
        }
    };

    return { googleLogin, isLoading, error };
};
