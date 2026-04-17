import {PlatformData} from "./platforms/platformTypes.interface";

export interface EventDetail {
    name: string;
    email: string;
    event_id: string;
    title: string;
    description?: string;
    location_name: string;
    start_datetime: string;
    price?: string;
    platforms: PlatformData[];
}

export type EventSummaryProps = {
    event: EventDetail;
    readOnly?: boolean;
    showRedo?: boolean;
    reload?: () => Promise<void>;
};
