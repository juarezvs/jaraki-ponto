'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { PDFExportButton } from '../components/pdf-export-button';


interface PontoRegistro {
  data: string;
  diaSemana: string;
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
  totalTrabalhado: string;
  saldoDia: string;
}

export default function EspelhoPontoFuncionario() {
  const registros = [
    { data: '18/05/2026', diaSemana: 'Segunda-feira', entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '17:00', totalTrabalhado: '08:00', saldoDia: '00:00', status: 'normal' },
    { data: '15/05/2026', diaSemana: 'Sexta-feira', entrada1: '07:52', saida1: '12:05', entrada2: '13:00', saida2: '18:15', totalTrabalhado: '09:18', saldoDia: '+01:18', status: 'extra', observacao: 'Hora extra autorizada' },
  ];

  // Mapeamento semântico das colunas que vão sair no PDF físico
  const colunasPDF = [
    { header: 'Data', accessor: (item: PontoRegistro) => `${item.data} (${item.diaSemana.split('-')[0]})` },
    { header: 'Entrada 1', accessor: 'entrada1' as const, align: 'center' as const },
    { header: 'Almoço (S)', accessor: 'saida1' as const, align: 'center' as const },
    { header: 'Almoço (E)', accessor: 'entrada2' as const, align: 'center' as const },
    { header: 'Saída 2', accessor: 'saida2' as const, align: 'center' as const },
    { header: 'Total', accessor: 'totalTrabalhado' as const, align: 'center' as const },
    { header: 'Saldo', accessor: 'saldoDia' as const, align: 'right' as const },
  ];

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-card-border pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" /> Espelho de Ponto Eletrônico
          </h2>
          <p className="text-muted text-sm">Consulte suas marcações, saldos diários e justificativas.</p>
        </div>
        {/* REPLICANDO O COMPONENTE COMPONETIZADO COM TIPAGEM ESTRITA */}
        <PDFExportButton 
          title="Espelho de Ponto Eletrônico - Juarez Silva"
          filename="espelho-ponto-juarez-2026"
          columns={colunasPDF}
          data={registros}
          buttonText="Exportar Folha de Ponto"
        />
        </div>

      <div className="bg-card rounded-xl border border-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-card-border text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="py-3 px-4">Data / Dia</th>
                <th className="py-3 px-3 text-center">Entrada 1</th>
                <th className="py-3 px-3 text-center">Saída 1</th>
                <th className="py-3 px-3 text-center">Entrada 2</th>
                <th className="py-3 px-3 text-center">Saída 2</th>
                <th className="py-3 px-3 text-center">Trabalhado</th>
                <th className="py-3 px-3 text-center">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm">
              {registros.map((reg, index) => (
                <tr key={index} className="hover:bg-muted-light/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    <div>{reg.data}</div>
                    <div className="text-[11px] text-muted font-normal">{reg.diaSemana}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-xs text-foreground/80">{reg.entrada1}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-xs text-foreground/80">{reg.saida1}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-xs text-foreground/80">{reg.entrada2}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-xs text-foreground/80">{reg.saida2}</td>
                  <td className="py-3.5 px-3 text-center font-semibold text-foreground">{reg.totalTrabalhado}</td>
                  <td className={`py-3.5 px-3 text-center font-mono text-xs font-bold ${reg.saldoDia.startsWith('+') ? 'text-success' : 'text-foreground/50'}`}>{reg.saldoDia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}