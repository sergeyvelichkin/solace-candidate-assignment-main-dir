import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: ReactNode;
    wrapperClassName?: string;
};

export const Input = ({ label, wrapperClassName = "", className = "", id, ...props }: InputProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className={wrapperClassName}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full rounded border-2 border-black px-3 py-2 ${className}`}
                {...props}
            />
        </div>
    );
};
