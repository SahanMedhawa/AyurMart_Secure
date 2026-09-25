import { useState } from "react";
import { useSellerAuthContext } from "./useSellerAuthContext";

export const useSellerSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useSellerAuthContext()
  
    const sellersignup = async (firstName, lastName, email, mobile, address, password) => {
      setIsLoading(true)
      setError(null)
  
      try {
        const response = await fetch('http://localhost:7004/api/seller/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ firstName, lastName, email, mobile, address, password })
        })
        const json = await response.json()

        if (!response.ok) {
          setError(json.error || json.message || 'Unable to create seller account.')
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
  
    return { sellersignup, isLoading, error }
  }