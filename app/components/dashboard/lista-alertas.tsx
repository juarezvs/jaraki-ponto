import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Inconsistencia {
  id: string;
  data: string;
  descricao: string;
  status: 'Pendente' | 'Análise';
}

export function ListaAlertas({ itens }: { itens: Inconsistencia[] }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm transition-colors duration-300">
      <h3 className="text-sm font-semibold text-foreground mb-4">Inconsistências Pendentes de Tratamento</h3>
      {itens.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/10">
          <CheckCircle2 className="h-4 w-4" />
          <span>Nenhuma pendência ou vício de marcação identificado.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {itens.map((item) => (
            <div key={item.id} className="flex items-start justify-between p-3 bg-background border border-card-border rounded-lg text-sm transition-colors">
              <div className="flex gap-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{item.descricao}</p>
                  <p className="text-xs text-muted mt-0.5">Ocorrência em: {item.data}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.status === 'Pendente' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}