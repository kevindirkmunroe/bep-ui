import {EventDetail} from "../eventDetailTypes.interface";

export type Platform = "funcheapsf" | "visitoakland" | "sfstation" | "indybay" | "dothebay" | "sfweekly";

export type PlatformStatus =
    | "not_started"
    | "in_progress"
    | "submitted"
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

export const PLATFORM_ICONS = {
    "funcheapsf": "/funcheapsf.jpg",
    "visitoakland": "/visit_oakland.jpg",
    "sfstation": "/sfstation.jpg",
    "indybay":"/indybay.jpg",
    "dothebay": "/do_the_bay.jpg",
    "sfweekly": "/sfweekly2.jpg"
}

export const PRINTABLE_PLATFORM = {
    "funcheapsf": "Funcheap SF",
    "visitoakland": "Visit Oakland",
    "sfstation": "SF Station",
    "indybay":"IndyBay",
    "dothebay": "Do The Bay",
    "sfweekly": "SF Weekly"
}
