'use client';

import { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiFileText, 
  FiPlusCircle,
  FiEye
} from 'react-icons/fi';
import Link from 'next/link';

// Importações dos Componentes Universais do Ecossistema JFAM
import Pagination from '@/app/components/pagination'; 
import PDFExportButton from '@/app/components/pdf-export-button';

interface OcorrenciaPonto {
  id: string;
  dataOcorrencia: string;
  tipo: 'TRABALHO_EXTERNO' | 'VIAGEM_SERVICO' | 'ATESTADO_MEDICO' | 'TRE_CONVOCACAO' | 'FALHA_BIOMETRIA';
  descricao: string;
  processoSei: string | null;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO_DESCONTO';
  observacoesChefia: string | null;
  dataAnalise: string | null;
}

export default function ListaOcorrenciasServidorPage() {
  // --- MOCK: Histórico de Ocorrências e Defesas do Servidor (Prisma: OcorrenciaPonto) ---
  const [ocorrenciasMock] = useState<OcorrenciaPonto[]>([
    { id: 'oc-101', dataOcorrencia: '18/05/2026', tipo: 'FALHA_BIOMETRIA', descricao: 'Equipamento da entrada principal não registrou a digital. Solicito inserção do horário das 08:02.', processoSei: null, status: 'PENDENTE', observacoesChefia: null, dataAnalise: null },
    { id: 'oc-099', dataOcorrencia: '12/05/2026', tipo: 'TRABALHO_EXTERNO', descricao: 'Cumprimento de atividade externa de inspeção administrativa autorizada pela portaria local.', processoSei: '0002698-92.2022.4.01.8002', status: 'APROVADO', observacoesChefia: 'Homologado. Horas validadas para cômputo.', dataAnalise: '14/05/2026' },
    { id: 'oc-095', dataOcorrencia: '07/05/2026', tipo: 'ATESTADO_MEDICO', descricao: 'Afastamento por motivo de saúde. Atestado médico de 1 dia anexado.', processoSei: '0003150-40.2026.4.01.8002', status: 'APROVADO', observacoesChefia: 'Abonado conforme normativo de saúde.', dataAnalise: '08/05/2026' },
    { id: 'oc-088', dataOcorrencia: '22/04/2026', tipo: 'VIAGEM_SERVICO', descricao: 'Convocação para apoio correicional na Subseção Judiciária de Tabatinga.', processoSei: '0001422-54.2026.4.01.8002', status: 'APROVADO', observacoesChefia: 'Deslocamento institucional validado.', dataAnalise: '25/04/2026' },
    { id: 'oc-082', dataOcorrencia: '14/04/2026', tipo: 'TRABALHO_EXTERNO', descricao: 'Atividade de rua sem prévio rastro documental.', processoSei: null, status: 'REJEITADO_DESCONTO', observacoesChefia: 'Indeferido. Ausência de autorização prévia da chefia imediata para o serviço externo.', dataAnalise: '16/04/2026' },
  ]);

  // Estados de Busca, Filtragem e Paginação Reativa
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mapeamento semântico amigável dos Enums da Portaria 135/2025
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'TRABALHO_EXTERNO': return 'Trabalho Externo (Art. 8º, §4º)';
      case 'VIAGEM_SERVICO': return 'Viagem a Serviço (Art. 8º, §5º)';
      case 'ATESTADO_MEDICO': return 'Capacitação/Saúde (Art. 7º)';
      case 'TRE_CONVOCACAO': return 'Convocação TRE';
      case 'FALHA_BIOMETRIA': return 'Falha de Marcação (Art. 18, IV)';
      default: return tipo;
    }
  };

  // Manipuladores reativos com reset automático de página para segurança do grid
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Filtragem Cruzada via useMemo (Flicker-Free)
  const ocorrenciasFiltradas = useMemo(() => {
    return ocorrenciasMock.filter((item) => {
      const matchSearch = 
        item.descricao.toLowerCase().includes(search.toLowerCase()) ||
        getTipoLabel(item.tipo).toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === 'TODOS' || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, ocorrenciasMock]);

  // Quantificadores analíticos para o painel de cards superior
  const metricas = useMemo(() => {
    return {
      total: ocorrenciasFiltradas.length,
      pendentes: ocorrenciasFiltradas.filter(o => o.status === 'PENDENTE').length,
      rejeitadas: ocorrenciasFiltradas.filter(o => o.status === 'REJEITADO_DESCONTO').length,
    };
  }, [ocorrenciasFiltradas]);

  // CORREÇÃO: Declaração unificada e explícita avaliada de forma estável no useMemo
  const ocorrenciasPaginados = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return ocorrenciasFiltradas.slice(start, start + itemsPerPage);
  }, [ocorrenciasFiltradas, currentPage, itemsPerPage]);

  // Mapeamento forte de colunas para o gerador do PDF (A4 Paisagem)
  const colunasPdf = useMemo(() => [
    { header: 'Data Ocorrência', accessor: (o: OcorrenciaPonto) => o.dataOcorrencia },
    { header: 'Enquadramento Regulamentar', accessor: (o: OcorrenciaPonto) => getTipoLabel(o.tipo) },
    { header: 'Justificativa do Servidor', accessor: (o: OcorrenciaPonto) => o.descricao },
    { header: 'Processo SEI', accessor: (o: OcorrenciaPonto) => o.processoSei || 'Não Informado' },
    { header: 'Status Homologação', accessor: (o: OcorrenciaPonto) => o.status.replace('_', ' ') },
    { header: 'Despacho Chefia', accessor: (o: OcorrenciaPonto) => o.observacoesChefia || 'Sem observações' },
  ], []);

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* CABEÇALHO DO MÓDULO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Minhas Justificativas e Ocorrências
          </h1>
          <p className="text-sm text-muted">
            Acompanhamento do direito ao contraditório, falhas biométricas e afastamentos homologados (Art. 16, §4º) .
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/ocorrencias/novo"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <FiPlusCircle className="w-4 h-4" />
            Nova Justificativa
          </Link>

          <PDFExportButton
           filename='Ocorrências'
            data={ocorrenciasFiltradas}
            columns={colunasPdf}
            title="Extrato de Ocorrências e Justificativas de Ponto - JFAM"
            orientation="landscape"
          />
        </div>
      </div>

      {/* PAINEL INFORMATIVO (STAT CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiFileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Total Protocolado</p>
            <h3 className="text-xl font-bold text-foreground">{metricas.total} Ocorrências</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Aguardando Chefia (Art. 16) </p>
            <h3 className="text-xl font-bold text-amber-600">{metricas.pendentes} Pendentes</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <FiAlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Corte em Folha Emitido (Art. 16, §5º) </p>
            <h3 className="text-xl font-bold text-rose-600">{metricas.rejeitadas} Indeferidas</h3>
          </div>
        </div>
      </div>

      {/* BARRA DE FERRAMENTAS */}
      <div className="p-4 bg-card border border-card-border rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por termo ou enquadramento..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="TODOS">Todos os Status</option>
          <option value="PENDENTE">Pendente de Avaliação</option>
          <option value="APROVADO">Deferida / Homologada</option>
          <option value="REJEITADO_DESCONTO">Indeferida / Envio SECAP </option>
        </select>
      </div>

      {/* ÁREA DA TABELA DE OCORRÊNCIAS */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/60 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="p-4 w-32">Data Alvo</th>
                <th className="p-4 w-52">Enquadramento</th>
                <th className="p-4">Motivação / Descrição (Art. 2º, X) </th>
                <th className="p-4 w-44">Processo SEI </th>
                <th className="p-4 text-center w-44">Situação Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm text-foreground">
              {ocorrenciasPaginados.length > 0 ? (
                ocorrenciasPaginados.map((item) => (
                  <tr key={item.id} className="hover:bg-background/20 transition-colors group align-top">
                    
                    <td className="p-4 font-mono text-xs text-muted font-bold pt-5">
                      {item.dataOcorrencia}
                    </td>
                    
                    <td className="p-4 pt-5">
                      <span className="text-xs font-bold text-primary tracking-tight">
                        {getTipoLabel(item.tipo)}
                      </span>
                    </td>
                    
                    <td className="p-4 max-w-md">
                      <div className="space-y-1.5 py-1">
                        {/* CORREÇÃO: Removido marcador polluído para renderizar puramente a descrição */}
                        <p className="font-medium text-foreground tracking-tight leading-relaxed">
                          {item.descricao}
                        </p>
                        {item.observacoesChefia && (
                          <div className="p-2.5 bg-background border border-card-border rounded-lg text-xs leading-relaxed text-muted mt-2">
                            <span className="font-bold text-foreground block mb-0.5">Despacho da Chefia Imediata ({item.dataAnalise}) :</span>
                            "{item.observacoesChefia}"
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4 font-mono text-xs text-muted pt-5">
                      {item.processoSei ? (
                        <span className="underline decoration-card-border hover:text-primary transition-colors cursor-pointer">
                          {item.processoSei}
                        </span>
                      ) : (
                        <span className="italic opacity-60">Sem processo</span>
                      )}
                    </td>
                    
                    <td className="p-4 text-center pt-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold shadow-2xs ${
                        item.status === 'APROVADO' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        item.status === 'REJEITADO_DESCONTO' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {item.status === 'APROVADO' && <FiCheckCircle className="w-3.5 h-3.5" />}
                        {item.status === 'REJEITADO_DESCONTO' && <FiXCircle className="w-3.5 h-3.5" />}
                        {item.status === 'PENDENTE' && <FiClock className="w-3.5 h-3.5" />}
                        
                        {item.status === 'APROVADO' ? 'Homologada' :
                         item.status === 'REJEITADO_DESCONTO' ? 'Corte em Folha' : 'Em Análise'}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-muted">
                    Nenhuma justificativa ou ocorrência localizada para os filtros vigentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          totalItems={ocorrenciasFiltradas.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

      </div>
    </div>
  );
}