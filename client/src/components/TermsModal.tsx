/**
 * Modal para visualizar Termo e Condições
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentTerms, getUserTermsSignature } from "@/lib/terms-service";


interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: number;
}

export default function TermsModal({ open, onOpenChange, userId }: TermsModalProps) {
  const terms = getCurrentTerms();
  const userSignature = userId ? getUserTermsSignature(userId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Termo e Condições de Uso</DialogTitle>
          <DialogDescription>
            Versão {terms.version} - Última atualização: {new Date(terms.lastUpdated).toLocaleDateString('pt-BR')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96 w-full rounded-md border border-border p-4">
          <div className="space-y-4 pr-4">
            <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
              {terms.content}
            </div>
          </div>
        </ScrollArea>

        {userSignature && (
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-2">ASSINATURA DO USUÁRIO</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Data de Assinatura</p>
                <p className="font-semibold text-foreground">
                  {new Date(userSignature.signedDate).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Versão Assinada</p>
                <p className="font-semibold text-accent">{userSignature.termsVersion}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs">IP Address</p>
                <p className="font-mono text-xs text-foreground">{userSignature.ipAddress}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
