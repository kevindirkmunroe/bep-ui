import { useState } from 'react';
import {Platform, PlatformStatus} from "./platformTypes.interface";

interface SkipPromoteCheckboxProps {
    disabled: boolean;
    platform: Platform;
    handleUpdateStatus: (platform: Platform, status: PlatformStatus) => void;
}

export function SkipPromoteCheckbox({disabled, platform, handleUpdateStatus}: SkipPromoteCheckboxProps) {
    const [isChecked, setIsChecked] = useState(false);

    // The event handler extracts e.target.checked
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event){
            setIsChecked(event?.target?.checked);
            handleUpdateStatus(platform, event?.target?.checked? 'skipped' : 'not_started');
        }
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
