import {StripeCheckoutResult, StripeSessionManager} from "./StripeSessionManager";
import {EventOrder} from "./EventOrder";

export class MockStripeSessionManager implements StripeSessionManager {
    async checkout(
        order: EventOrder
    ): Promise<StripeCheckoutResult> {

        console.log(`[MockStripeSessionManager] checkout order ${JSON.stringify(order)}`);
        return {
            ok: true,
            checkoutSessionId: `cs_mock_${crypto.randomUUID()}`,
            paymentIntentId: `pi_mock_${crypto.randomUUID()}`,
            paymentStatus: "succeeded",
            amount: this.getOrderCost(order)
        };
    }

    private getOrderCost(order: EventOrder): number {
        switch (order.promote_selection) {
            case "DIY":
                return 1995;

            case "PRO":
                return 2995;

            default:
                throw new Error(
                    `Invalid promote selection: ${order.promote_selection}`
                );
        }
    }
}
