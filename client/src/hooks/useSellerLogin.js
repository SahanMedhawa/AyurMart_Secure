import { useState } from "react";
import { useSellerAuthContext } from "./useSellerAuthContext";

export const useSellerLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useSellerAuthContext()
  
    const sellerlogin = async (email, password) => {
      setIsLoading(true)
      setError(null)
  
      try {
        const response = await fetch('http://localhost:7004/api/seller/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, password })
        })
        const json = await response.json()

        if (!response.ok) {
          setError(json.error || json.message || 'Unable to sign in as seller.')
        } else {
          localStorage.setItem('seller', JSON.stringify(json))
          dispatch({type: 'LOGIN', payload: json})
        }
      } catch (requestError) {
        setError('Unable to connect to the seller service.')
      } finally {
        setIsLoading(false)
      }
    }
  
    return { sellerlogin, isLoading, error }
  }