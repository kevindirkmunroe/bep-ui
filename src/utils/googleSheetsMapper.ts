export interface GoogleSheetsData {
    spreadsheetId: string;
    eventYear: number;
    mappings: string[][];
    defaults: string[][];
    events: string[][];
}

export type MappedEvent = Record<string, string>;

function toDictionary(rows: string[][]): Record<string, string> {
    return Object.fromEntries(
        rows.slice(1)
            .filter(row => row[0]?.trim() && row[1]?.trim())
            .map(([key, value]) => [
                key.trim(),
                value.trim()
            ])
    );
}

function parseEventDateTime(
    value: string,
    year: number
): string {
    const match = value.match(
        /^([A-Za-z]{3})-(\d{1,2})\s+(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i
    );

    if (!match) {
        throw new Error(`Invalid event date/time: ${value}`);
    }

    const [, monthText, dayText, hourText, minuteText, ampm] = match;

    const months = [
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    const month = months.indexOf(monthText.toLowerCase()) + 1;
    if (!month) {
        throw new Error(`Invalid month: ${monthText}`);
    }

    let hour = Number(hourText) % 12;

    if (ampm.toLowerCase() === "pm") {
        hour += 12;
    }

    const day = Number(dayText);
    const minute = Number(minuteText ?? "0");

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        throw new Error(`Invalid calendar date: ${value}`);
    }

    return [
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`
    ].join("T");
}

export function mapGoogleSheetEvents(
    data: GoogleSheetsData
): MappedEvent[] {

    const mappings = toDictionary(data.mappings);
    const defaults = toDictionary(data.defaults);

    const [headers, ...rows] = data.events;

    if (!headers) return [];

    return rows
        .filter(row => row.some(value => value?.trim()))
        .map(row => {
            const source: Record<string, string> = {};

            headers.forEach((header, index) => {
                if (header?.trim()) {
                    source[header.trim()] = row[index]?.trim() ?? "";
                }
            });

            // Defaults first; mapped event values override them.
            const event: MappedEvent = { ...defaults };

            for (const [airhornField, sourceColumns] of
                Object.entries(mappings)) {

                const columns = sourceColumns
                    .split(",")
                    .map(col => col.trim());

                const values = columns
                    .map(col => source[col])
                    .filter(Boolean);

                if (values.length > 0) {
                    event[airhornField] = values.join(" ");
                }
            }

            if (event.start_datetime) {
                event.start_datetime = parseEventDateTime(
                    event.start_datetime,
                    data.eventYear
                );
            }

            return event;
        });
}
