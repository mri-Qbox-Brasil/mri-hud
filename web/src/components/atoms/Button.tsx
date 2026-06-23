import { MriButton } from "@mriqbox/ui-kit";

interface Props {
    name: string;
    disabled?: boolean;
    disabledText?: string;
    className?: string;
    onClick?: () => void;
}

// Wrapper fino sobre MriButton do @mriqbox/ui-kit — mantem a API local
// (name/disabledText) que os paineis ja consomem, mas o visual e o tema do
// kit (reage a convar mri:color via --primary). Largura fixa 150px e uppercase
// preservados pra nao quebrar o layout dos paineis.
export default function Button({ name, disabled = false, disabledText = "", className = "", onClick }: Props) {
    return (
        <MriButton
            disabled={disabled}
            onClick={onClick}
            className={`my-2 w-[150px] uppercase font-bold ${className}`}
        >
            {disabled && disabledText ? disabledText : name}
        </MriButton>
    );
}
