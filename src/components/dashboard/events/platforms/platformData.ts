import {Platform} from "./platformTypes.interface";

export function getPlatformUrl(platform: Platform){
    const urls: Record<Platform, string> = {
        funcheapsf: "https://sf.funcheap.com/submit-form",
        visitoakland: "https://www.visitoakland.com/events/submit-an-event/"
    };

    return urls[platform];
}
