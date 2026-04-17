import {EventDetail} from "./eventDetailTypes.interface";

export function getEventStatus(event: EventDetail) {
    const platforms = event.platforms || [];  // 👈 fix
    const statuses = platforms.map(p => p.status);

    if (statuses.every(s => s === "submitted")) {
        return "submitted";
    }

    if (statuses.some(s => s === "in_progress" || s === "not_started")) {
        return "in_progress";
    }

    return "not_started";
}

export const getIsExpired = (event: EventDetail) => {
    if (!event.start_datetime) return false;

    return new Date(event.start_datetime) < new Date();
};
