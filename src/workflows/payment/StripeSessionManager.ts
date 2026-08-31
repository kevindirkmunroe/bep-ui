import {EventOrder} from "./EventOrder";

export interface StripeSessionManager {
    checkout(order: EventOrder): Promise<StripeCheckoutResult>;
}

export interface StripeCheckoutResult {
    ok: boolean;
    checkoutSessionId: string;
    paymentIntentId: string;
    paymentStatus:
        | "succeeded"
        | "requires_action"
        | "processing"
        | "requires_payment_method"
        | "canceled";
    amount: number;
}
