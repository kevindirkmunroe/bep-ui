import {EventDetail} from "./eventDetailTypes.interface";
import {PLATFORM_ICONS, PRINTABLE_PLATFORM} from "./platforms/platformTypes.interface";
export function EventCompletionLog({ event }: { event: EventDetail }) {
    const submittedPlatforms = event.platforms.filter(
        p => p.status === "submitted"
    );

    return (
        <div>
            <div style={{ marginBottom: "16px" }}>
                <div>
                    <strong>Event ID</strong> {event.event_id}
                </div>

                <div>
                    <strong>Title</strong> {event.title}
                </div>
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                <tr>
                    <th style={{ textAlign: "left" }}>Platform</th>
                    <th style={{ textAlign: "left" }}>
                        Date Published
                    </th>
                </tr>
                </thead>

                <tbody>
                {submittedPlatforms.length === 0 ? (
                    <tr>
                        <td colSpan={2}>
                            No submitted platforms yet.
                        </td>
                    </tr>
                ) : (
                    submittedPlatforms.map(p => (
                        <tr key={p.platform}>
                            <td
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "8px 0"
                                }}
                            >
                                <img
                                    src={PLATFORM_ICONS[p.platform]}
                                    alt={`${p.platform} logo`}
                                    style={{
                                        width: "28px",
                                        height: "28px",
                                        objectFit: "contain"
                                    }}
                                />

                                <span>
                                        {PRINTABLE_PLATFORM[p.platform]
                                            ?? p.platform}
                                    </span>
                            </td>

                            <td>
                                {p.date_published
                                    ? new Date(
                                        p.date_published
                                    ).toLocaleString()
                                    : ""}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
