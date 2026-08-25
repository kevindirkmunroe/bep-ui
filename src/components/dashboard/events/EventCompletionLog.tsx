import {PLATFORM_ICONS, PRINTABLE_PLATFORM} from "./platforms/platformTypes.interface";
import {EventDetail} from "./eventDetailTypes.interface";
import "./eventCompletionLog.css";
export function EventCompletionLog({ event }: { event: EventDetail }) {
    const submittedPlatforms = event.platforms.filter(
        p => p.status === "submitted"
    );

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        });
    };

    return (
        <div className="completion-log">

            <div className="completion-event-info">
                <div>
                    <span>Event ID</span>
                    <strong>{event.event_id}</strong>
                </div>

                <div>
                    <span>Title</span>
                    <strong>{event.title}</strong>
                </div>
            </div>

            <div className="completion-divider" />

            <table className="completion-table">
                <thead>
                <tr>
                    <th>Platform</th>
                    <th>Date Published</th>
                </tr>
                </thead>

                <tbody>
                {submittedPlatforms.map(p => (
                    <tr key={p.platform}>
                        <td>
                            <div className="completion-platform">
                                <img
                                    src={PLATFORM_ICONS[p.platform]}
                                    alt=""
                                />
                                {PRINTABLE_PLATFORM[p.platform] ?? p.platform}
                            </div>
                        </td>

                        <td>{formatDate(p.date_published)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}
