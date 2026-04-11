import {PlatformRow} from "./PlatformRow";
import {Event} from "./platformTypes.interface";

export function PlatformList(
    {event, reload}:
        {event: Event;
         reload: () => Promise<void>;}
    ) {
    return (
        <div>
            {event.platforms.map((p) => (
                <PlatformRow
                    key={p.platform}
                    event={event}
                    platformData={p}
                    reload={reload}
                />
            ))}
        </div>
    );
}
