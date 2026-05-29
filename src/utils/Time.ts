export function isOlderThanToday(date: string) {
    return new Date(date) < new Date();
}
