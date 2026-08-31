import {ServiceSelectionStatus} from "../../components/dashboard/events/payments/ServiceSelectionPage";

export interface EventOrder {
    order_id: string;
    promote_selection: ServiceSelectionStatus;
    event_id: string;
    retry_count: number;
    created_at: string;
    payment_completed_at: string | null;
    order_fulfilled_at: string | null;
}
export interface EventOrderPayload {
    promote_selection: ServiceSelectionStatus;
    event_id: string;
}
