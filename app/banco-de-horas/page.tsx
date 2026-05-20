'use client';

import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import { ArrowUpRight, ArrowDownLeft, Scale, Calendar, HelpCircle } from 'lucide-react';

// 1. Interface de lançamentos conforme auditoria do ponto eletrônico
interface LancamentoBanco {
  id: string;
  data: string;
  descricao: string;
  tipo: 'Crédito' | 'Débito';
  quantidade: string; // Formato HH:MM
  saldoParcial: string;
}

export default function ExtratoBancoHorasPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // 2. Histórico de lançamentos (simulando extrato mensal do servidor)
  const historicoLancamentos: LancamentoBanco[] = [
    { id: '1', data: '18/05/2026', descricao: 'Horas excedentes em regime de sobrejornada', tipo: 'Crédito', quantidade: '01:15', saldoParcial: '+04:25' },
    { id: '2', data: '15/05/2026', descricao: 'Saída antecipada homologada por chefia', tipo: 'Débito', quantidade: '00:30', saldoParcial: '+03:10' },
    { id: '3', data: '13/05/2026', descricao: 'Horas excedentes em regime de sobrejornada', tipo: 'Crédito', quantidade: '00:45', saldoParcial: '+03:40' },
    { id: '4', data: '08/05/2026', descricao: 'Compensação de horas (Folga total deferida)', tipo: 'Débito', quantidade: '08:00', saldoParcial: '+02:55' },
    { id: '5', data: '05/05/2026', descricao: 'Saldo transportado do período anterior', tipo: 'Crédito', quantidade: '10:55', saldoParcial: '+10:55' },
  ];

  // 3. Lógica matemática de fatiamento para a nossa Paginação Semântica
  const totalItems = historicoLancamentos.length;
  const indexInicial = (currentPage - 1) * itemsPerPage;
  const itensPaginados = historicoLancamentos.slice(indexInicial, indexInicial + itemsPerPage);

  const handleItemsPerPageChange = (novosItensPorPagina: number) => {
    setItemsPerPage(novosItensPorPagina);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 antialiased transition-colors duration-300">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" /> Extrato do Banco de Horas
            </h2>
            <p className="text-sm text-muted">Demonstrativo de créditos, compensações e saldo acumulado de acordo com a portaria DIREF.</p>
          </div>
          <div className="text-xs font-medium text-muted bg-card border border-card-border px-3 py-1.5 rounded-lg shadow-sm">
            Ciclo de Compensação: <span className="text-foreground font-semibold">Semestral</span>
          </div>
        </div>

        {/* Painel de Resumo / Cards do Banco */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card Saldo Atual */}
          <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Saldo Atual Acumulado</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-black text-emerald-500 dark:text-emerald-400">+04:25</h3>
              <span className="text-xs text-muted font-medium">horas</span>
            </div>
            <p className="text-[11px] text-muted mt-2">Prazo limite de gozo: <span className="font-medium text-foreground">31/12/2026</span></p>
          </div>

          {/* Card Total Créditos */}
          <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Total Creditado (Mês)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold text-foreground">+12:00</h3>
              <span className="text-xs text-muted">horas</span>
            </div>
            <p className="text-[11px] text-emerald-500 flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3 w-3" /> Adicionais de sobrejornada homologados
            </p>
          </div>

          {/* Card Total Débitos */}
          <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Total Compensado (Mês)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold text-foreground">-08:30</h3>
              <span className="text-xs text-muted">horas</span>
            </div>
            <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-2">
              <ArrowDownLeft className="h-3 w-3" /> Abatimentos de saídas e folgas regulamentares
            </p>
          </div>

        </div>

        {/* Tabela de Extrato Detalhado */}
        <div className="bg-card rounded-xl border border-card-border shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-4 border-b border-card-border bg-background/40 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Extrato de Lançamentos</h3>
            <span className="text-xs text-muted flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Atualizado em tempo real
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-background/40 text-xs font-semibold uppercase tracking-wider text-muted border-b border-card-border">
                <tr>
                  <th className="py-3 px-4">Data Fato</th>
                  <th className="py-3 px-4">Descrição do Lançamento</th>
                  <th className="py-3 px-4 text-center">Operação</th>
                  <th className="py-3 px-4 text-center">Quantidade</th>
                  <th className="py-3 px-4 text-right">Saldo Parcial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-foreground/90">
                {itensPaginados.map((item) => {
                  const isCredito = item.tipo === 'Crédito';
                  return (
                    <tr key={item.id} className="hover:bg-background/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-foreground">{item.data}</td>
                      <td className="py-3.5 px-4 text-muted text-xs sm:text-sm">{item.descricao}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          isCredito 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-rose-500/10 text-rose-600'
                        }`}>
                          {isCredito ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                          {item.tipo}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-center font-mono text-xs font-bold ${isCredito ? 'text-green-600' : 'text-rose-600'}`}>
                        {isCredito ? `+${item.quantidade}` : `-${item.quantidade}`}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-foreground">
                        {item.saldoParcial}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Instanciando o Componente de Paginação Semântica */}
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[5, 10, 20]}
          />
        </div>

        {/* Alerta de Regra de Negócio (DIREF) */}
        <div className="flex gap-2.5 p-4 bg-card rounded-xl border border-card-border text-xs text-muted leading-relaxed">
          <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground block mb-0.5">Regra de Caducidade do Saldo:</span>
            Conforme normativas de gerenciamento de banco de horas da DIREF, os créditos acumulados possuem validade máxima vinculada ao fechamento do ano civil corrente. Horas não compensadas por interesse da administração deverão ser objeto de repactuação específica junto à Diretoria de Gestão de Pessoas.
          </div>
        </div>

      </div>
    </main>
  );
}