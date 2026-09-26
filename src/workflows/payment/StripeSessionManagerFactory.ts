import {StripeSessionManager} from "./StripeSessionManager";
import {LiveStripeSessionManager} from "./LiveStripeSessionManager";
import {MockStripeSessionManager} from "./MockStripeSessionManager";

const sessionManagerRegistry: Record<string, new () => StripeSessionManager> = {
    live: LiveStripeSessionManager,
    mock: MockStripeSessionManager,
}

// 2. The factory object that reads the .env
export const StripeSessionManagerFactory = {
    create(): StripeSessionManager {
        // Read the env variable (fallback to a default or handle error)
        const provider = import.meta.env.VITE_STRIPE_SESSION_MANAGER?.toLowerCase() || 'mock';

        const SessionManagerClass = sessionManagerRegistry[provider];

        if (!SessionManagerClass) {
            throw new Error(`Unsupported Stripe Session Manager provider configured in .env: "${provider}"`);
        }

        return new SessionManagerClass();
    }
};
