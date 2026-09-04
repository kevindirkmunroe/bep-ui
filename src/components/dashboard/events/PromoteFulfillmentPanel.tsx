import "./promoteFulfillmentPanel.css";
interface PromotePanelProps {
    title: string;
    children: React.ReactNode;
}

export default function PromoteFulfillmentPanel({
                                         title,
                                         children
                                     }: PromotePanelProps) {
    return (
        <section className="promote-panel">
            <div className="promote-panel-title">
                {title === 'DIY' ?
                <img src={"/icons8-tools-30.png"} style={{ width: "18px", height: "18px"}}/>
                :
                <img src={"/icons8-robot-48.png"} style={{ width: "18px", height: "18px"}}/>
                }
                &nbsp;{title}
            </div>

            <div className="promote-panel-body">
                {children}
            </div>
        </section>
    );
}
