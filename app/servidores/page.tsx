'use client';

import { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiShield, 
  FiUsers, 
  FiBriefcase, 
  FiEye,
  FiEdit,
  FiClock // Importação do ícone de tempo para o ajuste manual
} from 'react-icons/fi';
import Link from 'next/link';

// Importações dos Componentes Universais do Ecossistema JFAM
import PdfExportButton from '../components/pdf-export-button';
import Pagination from '../components/pagination';

interface Servidor {
  matricula: string;
  nome: string;
  email: string;
  lotacao: string;
  unidade: string;
  regime: 'Presencial' | 'Teletrabalho' | 'Oficial de Justiça';
  perfis: ('SERVIDOR' | 'CHEFIA_IMEDIATA' | 'DIRETOR_SECRETARIA' | 'ADMINISTRADOR_SECAP' | 'DIRETOR_DO_FORO' | 'NUTEC_ADMIN')[];
}

export default function ListaServidoresPage() {
  // Mock consolidado de servidores da JFAM
  const servidoresMock: Servidor[] = [
    { matricula: 'AM1024', nome: 'Dr. Érico Rodrigo Freitas Pinheiro', email: 'erico.pinheiro@trf1.jus.br', lotacao: 'Diretoria do Foro (DIREF)', unidade: 'SEDE_MANAUS', regime: 'Presencial', perfis: ['SERVIDOR', 'DIRETOR_DO_FORO'] },
    { matricula: 'AM5432', nome: 'Mariana Costa Ferreira', email: 'mariana.ferreira@trf1.jus.br', lotacao: 'Secretaria da 1ª Vara', unidade: 'SEDE_MANAUS', regime: 'Teletrabalho', perfis: ['SERVIDOR', 'CHEFIA_IMEDIATA', 'DIRETOR_SECRETARIA'] },
    { matricula: 'AM9876', nome: 'Carlos Augusto Amazonas', email: 'carlos.amazonas@trf1.jus.br', lotacao: 'Subseção Judiciária de Tabatinga', unidade: 'SUBSECAO_TABATINGA', regime: 'Presencial', perfis: ['SERVIDOR'] },
    { matricula: 'AM2241', nome: 'Raimundo Nonato Silva', email: 'raimundo.silva@trf1.jus.br', lotacao: 'Central de Mandados', unidade: 'SEDE_MANAUS', regime: 'Oficial de Justiça', perfis: ['SERVIDOR'] },
    { matricula: 'AM3312', nome: 'Ana Beatriz Souza', email: 'ana.souza@trf1.jus.br', lotacao: 'Núcleo de Gestão de Pessoas (NUCGP)', unidade: 'SEDE_MANAUS', regime: 'Presencial', perfis: ['SERVIDOR', 'ADMINISTRADOR_SECAP'] },
    { matricula: 'AM4155', nome: 'João Paulo Mendes', email: 'joao.mendes@trf1.jus.br', lotacao: 'Unidade Avançada de Tefé', unidade: 'UAA_TEFE', regime: 'Presencial', perfis: ['SERVIDOR'] },
    { matricula: 'AM7721', nome: 'Patricia Lins Alencar', email: 'patricia.alencar@trf1.jus.br', lotacao: 'Secretaria da 2ª Vara', unidade: 'SEDE_MANAUS', regime: 'Teletrabalho', perfis: ['SERVIDOR', 'CHEFIA_IMEDIATA'] },
    { matricula: 'AM8843', nome: 'Lucas de Oliveira Ramos', email: 'lucas.ramos@trf1.jus.br', lotacao: 'Central de Mandados', unidade: 'SUBSECAO_TABATINGA', regime: 'Oficial de Justiça', perfis: ['SERVIDOR'] },
    { matricula: 'AM1122', nome: 'Fernanda Rocha Lima', email: 'fernanda.lima@trf1.jus.br', lotacao: 'Secretaria Administrativa (SECAD)', unidade: 'SEDE_MANAUS', regime: 'Presencial', perfis: ['SERVIDOR'] },
    { matricula: 'AM3344', nome: 'Ricardo Alves Pereira', email: 'ricardo.pereira@trf1.jus.br', lotacao: 'Núcleo de Tecnologia (NUTEC)', unidade: 'SEDE_MANAUS', regime: 'Teletrabalho', perfis: ['SERVIDOR', 'NUTEC_ADMIN'] },
    { matricula: 'AM5566', nome: 'Camila Borges Reis', email: 'camila.reis@trf1.jus.br', text: 'Secretaria da 3ª Vara', lotacao: 'Secretaria da 3ª Vara', unidade: 'SEDE_MANAUS', regime: 'Presencial', perfis: ['SERVIDOR'] },
    { matricula: 'AM7788', nome: 'Roberto Dias Fonseca', email: 'roberto.fonseca@trf1.jus.br', lotacao: 'Central de Mandados', unidade: 'UAA_TEFE', regime: 'Oficial de Justiça', perfis: ['SERVIDOR'] }
  ];

  // Estados de Filtros e Busca Reativa
  const [search, setSearch] = useState('');
  const [lotacaoFilter, setLotacaoFilter] = useState('TODAS');
  const [regimeFilter, setRegimeFilter] = useState('TODOS');
  
  // Controle de Estado da Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Manipuladores de Filtros Cruzados com reset de página
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleLotacaoChange = (value: string) => {
    setLotacaoFilter(value);
    setCurrentPage(1);
  };

  const handleRegimeChange = (value: string) => {
    setRegimeFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Processamento Memoizado de Filtros (Flicker-Free) 
  const servidoresFiltrados = useMemo(() => {
    return servidoresMock.filter((servidor) => {
      const matchSearch = 
        servidor.nome.toLowerCase().includes(search.toLowerCase()) ||
        servidor.matricula.toLowerCase().includes(search.toLowerCase());
      
      const matchLotacao = lotacaoFilter === 'TODAS' || servidor.unidade === lotacaoFilter;
      const matchRegime = regimeFilter === 'TODOS' || servidor.regime === regimeFilter;

      return matchSearch && matchLotacao && matchRegime;
    });
  }, [search, lotacaoFilter, regimeFilter]);

  // Colunas do PDF Unificado fortemente tipadas no TypeScript 
  const colunasPdf = useMemo(() => [
    { header: 'Matrícula', accessor: (srv: Servidor) => srv.matricula },
    { header: 'Nome Completo', accessor: (srv: Servidor) => srv.nome },
    { header: 'Lotação / Setor', accessor: (srv: Servidor) => srv.lotacao },
    { header: 'Regime', accessor: (srv: Servidor) => srv.regime },
    { 
      header: 'Perfis Ativos', 
      accessor: (srv: Servidor) => srv.perfis.map(p => p.replace('_', ' ')).join(', ') 
    },
  ], []);

  // Somas de apoio para os painéis superiores
  const metricas = useMemo(() => {
    return {
      total: servidoresFiltrados.length,
      teletrabalho: servidoresFiltrados.filter(s => s.regime === 'Teletrabalho').length,
      oficiais: servidoresFiltrados.filter(s => s.regime === 'Oficial de Justiça').length
    };
  }, [servidoresFiltrados]);

  // Fatiamento Dinâmico por Escopo de Página Ativa 
  const servidoresPaginados = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return servidoresFiltrados.slice(start, start + itemsPerPage);
  }, [servidoresFiltrados, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* CABEÇALHO DO MÓDULO COM GRUPO DE AÇÕES COMPONENTIZADO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Servidores Ativos
          </h1>
          <p className="text-sm text-muted">
            Gestão cadastral, regimes especiais e consulta ao espelho de ponto eletrônico da JFAM.
          </p>
        </div>
        
        {/* AJUSTE: Agrupamento flexível contendo o link de Ajuste Manual e o Exportador de PDF */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/banco-horas/lancar-manual"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-card border border-card-border text-foreground text-sm font-semibold rounded-lg hover:bg-background transition-all shadow-2xs cursor-pointer hover:border-primary/40"
          >
            <FiClock className="w-4 h-4 text-primary" />
            Ajuste Manual (NUCGP) 
          </Link>

          <PdfExportButton
            data={servidoresFiltrados}
            columns={colunasPdf}
            title="Relatório Geral de Servidores Ativos - JFAM"
            orientation="landscape"
          />
        </div>
      </div>

      {/* CARD DE INFORMAÇÕES SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Listados / Filtrados</p>
            <h3 className="text-xl font-bold text-foreground">{metricas.total} Servidores</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiBriefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Em Teletrabalho (Art. 6º, §6º) </p>
            <h3 className="text-xl font-bold text-foreground">{metricas.teletrabalho} Ativos</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Oficiais (Dispensa Biométrica) </p>
            <h3 className="text-xl font-bold text-foreground">{metricas.oficiais} Oficiais</h3>
          </div>
        </div>
      </div>

      {/* BARRA DE FERRAMENTAS: FILTROS E BUSCA */}
      <div className="p-4 bg-card border border-card-border rounded-xl shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Pesquisar por nome ou matrícula..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiFilter className="text-muted w-4 h-4 hidden sm:block" />
            <select
              value={lotacaoFilter}
              onChange={(e) => handleLotacaoChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="TODAS">Todas as Unidades</option>
              <option value="SEDE_MANAUS">Sede Manaus</option>
              <option value="SUBSECAO_TABATINGA">Subseção Tabatinga</option>
              <option value="UAA_TEFE">UAA Tefé</option>
            </select>
          </div>

          <select
            value={regimeFilter}
            onChange={(e) => handleRegimeChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="TODOS">Todos os Regimes</option>
            <option value="Presencial">Presencial</option>
            <option value="Teletrabalho">Teletrabalho</option>
            <option value="Oficial de Justiça">Oficial de Justiça</option>
          </select>
        </div>
      </div>

      {/* CORPO DA TABELA */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/60 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="p-4 w-28">Matrícula</th>
                <th className="p-4">Servidor / Lotação</th>
                <th className="p-4 w-40">Regime Pactuado</th>
                <th className="p-4 text-center w-56">Perfis Corporativos</th>
                <th className="p-4 text-right w-44">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm text-foreground">
              {servidoresPaginados.length > 0 ? (
                servidoresPaginados.map((srv) => (
                  <tr key={srv.matricula} className="hover:bg-background/30 transition-colors group">
                    <td className="p-4 font-mono text-xs text-muted font-semibold">
                      {srv.matricula}
                    </td>
                    <td className="p-4">
                      <p className="font-bold tracking-tight text-foreground">{srv.nome}</p>
                      <p className="text-xs text-muted mt-0.5">{srv.lotacao}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        srv.regime === 'Teletrabalho' ? 'bg-indigo-500/10 text-primary' :
                        srv.regime === 'Oficial de Justiça' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {srv.regime}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center max-w-xs mx-auto">
                        {srv.perfis.map((perf) => (
                          <span 
                            key={perf} 
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-background border border-card-border text-foreground rounded shadow-2xs"
                          >
                            <FiShield className="w-2.5 h-2.5 text-primary" />
                            {perf.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href="/ponto"
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold text-foreground bg-background border border-card-border rounded-lg hover:bg-card-border/40 transition-colors shadow-2xs"
                        >
                          <FiEye className="w-3.5 h-3.5 text-muted" />
                          Ponto
                        </Link>
                        
                        <Link 
                          href={`/servidores/${srv.matricula}/editar`}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-primary rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-muted">
                    Nenhum servidor JFAM localizado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COMPONENTE DE PAGINAÇÃO HOMOLOGADO */}
        <Pagination
          totalItems={servidoresFiltrados.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

      </div>
    </div>
  );
}