'use client';

import { useState, useMemo } from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiClock, 
  FiAlertTriangle, 
  FiCalendar, 
  FiSearch,
  FiFileText
} from 'react-icons/fi';

// Importações dos Componentes Universais do Ecossistema JFAM
import PdfExportButton from '../components/pdf-export-button';
import PDFExportButton from '../components/pdf-export-button';
import Pagination from '../components/pagination';
// import Pagination from '../components/pagination';


// Interfaces baseadas no modelo BancoHorasMensal e RegistroPonto do Prisma
interface ExtratoMensal {
  mesAno: string;
  saldoAnteriorMinutos: number;
  creditosMinutos: number; // Limitado a 960 min (16h) corporativas
  debitosMinutos: number;
  compensadasMinutos: number;
  saldoFinalMinutos: number;
  limiteExcedidoMinutos: number; // Art. 14: Horas acima do limite perdidas
  prazoLimiteCompensacao: string; // Janela de 3 meses
  status: 'REGULAR' | 'ATENCAO_CADUCIDADE' | 'DEBITO_FOLHA';
}

interface DetalheDiario {
  data: string;
  tipoDia: 'Útil' | 'Sábado' | 'Domingo' | 'Feriado' | 'Ponto Facultativo';
  minutosTrabalhados: number;
  creditoDia: number;
  debitoDia: number;
  fatorAplicado: 'Nominal' | '+50%' | 'Em Dobro (100%)';
}

export default function BancoHorasServidorPage() {
  // --- MOCK 1: Consolidação Mensal Histórica (Prisma: BancoHorasMensal) ---
  const historicoMensalMock: ExtratoMensal[] = [
    { mesAno: 'Maio / 2026', saldoAnteriorMinutos: 480, creditosMinutos: 300, debitosMinutos: 0, compensadasMinutos: 60, saldoFinalMinutos: 720, limiteExcedidoMinutos: 0, prazoLimiteCompensacao: '01/08/2026', status: 'REGULAR' },
    { mesAno: 'Abril / 2026', saldoAnteriorMinutos: 220, creditosMinutos: 960, debitosMinutos: 40, compensadasMinutos: 100, saldoFinalMinutos: 480, limiteExcedidoMinutos: 120, prazoLimiteCompensacao: '01/07/2026', status: 'ATENCAO_CADUCIDADE' }, // Estourou as 16h mensais (960 min)
    { mesAno: 'Março / 2026', saldoAnteriorMinutos: -180, creditosMinutos: 400, debitosMinutos: 0, compensadasMinutos: 0, saldoFinalMinutos: 220, limiteExcedidoMinutos: 0, prazoLimiteCompensacao: '01/06/2026', status: 'REGULAR' },
    { mesAno: 'Fevereiro / 2026', saldoAnteriorMinutos: 0, creditosMinutos: 120, debitosMinutos: 300, compensadasMinutos: 0, saldoFinalMinutos: -180, limiteExcedidoMinutos: 0, prazoLimiteCompensacao: '01/05/2026', status: 'DEBITO_FOLHA' },
  ];

  // --- MOCK 2: Detalhamento Diário do Mês Corrente (Prisma: RegistroPonto) ---
  const detalheDiarioMock: DetalheDiario[] = [
    { data: '15/05/2026', tipoDia: 'Útil', minutosTrabalhados: 450, creditoDia: 30, debitoDia: 0, fatorAplicado: 'Nominal' },
    { data: '14/05/2026', tipoDia: 'Útil', minutosTrabalhados: 420, creditoDia: 0, debitoDia: 0, fatorAplicado: 'Nominal' },
    { data: '13/05/2026', tipoDia: 'Útil', minutosTrabalhados: 390, creditoDia: 0, debitoDia: 30, fatorAplicado: 'Nominal' },
    { data: '10/05/2026', tipoDia: 'Domingo', minutosTrabalhados: 240, creditoDia: 480, debitoDia: 0, fatorAplicado: 'Em Dobro (100%)' }, // Trabalho em plantão/domingo dobra o crédito
    { data: '09/05/2026', tipoDia: 'Sábado', minutosTrabalhados: 180, creditoDia: 270, debitoDia: 0, fatorAplicado: '+50%' }, // Sábado ganha +50%
    { data: '08/05/2026', tipoDia: 'Útil', minutosTrabalhados: 420, creditoDia: 0, debitoDia: 0, fatorAplicado: 'Nominal' },
    { data: '07/05/2026', tipoDia: 'Útil', minutosTrabalhados: 480, creditoDia: 60, debitoDia: 0, fatorAplicado: 'Nominal' },
    { data: '06/05/2026', tipoDia: 'Útil', minutosTrabalhados: 420, creditoDia: 0, debitoDia: 0, fatorAplicado: 'Nominal' },
    { data: '05/05/2026', tipoDia: 'Feriado', minutosTrabalhados: 120, creditoDia: 240, debitoDia: 0, fatorAplicado: 'Em Dobro (100%)' },
    { data: '04/05/2026', tipoDia: 'Útil', minutosTrabalhados: 360, creditoDia: 0, debitoDia: 60, fatorAplicado: 'Nominal' },
  ];

  // Estados de paginação e filtragem reativa
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [tipoDiaFilter, setTipoDiaFilter] = useState('TODOS');

  // Função Auxiliar de UX: Converte minutos inteiros do banco para formato HH:MM (com sinal)
  const formatarMinutosSinal = (minutos: number) => {
    const absoluto = Math.abs(minutos);
    const h = Math.floor(absoluto / 60);
    const m = absoluto % 60;
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    return `${minutos < 0 ? '-' : ''}${hStr}:${mStr}`;
  };

  // Filtragem dos registros diários
  const dadosDiariosFiltrados = useMemo(() => {
    return detalheDiarioMock.filter(item => {
      return tipoDiaFilter === 'TODOS' || item.tipoDia === tipoDiaFilter;
    });
  }, [tipoDiaFilter]);

  // Fatiamento da paginação reativa
  const dadosDiariosPaginados = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return dadosDiariosFiltrados.slice(start, start + itemsPerPage);
  }, [dadosDiariosFiltrados, currentPage, itemsPerPage]);

  // Colunas fortemente tipadas para o Botão Unificado de PDF (A4 Paisagem)
  const colunasPdf = useMemo(() => [
    { header: 'Data', accessor: (d: DetalheDiario) => d.data },
    { header: 'Classificação do Dia', accessor: (d: DetalheDiario) => d.tipoDia },
    { header: 'Tempo Trabalhado', accessor: (d: DetalheDiario) => formatarMinutosSinal(d.minutosTrabalhados) },
    { header: 'Crédito Computado', accessor: (d: DetalheDiario) => formatarMinutosSinal(d.creditoDia) },
    { header: 'Débito Computado', accessor: (d: DetalheDiario) => formatarMinutosSinal(d.debitoDia) },
    { header: 'Regra de Fator', accessor: (d: DetalheDiario) => d.fatorAplicado },
  ], []);

  // Balanço total atual do servidor (Métricas consolidadas do topo)
  const saldoAtualMinutos = historicoMensalMock[0].saldoFinalMinutos;
  const horasAcumuladasMes = historicoMensalMock[0].creditosMinutos;

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* CABEÇALHO DO PAINEL */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Meu Banco de Horas</h1>
          <p className="text-sm text-muted">Consulta de saldos acumulados, prazos de compensação e fatores multiplicadores (Portaria 135/2025).</p>
        </div>
        
        <div className="w-full sm:w-auto">
          <PDFExportButton
            data={dadosDiariosFiltrados}
            columns={colunasPdf}
            title="Extrato Detalhado do Banco de Horas - JFAM"
            orientation="landscape"
          />
        </div>
      </div>

      {/* PAINEL DE METRICAS PRINCIPAIS - COMPLIANCE PORTARIA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CARD 1: SALDO LÍQUIDO ACUMULADO */}
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-xs flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            saldoAtualMinutos >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
          }`}>
            {saldoAtualMinutos >= 0 ? <FiTrendingUp className="w-5 h-5" /> : <FiTrendingDown className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Saldo Líquido Atual</p>
            <h3 className={`text-xl font-bold tracking-tight ${
              saldoAtualMinutos >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {formatarMinutosSinal(saldoAtualMinutos)} horas
            </h3>
          </div>
        </div>

        {/* CARD 2: LIMITE MENSAL ART. 14 */}
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiClock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Acúmulo no Mês (Teto 16h) </p>
              <span className="text-[10px] font-bold font-mono text-muted">{formatarMinutosSinal(horasAcumuladasMes)} / 16:00</span>
            </div>
            {/* Barra de Progresso do Teto Mensal */}
            <div className="w-full bg-background rounded-full h-2 mt-1.5 overflow-hidden border border-card-border/60">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min((horasAcumuladasMes / 960) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 3: ALERTAS DE CADUCIDADE / DEDUÇÃO */}
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Atenção à Caducidade </p>
            <h3 className="text-sm font-bold text-foreground mt-0.5">Saldo de Abril expira em 60 dias</h3>
          </div>
        </div>
      </div>

      {/* SEÇÃO DA GRADE HISTÓRICA MENSAL (CONSOLIDAÇÃO SECAP) */}
      <div className="bg-card border border-card-border rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-card-border bg-background/30 flex items-center gap-2">
          <FiCalendar className="text-primary w-4 h-4" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Histórico de Fechamento Mensal</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="p-4">Mês de Referência </th>
                <th className="p-4 text-center">Saldo Anterior</th>
                <th className="p-4 text-center">Créditos (+16h máx) </th>
                <th className="p-4 text-center">Débitos Registrados </th>
                <th className="p-4 text-center">Compensações </th>
                <th className="p-4 text-center">Saldo Final </th>
                <th className="p-4 text-center">Horas Excedidas Perdidas </th>
                <th className="p-4 text-right">Limite de Fruição </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-xs text-foreground font-medium">
              {historicoMensalMock.map((item) => (
                <tr key={item.mesAno} className="hover:bg-background/20 transition-colors">
                  <td className="p-4 font-bold tracking-tight">{item.mesAno}</td>
                  <td className="p-4 text-center font-mono text-muted">{formatarMinutosSinal(item.saldoAnteriorMinutos)}</td>
                  <td className="p-4 text-center font-mono text-emerald-600 dark:text-emerald-400">+{formatarMinutosSinal(item.creditosMinutos)}</td>
                  <td className="p-4 text-center font-mono text-rose-600 dark:text-rose-400">-{formatarMinutosSinal(item.debitosMinutos)}</td>
                  <td className="p-4 text-center font-mono text-primary">{formatarMinutosSinal(item.compensadasMinutos)}</td>
                  <td className={`p-4 text-center font-mono font-bold ${
                    item.saldoFinalMinutos >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>{formatarMinutosSinal(item.saldoFinalMinutos)}</td>
                  <td className="p-4 text-center font-mono text-rose-500/80">
                    {item.limiteExcedidoMinutos > 0 ? formatarMinutosSinal(item.limiteExcedidoMinutos) : '00:00'}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.status === 'DEBITO_FOLHA' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' :
                      item.status === 'ATENCAO_CADUCIDADE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
                      'bg-background border-card-border text-muted'
                    }`}>
                      {item.status === 'DEBITO_FOLHA' ? 'Descontado em Folha' : `Expira em ${item.prazoLimiteCompensacao}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEÇÃO DO EXTRATO DETALHADO DIÁRIO (MÊS CORRENTE) */}
      <div className="space-y-4">
        
        {/* BARRA DE FILTRAGEM DOS REGISTROS DIÁRIOS */}
        <div className="p-4 bg-card border border-card-border rounded-xl shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <FiSearch className="text-muted w-4 h-4" />
            <h3 className="text-sm font-bold text-foreground">Extrato Informativo Diário</h3>
          </div>
          
          <select
            value={tipoDiaFilter}
            onChange={(e) => { setTipoDiaFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto px-3 py-1.5 bg-background border border-card-border rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="TODOS">Todos os Dias</option>
            <option value="Útil">Dias Úteis</option>
            <option value="Sábado">Sábados (+50%) </option>
            <option value="Domingo">Domingos (100% em Dobro) </option>
            <option value="Feriado">Feriados (100% em Dobro) </option>
            <option value="Ponto Facultativo">Pontos Facultativos </option>
          </select>
        </div>

        {/* TABELA DE BATIDAS E CRÉDITOS DIÁRIOS */}
        <div className="bg-card border border-card-border rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="p-4 w-32">Data Batida</th>
                  <th className="p-4 w-40">Classificação</th>
                  <th className="p-4 text-center">Tempo Efetivo </th>
                  <th className="p-4 text-center">Crédito Gerado </th>
                  <th className="p-4 text-center">Débito Gerado </th>
                  <th className="p-4 text-right w-52">Fator de Cômputo </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-sm text-foreground">
                {dadosDiariosPaginados.length > 0 ? (
                  dadosDiariosPaginados.map((diario) => (
                    <tr key={diario.data} className="hover:bg-background/20 transition-colors">
                      <td className="p-4 font-mono text-xs font-bold text-muted">{diario.data}</td>
                      <td className="p-4 font-semibold text-xs">{diario.tipoDia}</td>
                      <td className="p-4 text-center font-mono text-xs font-medium">{formatarMinutosSinal(diario.minutosTrabalhados)}</td>
                      <td className="p-4 text-center font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {diario.creditoDia > 0 ? `+${formatarMinutosSinal(diario.creditoDia)}` : '00:00'}
                      </td>
                      <td className="p-4 text-center font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                        {diario.debitoDia > 0 ? `-${formatarMinutosSinal(diario.debitoDia)}` : '00:00'}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          diario.fatorAplicado === 'Em Dobro (100%)' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                          diario.fatorAplicado === '+50%' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          'bg-background border border-card-border text-muted'
                        }`}>
                          {diario.fatorAplicado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-muted">
                      Nenhuma ocorrência diária localizada para o filtro de classificação selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* COMPONENTE DE PAGINAÇÃO HOMOLOGADO JFAM */}
          <Pagination
            totalItems={dadosDiariosFiltrados.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
          />
        </div>
      </div>

    </div>
  );
}