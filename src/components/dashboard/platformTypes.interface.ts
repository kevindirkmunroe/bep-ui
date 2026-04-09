export type Platform = "funcheapsf" | "dothebay";

export interface PlatformData {
    platform: Platform;
    status: "not_started" | "in_progress" | "submitted";
    external_url?: string;
    date_published?: string;
}
// todo I think snapshot is missing (snapshot= event processed for target platform)

export interface Event {
    event_id: string;
    title: string;
    description?: string;
    location_name: string;
    start_datetime: string;
    price?: string;
    platforms: PlatformData[];
}

export interface PlatformRowProps {
    event: Event;
    platformData: PlatformData;
    reload: () => void;
}
