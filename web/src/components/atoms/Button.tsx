interface Props {
    name: string;
    disabled?: boolean;
    disabledText?: string;
    className?: string;
    onClick?: () => void;
}

export default function Button({ name, disabled = false, disabledText = "", className = "", onClick }: Props) {
    return (
        <button
            className={`bg-blue-600 text-sm text-white font-bold py-2 px-4 my-2 w-[150px] uppercase select-none
        rounded border border-blue-400/40 transition-colors
        disabled:opacity-25 disabled:cursor-not-allowed ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {disabled && disabledText ? disabledText : name}
        </button>
    );
}
