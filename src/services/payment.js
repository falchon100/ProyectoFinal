import Stripe from 'stripe';
import  config from '../config/config.js'

const key = config.KEY_PRIVATE_STRIPE;

export default class PaymentService{
    constructor(){
        this.stripe = new Stripe(key)
    }

    
    createPaymentIntent = async (data)=>{
        const paymentIntent =  await this.stripe.paymentIntents.create(data)

        return paymentIntent
    }
}