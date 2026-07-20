import {
    DoTheBayPayload,
    FunCheapPayload,
    IndyBayPayload,
    PayloadTransformation,
    SFStationPayload,
    VisitOaklandPayload
} from "./payloadTypes.interface";
import {api} from "../../../../utils/api";
import {Platform} from "./platformTypes.interface";
import {zipToVisitOaklandDistrict} from "./regionMappings";

type PayloadTransformationMap = Record<Platform, PayloadTransformation>;

const indybayTransformation : PayloadTransformation = async (event, platform) : Promise<IndyBayPayload> => {
    let region = "California"; // default to California
    try{
        const res = await api.get(`/mapRegion`,
            {
                params: {
                    zip: event.zip?.toString(), platform: platform
                }
            });
        region = res.data.region;
    }catch(err){
        console.log(`Error fetching City: ${err}`);
    }

    return {
        name: event.name,
        email: event.email,
        title: event.title,
        phone: event.phone,
        topic: 'Arts + Action',
        event_type: 'other',
        description: event.description,
        date: event.start_datetime,
        location: event.location_name,
        region: region,
    };
}

const funcheapsfTransformation: PayloadTransformation = async (event, platform) : Promise<FunCheapPayload> => {
    let region = "San Francisco"; // default to SF
    try{
        const res = await api.get(`/mapRegion`,
            {
                params: {
                    zip: event.zip?.toString(), platform: platform
                }
            });
        region = res.data.region;
    }catch(err){
        console.log(`Error fetching City: ${err}`);
    }

    return {
        title: event.price === "Free"
            ? `Free: ${event.title}`
            : event.title,
        description: event.description,
        date: event.start_datetime,
        location: event.location_name,
        name: event.name,
        organization: event.organization,
        email: event.email,
        phone: event.phone,
        website: event.website,
        address: event.address,
        region: region,
        category: event.category,
    };
}

const sfstationTransformation: PayloadTransformation = async (event, platform) : Promise<SFStationPayload> => {
    return {
        title: event.title,
        description: event.description,
        date: event.start_datetime,
        location: event.location_name,
        ticket_link : event.website,
        category: event.category,
    };
}

const dothebayTransformation: PayloadTransformation = async (event, platform) : Promise<DoTheBayPayload> => {
    return {
        name: event.name,
        email: event.email,
        title: event.title,
        description: event.description,
        date: event.start_datetime,
        venue: event.location_name,
        ticket_url : event.website,
        category: event.category,
    };
}

const visitOaklandTransformation: PayloadTransformation = async (event, platform) : Promise<VisitOaklandPayload> => {
    const zip: string = event.zip || '';
    let region = zipToVisitOaklandDistrict(zip);
    let city = null;
    try{console.log(`calling mapCity with zip ${event.zip}`);
        const res = await api.get(`/mapCity`,
            {
                params: {
                    zip: event.zip?.toString(), platform: platform
                }
            });
        console.log(`MapCity res=${JSON.stringify(res.data)}`);
        city = res.data.city;
    }catch(err){
        console.log(`[PlatformRow] Error fetching City: ${err}`);
    }
    console.log(`[PlatformRow] zip: ${event.zip}, city: ${city}`);
    return {
        name: event.name,
        address: event.address,
        email: event.email,
        title: event.title,
        phone: event.phone,
        price: event.price,
        zip: event.zip,
        organization: event.organization,
        website: event.website,
        description: event.description,
        date: event.start_datetime,
        location_name: event.location_name,
        region: region,
        category: event.category,
        city: city
    };
}

export const PAYLOAD_TRANSFORMATIONS : PayloadTransformationMap = {
    indybay: indybayTransformation,
    funcheapsf: funcheapsfTransformation,
    sfstation: sfstationTransformation,
    visitoakland: visitOaklandTransformation,
    dothebay: dothebayTransformation,
}
