import {EventDetail} from "../eventDetailTypes.interface";
import {Platform} from "./platformTypes.interface";
import {PlatformPayload} from "./payloadTypes";

interface BaseEventPayload {
    title: string;
    description?: string;
    date: string;
    region?: string;
    city?: string;
}

interface ContactPayload {
    name: string;
    email: string;
    phone?: string;
}

export interface FunCheapPayload extends BaseEventPayload, ContactPayload {
    location: string;
    organization?: string;
    website?: string;
    address?: string;
    region: string;
    category?: string;
}

export interface DoTheBayPayload extends BaseEventPayload, ContactPayload {
    presenterInfo?: string;
    venue: string;
    bands?: string;
    ticket_url?: string;
    category?: string;
}

export interface VisitOaklandPayload extends BaseEventPayload, ContactPayload {
    address?: string;
    price?: string;
    zip?: string;
    organization?: string;
    website?: string;
    location_name: string;
    region: string;
    category?: string;
    city?: string;
}

export interface SFStationPayload extends BaseEventPayload {
    location: string;
    ticket_link?: string;
    category?: string;
}

export interface IndyBayPayload extends BaseEventPayload, ContactPayload {
    topic: string;
    event_type: string;
    location: string;
    region: string;
}

export interface PayloadTransformation {
    (event: EventDetail, platform: Platform) : Promise<PlatformPayload>;
}
