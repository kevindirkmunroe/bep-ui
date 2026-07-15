import {EventDetail} from "../eventDetailTypes.interface";

export type Platform = "funcheapsf" | "visitoakland" | "sfstation" | "indybay";

export interface PlatformData {
    platform: Platform;
    status: "not_started" | "in_progress" | "submitted" | "skipped" | "published";
    external_url?: string;
    date_published?: string;
}

export interface PlatformRowProps {
    event: EventDetail;
    platformData: PlatformData;
    updatePlatformStatus: (platform: string, status: string) => void;
    reload: () => void;
    extensionInstalled: boolean;
}
