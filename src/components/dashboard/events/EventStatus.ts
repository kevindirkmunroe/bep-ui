import {EventDetail} from "./eventDetailTypes.interface";

export function getEventStatusFromPlatforms(event: EventDetail) {
    const platforms = event.platforms || [];  // 👈 fix
    const statuses = platforms.map(p => p.status);

    if (statuses.length > 0 && statuses.every(s => s === "submitted")) {
        return "submitted";
    }


    if (statuses.some(s => s === "published")) {
        return "published";
    }

    if (statuses.some(s => s === "in_progress")) {
        return "in_progress";
    }


    return "not_started";
}

export const getIsExpired = (event: EventDetail) => {
    if (!event.start_datetime) return false;

    return new Date(event.start_datetime) < new Date();
};
