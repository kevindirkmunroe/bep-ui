import {PlatformData} from "./platformTypes.interface"
export function ProgressBar( {platforms}  : {platforms :PlatformData[]} ) {
    const total = platforms.length;
    const done = platforms.filter(p => p.status === "submitted").length;

    const getStatusEmoji = (done: number, total:number) => {
        if(done === 0){
            return("🔴")
        }else if(done == total){
            return("✅")
        }else{
            return("🟠")
        }
    }

    return (
        <div style={{ marginBottom: 20 }}>
            <p><b>Submission Progress:</b> {done} / {total} {getStatusEmoji(done, total)}</p>
            <div style={{ background: "#eee", height: 10 }}>
                <div
                    style={{
                        width: `${(done / total) * 100}%`,
                        height: "100%",
                        background: "green"
                    }}
                />
            </div>
        </div>
    );
}
