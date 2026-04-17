import {EventDetail} from "../eventDetailTypes.interface";

export type Platform = "funcheapsf" | "visitoakland";

export interface PlatformData {
    platform: Platform;
    status: "not_started" | "in_progress" | "submitted";
    external_url?: string;
    date_published?: string;
}
// todo I think snapshot is missing (snapshot= event processed for target platform)

export interface PlatformRowProps {
    event: EventDetail;
    platformData: PlatformData;
    updatePlatformStatus: (platform: string, status: string) => void;
    reload: () => void;
}
