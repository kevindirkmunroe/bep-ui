import {EventDetail} from "./events/eventDetailTypes.interface";

export interface EventProps {
    event_id: string;
    title: string;
    location_name: string;
    start_datetime: Date;
}

export interface CreateEventFormProps {
    userId: string; // we'll handle null before rendering
    event?: EventDetail;  // Edit mode
    onSuccess: () => void;
    onCancel: () => void;
}
