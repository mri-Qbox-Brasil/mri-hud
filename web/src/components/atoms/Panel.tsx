import type { ComponentType } from "react";
import { MriAccordionItem, MriAccordionTrigger, MriAccordionContent } from "@mriqbox/ui-kit";

interface Props {
  name: string;
  /** Icone lucide opcional (componente). */
  icon?: ComponentType<{ className?: string }> | null;
  children: React.ReactNode;
  /** @deprecated a abertura agora e controlada pelo MriAccordion pai (single). */
  defaultOpen?: boolean;
}

// Secao colapsavel dos paineis de settings. NAO renderiza seu proprio
// MriAccordion — e um MriAccordionItem que vive DENTRO do MriAccordion
// (type="single") do painel pai, pra que abrir um feche os outros. Estilo card
// (borda + fundo) alinhado ao ui-kit.
export default function Panel({ name, icon: Icon = null, children }: Props) {
  const value = name.replace(/\s+/g, "-").toLowerCase();
  return (
    <MriAccordionItem value={value} className="border border-border rounded-xl bg-card overflow-hidden">
      <MriAccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline data-[state=open]:text-primary">
        <span className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          {name}
        </span>
      </MriAccordionTrigger>
      <MriAccordionContent className="px-4 pb-3 pt-0">{children}</MriAccordionContent>
    </MriAccordionItem>
  );
}
