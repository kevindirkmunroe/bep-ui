import {useParams, useSearchParams} from "react-router-dom";
import React, {useEffect} from "react";

export function PlatformControlPanel(){
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.source !== window) return;
            if (event.origin !== window.location.origin) return;
            console.log(`[PlatformControlPanel] handling message: ${JSON.stringify(event.data)}`);
            if (event.data?.type === "CLOSE_SUBMISSION_WINDOWS_COMPLETE") {
                window.close();
            }
        };

        window.addEventListener("message", handleMessage);

        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const handleCloseWindows = () => {
        let pId, rId;
        const p = searchParams.get("platformWindowId");
        if(p){
           pId = parseInt(p, 10);
        }
        const q = searchParams.get("referenceWindowId");
        if(q){
            rId = parseInt(q, 10);
        }

        window.postMessage(
            {
                source: "AIRHORN_UI",
                type: `CLOSE_SUBMISSION_WINDOWS`,
                platformWindowId: pId,
                referenceWindowId: rId
            },
            window.location.origin
        );
    }
    return (
        <div style={{height: "150px"}}>
            <div style={{display: "flex", marginLeft: "16px", marginBottom: "12px", alignItems: "center", gap: "2px", cursor: "pointer"}}>
                <img
                    src="/airhorn.events.png"
                    alt="Logo"
                    style={{
                        height: "40px",
                        width: "auto",
                        objectFit: "contain"
                    }}
                />
                <strong style={{marginLeft: "2px", fontSize: "24px", color: "darkgray"}}><b
                    style={{color: "black"}}>Airhorn</b>.events</strong>
            </div>
            <button className="btn btn-primary" style={{fontSize: "18px"}} onClick={handleCloseWindows}>Close Popup Windows</button>
        </div>
    )
}
