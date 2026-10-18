import {EventDetail} from "../eventDetailTypes.interface";

export type Platform = "funcheapsf" | "visitoakland" | "sfstation" | "indybay" | "dothebay" |
                        "sfweekly" | "eastbaymagazine" | "eastbaytimes" | "patch" | "metrosiliconvalley"

export type PlatformStatus =
    | "not_started"
    | "in_progress"
    | "submitted"
    | "published";

export interface PlatformData {
    platform: Platform;
    status: PlatformStatus;
    external_url?: string;
    published_url?: string;
    date_published?: string;
    tracking_code: number;
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
    "sfweekly": "/sfweekly2.jpg",
    "eastbaymagazine": "/east-bay-magazine.png",
    "eastbaytimes": "/east-bay-times.png",
    "patch": "/patch.png",
    "metrosiliconvalley" : "/metro-silicon-valley.png"
}

export const PRINTABLE_PLATFORM = {
    "funcheapsf": "Funcheap SF",
    "visitoakland": "Visit Oakland",
    "sfstation": "SF Station",
    "indybay":"IndyBay",
    "dothebay": "Do The Bay",
    "sfweekly": "SF Weekly",
    "eastbaymagazine": "East Bay Magazine",
    "eastbaytimes": "East Bay Times",
    "patch": "Patch",
    "metrosiliconvalley": "Metro Silicon Valley"
}

export const AI_PLATFORMS: Platform[] = [] // TODO: enable when AI Agent is ready  ["eastbaytimes", "eastbaymagazine"]
export const REQUIRED_AUTH_PLATFORMS: Platform[] = ["sfstation", "eastbaymagazine", "eastbaytimes", "patch"]
