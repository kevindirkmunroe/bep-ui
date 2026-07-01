import {EventDetail, FacebookEventDetail} from "./events/eventDetailTypes.interface";

export interface CreateEventFormProps {
    userId: string; // we'll handle null before rendering
    event?: EventDetail;  // Edit mode
    onSuccess: () => void;
    onCancel: () => void;
}

export interface ImportFacebookEventFormProps {
    userId: string; // we'll handle null before rendering
    event?: FacebookEventDetail;  // Edit mode
    onSuccess: () => void;
    onCancel: () => void;
}
