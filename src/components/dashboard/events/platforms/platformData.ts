import {Platform} from "./platformTypes.interface";

export function getPlatformUrl(platform: Platform){
    const urls: Record<Platform, string> = {
        funcheapsf: "https://sf.funcheap.com/submit-form",
        visitoakland: "https://www.visitoakland.com/events/submit-an-event/",
        sfstation: "https://www.sfstation.com/event/add",
        indybay: "https://www.indybay.org/calendar/event_add.php"
    };

    return urls[platform];
}
