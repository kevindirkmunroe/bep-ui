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
                    <strong style={{fontSize: "15px"}}><b>{event.title}</b></strong>
                    <p style={{fontSize: "14px"}}>{event.event_id}</p>
                </div>
            </div>

            <div style={{marginTop: "14px", textAlign: "left"}}><b>&nbsp;&nbsp;🟠&nbsp;&nbsp;In Progress</b></div>
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
