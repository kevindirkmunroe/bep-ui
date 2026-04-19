import React, { useState, useEffect } from 'react';

function CalendarDate() {
    const [time, setTime] = useState(new Date());
    const [showTime, setShowTime] = useState(false);

    useEffect(() => {
        // Update time every second (1000ms)
        const timer = setInterval(() => {
            setTime(new Date());
        }, 60* 1000);

        // Cleanup the interval on component unmount to prevent memory leaks
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{display: "flex"}} onClick={() => setShowTime(!showTime)}>
            <div style={{justifyContent: "center", marginLeft: "4px", marginRight: "4px", marginTop: "2px"}}>📅</div>
            {showTime && (
                <div style={{
                    margin: "3px"}}>
                    <p>{time.toLocaleDateString()}</p>
                </div>
            )}
        </div>
    );
}

export default CalendarDate;
