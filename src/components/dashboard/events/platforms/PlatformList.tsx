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
        <div>
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
