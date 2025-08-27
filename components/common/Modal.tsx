import React from "react";
import Button from "../common/Button";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onOk: () => void;
    onCancel: () => void;
    children?: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, onOk, onCancel, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-160">
                <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 cursor-pointer font-bold hover:text-gray-900">
                        &times;
                    </button>
                </div>
                <div className="mt-4">{children}</div>
                <div className="mt-4 flex justify-end">
                    <Button
                        title="Save"
                        className="mr-5"
                        onClick={onOk}
                        variant="secondary"
                    />
                    <Button
                        title="Cancel"
                        onClick={onCancel}
                    />
                </div>
            </div>
        </div>
    )
}

export default Modal;