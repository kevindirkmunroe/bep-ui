export interface FacebookHost {
    name: string;
    url: string;
    type: string;
}

export interface FacebookEventData {
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
    location_name: string;
    address: string;
    website: string;
    image_url: string;
}

export interface FacebookEventRaw {
    event_id: string;
    name: string;
    description: string;
    url: string;

    start_timestamp: number;
    end_timestamp: number;

    start_date: string;
    end_date: string;
    formatted_date: string;
    timezone: string;

    is_online: boolean;
    is_canceled: boolean;

    location_name: string;
    location_address: string;
    location_city: string;

    latitude: number;
    longitude: number;

    photo_url: string;
    video_url: string;

    hosts: FacebookHost[];

    categories: string[];

    ticket_url: string;
    online_type: string;

    users_responded: number;

    input_url: string;
    scraped_at: string;
}

export interface FacebookEventResponseType {
    data: FacebookEventData;
    raw: FacebookEventRaw;
}
