export const getZipFromAddress = (address: string | undefined) => {
    // Regex to match standard US 5-digit zip or 9-digit ZIP (e.g., 12345 or 12345-6789)
    const usZipRegex = /\b\d{5}(?:-\d{4})?\b/;

    const usMatch = address?.match(usZipRegex);
    if (usMatch) return usMatch[0];

    return "94101";
}
