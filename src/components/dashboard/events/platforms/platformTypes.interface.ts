import {EventDetail} from "../eventDetailTypes.interface";

export type Platform = "funcheapsf" | "visitoakland" | "sfstation" | "indybay";

export type PlatformStatus =
    | "not_started"
    | "in_progress"
    | "submitted"
    | "skipped"
    | "published";

export interface PlatformData {
    platform: Platform;
    status: PlatformStatus;
    external_url?: string;
    date_published?: string;
}

export interface PlatformRowProps {
    event: EventDetail;
    platformData: PlatformData;
    updatePlatformStatus: (platform: Platform, status: PlatformStatus) => void;
    reload: () => void;
    extensionInstalled: boolean;
}
