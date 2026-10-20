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
            <div style={{
                    color: "#D2492C",
                    marginLeft: "10px"}}>
                    <p style={{fontSize: '20px', fontWeight: "bold"}}>{time.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
            </div>
        </div>
    );
}

export default CalendarDate;
