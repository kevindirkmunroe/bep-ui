import React, { useState, useEffect } from 'react';

function CalendarDate() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Update time every second (1000ms)
        const timer = setInterval(() => {
            setTime(new Date());
        }, 60* 1000);

        // Cleanup the interval on component unmount to prevent memory leaks
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{display: "flex"}}>
            <div style={{justifyContent: "center", marginLeft: "20px", marginRight: "2px", marginTop: "2px"}}>
                <img style={{width: "24px", height: "24px", verticalAlign: "text-bottom"}} src={"/icons8-calendar-24.png"} alt={'.'} />
            </div>
            <div style={{
                    margin: "3px"}}>
                    <p>{time.toLocaleDateString()}</p>
            </div>
        </div>
    );
}

export default CalendarDate;
