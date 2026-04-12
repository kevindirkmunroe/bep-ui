import {PlatformRow} from "./PlatformRow";
import {Event} from "./platformTypes.interface";

export function PlatformList(
    {event, reload, updatePlatformStatus}:
        {event: Event;
         reload: () => Promise<void>;
         updatePlatformStatus: (platform: string, status: string) => void}
    ) {
    return (
        <div>
            {event.platforms.map((p) => (
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
