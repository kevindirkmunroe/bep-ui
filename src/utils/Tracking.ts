import Hashids from 'hashids'
const hashids = new Hashids('Airhorn.events', 6);

export function encode(number: number){
    return hashids.encode(number);
}

export default function buildTrackingUrl(trackingCode: number){
    const trackingBase = import.meta.env.VITE_TRACKING_BASE_URL;
    return `${trackingBase}/r/${encode(trackingCode)}`;
}
