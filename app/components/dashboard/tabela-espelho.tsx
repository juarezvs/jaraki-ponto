import React from 'react';

interface RegistroPonto {
  data: string;
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
  total: string;
  saldo: string;
}

export function TabelaEspelho({ registros }: { registros: RegistroPonto[] }) {
  return (
    <div className="bg-card rounded-xl border border-card-border shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-4 border-b border-card-border bg-background/40">
        <h3 className="text-sm font-semibold text-foreground">Espelho de Ponto Semanal (Últimos Dias)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-background/80 text-xs font-semibold uppercase tracking-wider text-muted border-b border-card-border">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-center">Entrada 1</th>
              <th className="px-4 py-3 text-center">Saída 1</th>
              <th className="px-4 py-3 text-center">Entrada 2</th>
              <th className="px-4 py-3 text-center">Saída 2</th>
              <th className="px-4 py-3 text-center">Carga Diária</th>
              <th className="px-4 py-3 text-right">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border text-foreground/90">
            {registros.map((reg, index) => {
              const isNegativo = reg.saldo.startsWith('-');
              return (
                <tr key={index} className="hover:bg-background/40 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-foreground">{reg.data}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs">{reg.entrada1}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs">{reg.saida1}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs">{reg.entrada2}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs">{reg.saida2}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-muted">{reg.total}</td>
                  <td className={`px-4 py-3.5 text-right font-mono text-xs font-semibold ${
                    isNegativo ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {reg.saldo}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}