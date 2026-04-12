export type Platform = "funcheapsf" | "visitoakland";

export interface PlatformData {
    platform: Platform;
    status: "not_started" | "in_progress" | "submitted";
    external_url?: string;
    date_published?: string;
}
// todo I think snapshot is missing (snapshot= event processed for target platform)

export interface Event {
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

export interface PlatformRowProps {
    event: Event;
    platformData: PlatformData;
    updatePlatformStatus: (platform: string, status: string) => void;
    reload: () => void;
}

export interface CreateEventFormProps {
    userId: string; // we'll handle null before rendering
    onSuccess: () => void;
    onCancel: () => void;
}
