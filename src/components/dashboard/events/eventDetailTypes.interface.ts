import {PlatformData} from "./platforms/platformTypes.interface";
import React from "react";
import {ServiceSelectionStatus} from "./payments/ServiceSelectionPage";

export interface EventDetail {
    name: string;
    email: string;
    event_id: string;
    title: string;
    description?: string;
    location_name: string;
    start_datetime: string;
    address?: string;
    zip?: string;
    price?: string;
    website?: string;
    organization?: string;
    phone?: string;
    image?: string;
    image_title?: string;
    platforms: PlatformData[];
    region?: string;
    category?: string;
    city?: string;
    imported_from: string | null;
    date_fields: DateFields;
}

export interface FacebookEventDetail extends Omit<EventDetail, 'event_id' | 'platforms' | 'date_fields'> {
    facebookEventURL: string;
}

export interface EventbriteEventDetail extends Omit<EventDetail, 'platforms' | 'date_fields'> {
    eventbriteEventURL: string;
}

export interface DateFields {
    start_datetime_local: string,        // "2026-06-11 21:00:00"
    event_date: string,                    // "2026-06-11"
    event_year: string,
    event_month: string,
    event_day: string,
    event_time_24h: string,   // "21:00"
    event_hour_12: string,                   // "9"
    event_minute: string,                    // "00"
    event_ampm: string
}

export type EventSummaryProps = {
    event: EventDetail;
    readOnly?: boolean;
    showAsHeader?: boolean;
    showRedo?: boolean;
    reload?: () => void;
    onEdit?: React.Dispatch<React.SetStateAction<EventDetail | null>>;
    onPromote?: (event: EventDetail) => void;
};
