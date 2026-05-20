'use client';

import React from 'react';
import { Clock, Calendar, AlertCircle, FileText } from 'lucide-react';
import { CardMetrica } from './components/dashboard/card-metrica'; 
import { ListaAlertas } from './components/dashboard/lista-alertas';
import { TabelaEspelho } from './components/dashboard/tabela-espelho';

export default function DashboardPontoPage() {
  // Dados simulados baseados nos requisitos de fechamento da Diref
  const inconsistencias = [
    { id: '1', data: '14/05/2026', descricao: 'Ausência de marcação de Saída Intermediária', status: 'Pendente' as const },
    { id: '2', data: '12/05/2026', descricao: 'Incompatibilidade de carga horária mínima', status: 'Análise' as const },
    { id: '2', data: '12/05/2026', descricao: 'Incompatibilidade de carga horária mínima', status: 'Análise' as const },
    { id: '2', data: '12/05/2026', descricao: 'Incompatibilidade de carga horária mínima', status: 'Análise' as const },
    { id: '2', data: '12/05/2026', descricao: 'Incompatibilidade de carga horária mínima', status: 'Análise' as const },
  ];

  const ultimosRegistros = [
    { data: '18/05/2026', entrada1: '08:02', saida1: '12:00', entrada2: '13:02', saida2: '17:05', total: '08:05', saldo: '+00:05' },
    { data: '15/05/2026', entrada1: '07:55', saida1: '12:05', entrada2: '13:00', saida2: '16:45', total: '07:55', saldo: '-00:05' },
    { data: '14/05/2026', entrada1: '08:00', saida1: '--:--', entrada2: '13:00', saida2: '17:00', total: '08:00', saldo: '00:00' },
    { data: '13/05/2026', entrada1: '08:10', saida1: '12:00', entrada2: '13:00', saida2: '17:15', total: '08:05', saldo: '+00:05' },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 antialiased transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto space-y-6">
        
        {/* Cabeçalho do Painel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" /> Espelho de Ponto Eletrônico
            </h1>
            <p className="text-sm text-muted">Acompanhamento de assiduidade em conformidade com a Portaria Normativa DIREF.</p>
          </div>
          <div className="text-xs font-medium text-muted bg-card border border-card-border px-3 py-1.5 rounded-lg shadow-sm">
            Período de Apuração: <span className="text-foreground font-semibold">01/05/2026 a 31/05/2026</span>
          </div>
        </div>

        {/* Linha 1: Grid de Métricas Principais Regulamentadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardMetrica 
            title="Saldo de Banco de Horas"
            value="+04:25"
            subtext="Acumulado pronto para compensação"
            icon={<Clock className="h-4 w-4" />}
            variant="success"
          />
          <CardMetrica 
            title="Horas Cumpridas no Mês"
            value="96h / 160h"
            subtext="60% da jornada mensal realizada"
            icon={<Calendar className="h-4 w-4" />}
          />
          <CardMetrica 
            title="Inconsistências no Mês"
            value="02 pendências"
            subtext="Necessita de justificativa do servidor"
            icon={<AlertCircle className="h-4 w-4" />}
            variant="alert"
          />
          <CardMetrica 
            title="Dispensa / Afastamentos"
            value="00 ocorrências"
            subtext="Nenhum registro de licença homologado"
            icon={<FileText className="h-4 w-4" />}
          />
        </div>

        {/* Linha 2: Alertas e Tabela Ocupando Layout Assíncrono */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Alertas ocupam 1 coluna lateral */}
          <div className="lg:col-span-1">
            <ListaAlertas itens={inconsistencias} />
          </div>
          
          {/* A tabela principal ganha 2 colunas de espaço */}
          <div className="lg:col-span-2">
            <TabelaEspelho registros={ultimosRegistros} />
          </div>
        </div>

        {/* Rodapé Informativo Legal da Portaria */}
        <div className="p-4 bg-card rounded-xl border border-card-border text-xs text-muted leading-relaxed">
          <strong>Nota de Conformidade DIREF:</strong> Conforme regulamentação do Sistema de Registro Eletrônico de Ponto, as inconsistências não tratadas até o quinto dia útil do mês subsequente acarretarão em lançamento de falta ou perda de banco de horas correspondente ao período incompleto. Certifique-se de anexar os atestados/justificativas diretamente no módulo de requerimentos.
        </div>

      </div>
    </main>
  );
}