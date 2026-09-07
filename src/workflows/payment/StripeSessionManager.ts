import {EventOrder} from "./EventOrder";

export interface StripeSessionManager {
    checkout(order: EventOrder): Promise<void>;
}
