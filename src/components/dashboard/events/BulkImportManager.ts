import { api } from "../../../utils/api";
import { EventDetail } from "./eventDetailTypes.interface";
import {MappedEvent} from "../../../utils/googleSheetsMapper";
import {formatDateTimeLocal} from "../../../utils/DateTime";
import {getZipFromAddress} from "../AddressUtils";

export interface BulkInsertEventItem {
    [eventId: string]: EventDetail;
}

interface BulkInsertError {
    event: EventDetail;
    errorMessage: string;
}

export interface BulkImportResult {
    bulkInsertId?: string;
    events: BulkInsertEventItem[];
    errors: BulkInsertError[];
    duplicates: EventDetail[];
}

// export interface BulkImportResult {
//     imported: EventDetail[];
//     failed: {
//         event: MappedEvent;
//         error: string;
//     }[];
// }

const mappedEventToEventDetail = (event?: MappedEvent) => ({
    name: event?.name || "",
    email: event?.email || "",
    title: event?.title || "",
    description: event?.description || "",
    start_datetime: formatDateTimeLocal(event?.start_datetime) || "",
    location_name: event?.location_name || "",
    address: event?.address || "",
    zip: event?.zip || getZipFromAddress(event?.address),
    price: event?.price || "",
    organization: event?.organization || "",
    phone: event?.phone || "",
    image: event?.image || "",
    website: event?.website || "",
    imported_from: event?.imported_from || "",
    category: event?.category || "",
});

export class BulkImportManager {

    async importEvents(
        userId: string,
        source: string,
        events: MappedEvent[]
    ): Promise<BulkImportResult> {

        try {

            const response = await api.post<BulkImportResult>(
                `/users/${userId}/events/bulk`,
                { source, events }
            );

            return response.data;

        } catch (err) {
            console.error(
                "Failed to Bulk Import:",
                err
            );
        }

        return {events: [], errors: [], duplicates:[]};
    }
}
