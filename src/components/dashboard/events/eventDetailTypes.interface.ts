import {PlatformData} from "./platforms/platformTypes.interface";
import React from "react";

export interface EventDetail {
    name: string;
    email: string;
    event_id: string;
    title: string;
    description?: string;
    location_name: string;
    start_datetime: string;
    address?: string;
    price?: string;
    platforms: PlatformData[];
}

export type EventSummaryProps = {
    event: EventDetail;
    readOnly?: boolean;
    showRedo?: boolean;
    reload?: () => Promise<void>;
    onEdit?: React.Dispatch<React.SetStateAction<EventDetail | null>>;
};
