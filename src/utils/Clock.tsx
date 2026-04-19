import React, { useState, useEffect } from 'react';

function Clock() {
    const [time, setTime] = useState(new Date());
    const [showTime, setShowTime] = useState(false);

    useEffect(() => {
        // Update time every second (1000ms)
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Cleanup the interval on component unmount to prevent memory leaks
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{display: "flex"}} onClick={() => setShowTime(!showTime)}>
            {showTime && (
                <div style={{
                    margin: "3px"}}>
                    <p>{time.toLocaleDateString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}</p>
                </div>
            )}
            <div style={{justifyContent: "center", marginLeft: "4px"}}>🕑</div>
        </div>
    );
}

export default Clock;
