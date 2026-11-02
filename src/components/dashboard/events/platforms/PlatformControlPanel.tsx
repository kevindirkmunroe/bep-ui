import {useParams, useSearchParams} from "react-router-dom";

export function PlatformControlPanel(){
    const [searchParams, setSearchParams] = useSearchParams();

    const handleCloseWindows = () => {
        window.postMessage(
            {
                source: "AIRHORN_UI",
                type: "CLOSE_SUBMISSION_WINDOWS",
                ...searchParams
            },
            window.location.origin
        );
    }
    return (
        <div><h2>Close All</h2>
            <button onClick={handleCloseWindows}>Close All</button>
            Platform: {searchParams.platformWindowId}
            Reference: {searchParams.referenceWindowId}
        </div>
    )
}
