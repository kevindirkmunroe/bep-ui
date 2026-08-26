import {EventbriteEventDetail, EventDetail, FacebookEventDetail} from "./events/eventDetailTypes.interface";

export interface CreateEventFormProps {
    userId: string; // we'll handle null before rendering
    event?: EventDetail;  // Edit mode
    initialDate: Date | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export interface ViewEventFormProps {
    event?: EventDetail;  // Edit mode
    onClose: () => void;
}

export interface ImportFacebookEventFormProps {
    userId: string; // we'll handle null before rendering
    event?: FacebookEventDetail;  // Edit mode
    onSuccess: () => void;
    onCancel: () => void;
}

export interface ImportEventbriteEventFormProps {
    userId: string; // we'll handle null before rendering
    event?: EventbriteEventDetail;  // Edit mode
    onSuccess: () => void;
    onCancel: () => void;
}
