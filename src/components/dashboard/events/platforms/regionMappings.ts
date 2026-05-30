const VISITOAKLAND_ZIP_TO_DISTRICT: Record<string, string> = {
    "94601": "Fruitvale",
    "94602": "Dimond District",
    "94603": "East Oakland",
    "94605": "East Oakland",
    "94606": "Chinatown",
    "94607": "Jack London District",
    "94608": "West Oakland",
    "94609": "Temescal",
    "94610": "Lake Merritt",
    "94611": "Montclair Village/Oakland Hills",
    "94612": "Uptown",
    "94613": "Montclair Village/Oakland Hills",
    "94618": "Rockridge",
    "94619": "Laurel District",
    "94621": "Airport District"
};

export function zipToVisitOaklandDistrict(city: string, zip: string) {
    if (city !== "Oakland") {
        return "Outside of Oakland";
    }
    return VISITOAKLAND_ZIP_TO_DISTRICT[zip] || "Downtown";
}
