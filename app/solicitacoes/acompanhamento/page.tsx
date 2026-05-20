'use client';

import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import { ClipboardList, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';

// 1. Interface alinhada com as regras de negócio da portaria DIREF
interface SolicitacaoAjuste {
  id: string;
  protocolo: string;
  dataSolicitacao: string;
  dataOcorrencia: string;
  tipoAjuste: string;
  horarioSugerido: string;
  status: 'Deferido' | 'Indeferido' | 'Em Análise';
  despachoChefia?: string;
}

export default function AcompanhamentoSolicitacoesPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // 2. Histórico fictício de requerimentos criados pelo servidor
  const chamadosCadastrados: SolicitacaoAjuste[] = [
    {
      id: '1',
      protocolo: '#AJU-845210',
      dataSolicitacao: '19/05/2026',
      dataOcorrencia: '14/05/2026',
      tipoAjuste: 'Início de Jornada',
      horarioSugerido: '08:00',
      status: 'Em Análise'
    },
    {
      id: '2',
      protocolo: '#AJU-319402',
      dataSolicitacao: '12/05/2026',
      dataOcorrencia: '10/05/2026',
      tipoAjuste: 'Fim de Jornada',
      horarioSugerido: '17:00',
      status: 'Deferido',
      despachoChefia: 'Homologado conforme folha de espelho de ponto manual anexa.'
    },
    {
      id: '3',
      protocolo: '#AJU-105493',
      dataSolicitacao: '05/05/2026',
      dataOcorrencia: '30/04/2026',
      tipoAjuste: 'Saída Intervalo',
      horarioSugerido: '12:00',
      status: 'Indeferido',
      despachoChefia: 'Incompatível com o registro de catraca física do bloco administrativo.'
    }
  ];

  // 3. Matemática de fatiamento para o componente de Paginação
  const totalItems = chamadosCadastrados.length;
  const indexInicial = (currentPage - 1) * itemsPerPage;
  const itensPaginados = chamadosCadastrados.slice(indexInicial, indexInicial + itemsPerPage);

  const handleItemsPerPageChange = (novosItensPorPagina: number) => {
    setItemsPerPage(novosItensPorPagina);
    setCurrentPage(1);
  };

  // Helper para renderizar os ícones e cores semânticas de status baseados no tema
  const renderStatusBadge = (status: SolicitacaoAjuste['status']) => {
    const styles = {
      'Deferido': 'bg-green-500/10 text-green-600 border-green-500/20',
      'Indeferido': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      'Em Análise': 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    };

    const icons = {
      'Deferido': <CheckCircle2 className="h-3.5 w-3.5" />,
      'Indeferido': <XCircle className="h-3.5 w-3.5" />,
      'Em Análise': <Clock className="h-3.5 w-3.5" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 antialiased transition-colors duration-300">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Topo / Cabeçalho da Tela */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" /> Meus Requerimentos de Ponto
            </h2>
            <p className="text-sm text-muted">Acompanhe a análise, pareceres e o histórico de homologações da chefia imediata.</p>
          </div>
        </div>

        {/* Tabela de Histórico de Ajustes */}
        <div className="bg-card rounded-xl border border-card-border shadow-sm overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-background/40 text-xs font-semibold uppercase tracking-wider text-muted border-b border-card-border">
                <tr>
                  <th className="py-3 px-4">Protocolo</th>
                  <th className="py-3 px-3">Data Pedido</th>
                  <th className="py-3 px-3">Data Ocorrência</th>
                  <th className="py-3 px-3">Tipo de Ajuste</th>
                  <th className="py-3 px-3 text-center">Horário Real</th>
                  <th className="py-3 px-3">Situação</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-foreground/90">
                {itensPaginados.map((item) => (
                  <tr key={item.id} className="hover:bg-background/40 transition-colors group">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-foreground">
                      {item.protocolo}
                    </td>
                    <td className="py-3.5 px-3 text-muted">{item.dataSolicitacao}</td>
                    <td className="py-3.5 px-3 font-medium">{item.dataOcorrencia}</td>
                    <td className="py-3.5 px-3 text-muted">{item.tipoAjuste}</td>
                    <td className="py-3.5 px-3 text-center font-mono text-xs">{item.horarioSugerido}h</td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1 items-start">
                        {renderStatusBadge(item.status)}
                        {item.despachoChefia && (
                          <span className="text-[11px] text-muted max-w-xs truncate italic" title={item.despachoChefia}>
                            &quot;{item.despachoChefia}&quot;
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Detalhes do protocolo ${item.protocolo}:\n\nJustificativa: Parecer em análise de fluxo sistêmico.`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-card-border rounded-lg bg-card hover:bg-background text-foreground transition-all cursor-pointer"
                        title="Visualizar Requerimento Completo"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted" /> Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
                {chamadosCadastrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-sm text-muted">
                      Nenhum chamado de ajuste de ponto localizado para o seu usuário.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Instanciando a Paginação Semântica integrada */}
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 25, 50]}
          />
        </div>

      </div>
    </main>
  );
}