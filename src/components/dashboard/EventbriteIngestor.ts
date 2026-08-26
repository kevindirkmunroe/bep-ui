import {EventbriteEventDetail} from "./events/eventDetailTypes.interface";
import {api} from "../../utils/api";

interface EventbriteJsonLd {
    "@type": "Event";
    name?: string;
    description?: string;
    url?: string;
    image?: string;
    startDate?: string;
    endDate?: string;

    location?: {
        name?: string;
        address?: {
            streetAddress?: string;
            addressLocality?: string;
            addressRegion?: string;
            addressCountry?: string;
        };
    };

    organizer?: {
        name?: string;
        url?: string;
    };

    offers?: Array<{
        lowPrice?: string;
        highPrice?: string;
        priceCurrency?: string;
    }>;
}
function formatPrice(offers: any[]): string {
    if (!offers?.length) {
        return "";
    }

    const offer = offers[0];

    const low = Number(offer.lowPrice);
    const high = Number(offer.highPrice);

    if (low === 0 && high > 0) {
        return `Free - $${high.toFixed(2)}`;
    }

    if (low === high) {
        return `$${low.toFixed(2)}`;
    }

    return `$${low.toFixed(2)} - $${high.toFixed(2)}`;
}

export async function getEventbriteJsonLd(eventbriteUrl: string) : Promise<EventbriteJsonLd> {
    const response = await api.get(`/events/import/eventbrite?url=${encodeURIComponent(eventbriteUrl)}`);
    const html = response.data;  //await response.text();
    if (html["@type"] !== "Event") {
        throw new Error("JSON-LD is not an Event");
    }

    return html;
}

export function eventbriteJsonLdToEventDetail(data: EventbriteJsonLd): EventbriteEventDetail {
    return {
        name: data.name ?? "",
        title: data.name ?? "",
        email: "",
        event_id: data.url?.slice(data.url.lastIndexOf('/') + 1) ?? "",
        description: data.description ?? "",
        start_datetime: data.startDate ?? "",
        location_name: data.location?.name ?? "",

        address: [
            data.location?.address?.streetAddress,
            data.location?.address?.addressLocality,
            data.location?.address?.addressRegion
        ]
            .filter(Boolean)
            .join(", "),

        price: formatPrice(data.offers),

        organization: data.organizer?.name ?? "",
        website: data.organizer?.url ?? "",
        eventbriteEventURL: data.url ?? ""
    };
}
