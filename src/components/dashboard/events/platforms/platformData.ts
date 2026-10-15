import {Platform} from "./platformTypes.interface";

const PLATFORM_URLS: Record<Platform, string> = {
    funcheapsf: "https://sf.funcheap.com/submit-form",
    visitoakland: "https://www.visitoakland.com/events/submit-an-event/",
    sfstation: "https://www.sfstation.com/event/add",
    indybay: "https://www.indybay.org/calendar/event_add.php",
    dothebay: "https://dothebay.com/events/new",
    sfweekly: "https://www.sfweekly.com/events/",
    eastbaymagazine: "https://hub.cityspark.com/Event/Submission/EastBayMagazine"
};

export function getPlatformUrl(platform: Platform){
    return PLATFORM_URLS[platform];
}

export const getPlatformFromUrl = (url: string): Platform | undefined => {
    return (Object.keys(PLATFORM_URLS) as Platform[])
        .find(k => PLATFORM_URLS[k] === url);
}
