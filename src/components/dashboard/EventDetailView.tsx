import "./eventDetailView.css";
import {EventDetail} from "./events/eventDetailTypes.interface";

interface EventDetailViewProps {
    event: EventDetail;
    onClose: () => void;
}

export default function EventDetailView({
                                            event,
                                            onClose
                                        }: EventDetailViewProps) {

    const formatDateTime = (value: string) => {
        return new Date(value).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const Field = ({
                       label,
                       value
                   }: {
        label: string;
        value?: string | null;
    }) => {
        if (!value) return null;

        return (
            <div className="event-detail-field">
                <label>{label}</label>
                <div>{value}</div>
            </div>
        );
    };

    return (
        <div className="event-detail-overlay">
            <div className="event-detail-form">

                <div className="event-detail-header">
                    {event.image && (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="event-detail-image"
                        />
                    )}

                    <h2>{event.title}</h2>
                </div>

                <div className="event-detail-fields">

                    <Field
                        label="Date & Time"
                        value={
                            event.start_datetime
                                ? formatDateTime(event.start_datetime)
                                : undefined
                        }
                    />

                    <Field
                        label="Location"
                        value={event.location_name}
                    />

                    <Field
                        label="Address"
                        value={event.address}
                    />

                    <Field
                        label="City"
                        value={event.city}
                    />

                    <Field
                        label="ZIP"
                        value={event.zip}
                    />

                    <Field
                        label="Region"
                        value={event.region}
                    />

                    <Field
                        label="Category"
                        value={event.category}
                    />

                    <div className="event-detail-description">
                        <Field
                            label="Description"
                            value={event.description}
                        />
                    </div>

                    <Field
                        label="Price"
                        value={event.price}
                    />

                    <Field
                        label="Website"
                        value={event.website}
                    />

                    <Field
                        label="Organization"
                        value={event.organization}
                    />

                    <Field
                        label="Contact"
                        value={event.name}
                    />

                    <Field
                        label="Email"
                        value={event.email}
                    />

                    <Field
                        label="Phone"
                        value={event.phone}
                    />

                </div>

                <div className="event-detail-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
