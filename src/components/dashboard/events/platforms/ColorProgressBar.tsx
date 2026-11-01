import {interpolateThreeColors} from "./colorTransformations";
import {PlatformData} from "./platformTypes.interface";

export function ColorProgressBar({platforms}  : {platforms :PlatformData[]}) {

    const startColor = "#FF0000";  // Red
    const middleColor =    "#FFFF00";  // Yellow
    const endColor =    "#00FF00";  // Green

    const totalSteps= platforms.length;
    const stepCount = platforms.filter(p => p.status === "submitted").length;

    const progress = Math.max(
        0,
        Math.min(100, (stepCount / Math.max(1, totalSteps)) * 100)
    );

    const getStatusEmoji = (done: number, total:number) => {
        if(done === 0){
            return("🔴")
        }else if(done == total){
            return("✅")
        }else{
            return("🟠")
        }
    }

    const color = interpolateThreeColors(
        startColor,
        middleColor,
        endColor,
        totalSteps,
        stepCount
    );

    return (
        <>
            <div style={{padding: "2px", fontSize: "15px"}}><b>Submitted Platforms:</b>&nbsp;{Math.ceil((stepCount / totalSteps) * 100)}%&nbsp;{getStatusEmoji(stepCount, totalSteps)}</div>
            <div style={{
                width: "100%",
                height: "32px",
                fontSize: "15px",
                backgroundColor: "#e0e0e0",
                borderRadius: "8px",
                overflow: "hidden"
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: color,
                    borderRadius: "8px",
                    transition: "width 300ms ease, background-color 300ms ease"
                }} />
            </div>
        </>
    );
}
