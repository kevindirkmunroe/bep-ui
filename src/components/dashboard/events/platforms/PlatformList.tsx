import {PlatformRow} from "./PlatformRow";
import {PlatformData} from "./platformTypes.interface";
import {EventDetail} from "../eventDetailTypes.interface";

export function PlatformList(
    {event, reload, updatePlatformStatus}:
        {event: EventDetail;
         reload: () => Promise<void>;
         updatePlatformStatus: (platform: string, status: string) => void}
    ) {
    return (
        <div style={{height: '450px', // Fixed height
            marginTop: '10px',
            overflowY: 'auto', // Enable vertical scrolling
            border: '1px solid #ccc',
            borderRadius: 2}}>
            {event.platforms.map((p: PlatformData) => (
                <PlatformRow
                    key={p.platform}
                    event={event}
                    platformData={p}
                    updatePlatformStatus={updatePlatformStatus}
                    reload={reload}
                />
            ))}
        </div>
    );
}
