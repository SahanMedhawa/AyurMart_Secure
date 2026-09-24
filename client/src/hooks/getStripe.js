import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
    if(!stripePromise){
        const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

        if(!publishableKey || publishableKey.startsWith('sk_')){
            throw new Error('REACT_APP_STRIPE_PUBLISHABLE_KEY must be a Stripe publishable key.');
        }

        stripePromise = loadStripe(publishableKey);
    }

    return stripePromise;
}

export default getStripe;