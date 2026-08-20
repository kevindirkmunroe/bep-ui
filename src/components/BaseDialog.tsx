import Modal from "./Modal";
import {
    FaCircleInfo,
    FaCircleQuestion,
    FaCircleExclamation
} from "react-icons/fa6";

const dialogIcon = {
    alert: <FaCircleInfo />,
    confirm: <FaCircleQuestion />,
    error: <FaCircleExclamation />
};

import "./baseDialog.css";

export type DialogType = "alert" | "confirm" | "error";

type BaseDialogProps = {
    type?: DialogType;
    title?: string;
    message: string;

    confirmLabel?: string;
    cancelLabel?: string;

    onConfirm?: () => void;
    onClose: () => void;
};

export type DialogState = {
    type: DialogType;
    title?: string;
    message: string;
    confirmLabel?: string;
    onConfirm?: () => void;
} | null;

export default function BaseDialog({
                                   type = "alert",
                                   title,
                                   message,
                                   confirmLabel,
                                   cancelLabel = "Cancel",
                                   onConfirm,
                                   onClose
                               }: BaseDialogProps) {
    const resolvedTitle =
        title ??
        (type === "error"
            ? "Something went wrong"
            : type === "confirm"
                ? "Please confirm"
                : "LocalBuzz");

    const resolvedConfirmLabel =
        confirmLabel ??
        (type === "confirm" ? "Confirm" : "OK");

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div className={`dialog dialog-${type}`}>

                <div className="dialog-header">
                    <span className={`dialog-icon dialog-icon-${type}`}>
                        {dialogIcon[type]}
                    </span>

                    <h2>{resolvedTitle}</h2>
                </div>

                <div className="dialog-body">
                    <p>{message}</p>
                </div>

                <div className="dialog-actions">
                    {type === "confirm" && (
                        <button
                            type="button"
                            className="dialog-button dialog-button-secondary"
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </button>
                    )}

                    <button
                        type="button"
                        className={
                            type === "error"
                                ? "dialog-button dialog-button-error"
                                : "dialog-button dialog-button-primary"
                        }
                        onClick={handleConfirm}
                    >
                        {resolvedConfirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );

    // const resolvedTitle =
    //     title ??
    //     (type === "error"
    //         ? "Something went wrong"
    //         : type === "confirm"
    //             ? "Please confirm"
    //             : "LocalBuzz");
    //
    // const resolvedConfirmLabel =
    //     confirmLabel ??
    //     (type === "confirm" ? "Confirm" : "OK");
    //
    // const handleConfirm = () => {
    //     if (onConfirm) {
    //         onConfirm();
    //     }
    //
    //     onClose();
    // };
    //
    // return (
    //     <Modal onClose={onClose}>
    //         <div className={`dialog dialog-${type}`}>
    //             <div className="dialog-header">
    //                 <h2>{resolvedTitle}</h2>
    //             </div>
    //
    //             <div className="dialog-body">
    //                 <p>{message}</p>
    //             </div>
    //
    //             <div className="dialog-actions">
    //                 {type === "confirm" && (
    //                     <button
    //                         type="button"
    //                         className="dialog-button dialog-button-secondary"
    //                         onClick={onClose}
    //                     >
    //                         {cancelLabel}
    //                     </button>
    //                 )}
    //
    //                 <button
    //                     type="button"
    //                     className={
    //                         type === "error"
    //                             ? "dialog-button dialog-button-error"
    //                             : type === "confirm"
    //                                 ? "dialog-button dialog-button-primary"
    //                                 : "dialog-button dialog-button-primary"
    //                     }
    //                     onClick={handleConfirm}
    //                 >
    //                     {resolvedConfirmLabel}
    //                 </button>
    //             </div>
    //         </div>
    //     </Modal>
    // );
    //
}
