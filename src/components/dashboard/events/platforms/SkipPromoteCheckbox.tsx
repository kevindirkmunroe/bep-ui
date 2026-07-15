import { useState } from 'react';

export function SkipPromoteCheckbox({disabled, platform, handleUpdateStatus}) {
    const [isChecked, setIsChecked] = useState(false);

    // The event handler extracts e.target.checked
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        handleUpdateStatus(platform, event.target.checked? 'skipped' : 'not_started');
    };

    return (
        <div style={{fontSize: '16px', marginTop: '18px'}}>
            <label>
                <input
                    disabled={disabled}
                    type="checkbox"
                    className="platform-checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                Skip
            </label>
        </div>
    );
}
