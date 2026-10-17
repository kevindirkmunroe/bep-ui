export interface AddressFields {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
}

export function parseAddress(address: string): AddressFields {
    const result: AddressFields = {};

    if (!address?.trim()) return result;

    const parts = address
        .trim()
        .replace(/\s+/g, " ")
        .split(",")
        .map(part => part.trim())
        .filter(Boolean);

    // Extract ZIP code from the end
    let remaining = parts.join(", ");
    const zipMatch = remaining.match(/\b(\d{5}(?:-\d{4})?)$/);

    if (zipMatch) {
        result.zip = zipMatch[1];
        remaining = remaining.slice(0, zipMatch.index).trim();
        remaining = remaining.replace(/,\s*$/, "");
    }

    const segments = remaining
        .split(",")
        .map(part => part.trim())
        .filter(Boolean);

    // Extract state abbreviation from the final segment
    const last = segments[segments.length - 1];

    if (last) {
        const stateMatch = last.match(/\b([A-Z]{2})$/i);

        if (stateMatch) {
            result.state = stateMatch[1].toUpperCase();

            const prefix = last.slice(0, stateMatch.index).trim();

            if (prefix) {
                segments[segments.length - 1] = prefix;
            } else {
                segments.pop();
            }
        }
    }

    // Remaining segments: street, city
    if (segments.length >= 2) {
        result.city = segments.pop();
        result.street = segments.join(", ");
    } else if (segments.length === 1) {
        result.street = segments[0];
    }

    return result;
}
