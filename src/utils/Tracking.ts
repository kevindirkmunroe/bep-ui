import Hashids from 'hashids'
const hashids = new Hashids('Airhorn.events', 6);

export function encode(number: number){
    return hashids.encode(number);
}

export function decode(id: string){
    return hashids.decode(id);
}

export function buildTrackingUrl(trackingCode: number){
    const trackingBase = import.meta.env.VITE_TRACKING_BASE_URL;
    console.log(
        "TRACKING:",
        import.meta.env.VITE_TRACKING_BASE_URL
    );
    const trackingUrl = `${trackingBase}/r/${encode(trackingCode)}`;
    console.log(`return tracking url: ${trackingUrl}`);
    return trackingUrl;
}
