import {PLATFORM_ICONS, PRINTABLE_PLATFORM} from "./platforms/platformTypes.interface";
import {EventDetail} from "./eventDetailTypes.interface";
import "./eventCompletionLog.css";
export function EventCompletionLog({ event }: { event: EventDetail }) {
    const submittedPlatforms = event.platforms.filter(
        p => p.status === "submitted"
    );

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "—";

        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() - 7);

        return newDate.toLocaleString("en-US", {
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
                    <span style={{fontSize: "18px"}}><b><u>Event ID</u></b></span>
                    <strong style={{fontSize: "15px"}}>{event.event_id}</strong>
                </div>

                <div>
                    <span style={{fontSize: "18px"}}><b><u>Title</u></b></span>
                    <strong style={{fontSize: "15px"}}>{event.title}</strong>
                </div>
            </div>

            <div className="completion-divider" />

            <table className="completion-table">
                <thead>
                <tr>
                    <th>Delivery Platform</th>
                    <th>Date Submitted</th>
                    <th>Delivery Status</th>
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
                        <td>{p.platform === 'indybay'? "Published":
                            (p.platform  === 'sfstation' ? "Published after Verification" : "Delivered")}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}
