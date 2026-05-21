'use client';

import { useState, useMemo } from 'react';
import { 
  FiCalendar, 
  FiClock, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiSearch, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiPlusCircle 
} from 'react-icons/fi';
import Link from 'next/link';

// Importações dos componentes universais da JFAM
import PdfExportButton from '../components/pdf-export-button';

interface LinhaEspelho {
  data: string;
  diaSemana: string;
  entrada1: string | null;
  saida1: string | null;
  entrada2: string | null;
  saida2: string | null;
  minutosTrabalhados: number;
  minutosCredito: number;
  minutosDebito: number;
  status: 'NORMAL' | 'INCOMPLETO' | 'JUSTIFICADO' | 'FERIADO';
  obs: string;
}

export default function ExtratoMensalServidorPage() {
  // Estados de controle e filtros reativos
  const [mesAno, setMesAno] = useState('2026-05');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  // --- MOCK: Linhas do Espelho de Ponto Eletrônico (Prisma: RegistroPonto) ---
  const registrosEspelhoMock: LinhaEspelho[] = [
    { data: '01/05/2026', diaSemana: 'Sexta', entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '15:00', minutosTrabalhados: 420, minutosCredito: 0, minutosDebito: 0, status: 'NORMAL', obs: 'Jornada Ordinária Cumprida' },
    { data: '04/05/2026', diaSemana: 'Segunda', entrada1: '07:55', saida1: '12:00', entrada2: '13:00', saida2: '16:00', minutosTrabalhados: 485, minutosCredito: 65, minutosDebito: 0, status: 'NORMAL', obs: 'Horas-crédito autorizadas' },
    { data: '05/05/2026', diaSemana: 'Terça', entrada1: '08:05', saida1: null, entrada2: null, saida2: null, minutosTrabalhados: 5, minutosCredito: 0, minutosDebito: 415, status: 'INCOMPLETO', obs: 'Esquecimento de marcação' }, // Requer Justificativa Art. 18, IV
    { data: '06/05/2026', diaSemana: 'Quarta', entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '15:00', minutosTrabalhados: 420, minutosCredito: 0, minutosDebito: 0, status: 'NORMAL', obs: 'Jornada Ordinária Cumprida' },
    { data: '07/05/2026', diaSemana: 'Quinta', entrada1: null, saida1: null, entrada2: null, saida2: null, minutosTrabalhados: 0, minutosCredito: 0, minutosDebito: 0, status: 'JUSTIFICADO', obs: 'Atestado Médico - Homologado SEI' }, // Art. 7º
    { data: '10/05/2026', diaSemana: 'Domingo', entrada1: '09:00', saida1: '13:00', entrada2: null, saida2: null, minutosTrabalhados: 240, minutosCredito: 480, minutosDebito: 0, status: 'FERIADO', obs: 'Plantão Judiciário (Fator em Dobro)' }, // Art. 2º, VI
  ];

  // Máscara reativa de conversão Int para HH:MM
  const formatarMinutosVisual = (minutos: number) => {
    const absoluto = Math.abs(minutos);
    const h = Math.floor(absoluto / 60);
    const m = absoluto % 60;
    return `${minutos < 0 ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Filtragem dos registros baseada na seleção de abas ou status
  const registrosFiltrados = useMemo(() => {
    return registrosEspelhoMock.filter((item) => {
      if (filtroStatus === 'TODOS') return true;
      return item.status === filtroStatus;
    });
  }, [filtroStatus]);

  // Totais matemáticos consolidados para os cards superiores
  const somatorios = useMemo(() => {
    let trabalhados = 0; let creditos = 0; let debitos = 0;
    registrosFiltrados.forEach(r => {
      trabalhados += r.minutosTrabalhados;
      creditos += r.minutosCredito;
      debitos += r.minutosDebito;
    });
    return { trabalhados, creditos, debitos };
  }, [registrosFiltrados]);

  // Colunas do blueprint programático para exportação em PDF A4 Paisagem
  const colunasPdf = useMemo(() => [
    { header: 'Data', accessor: (l: LinhaEspelho) => `${l.data} (${l.diaSemana})` },
    { header: 'Entrada 1', accessor: (l: LinhaEspelho) => l.entrada1 || '--:--' },
    { header: 'Intervalo Ida', accessor: (l: LinhaEspelho) => l.saida1 || '--:--' },
    { header: 'Intervalo Volta', accessor: (l: LinhaEspelho) => l.entrada2 || '--:--' },
    { header: 'Saída Final', accessor: (l: LinhaEspelho) => l.saida2 || '--:--' },
    { header: 'Efetivo', accessor: (l: LinhaEspelho) => formatarMinutosVisual(l.minutosTrabalhados) },
    { header: 'Crédito', accessor: (l: LinhaEspelho) => formatarMinutosVisual(l.minutosCredito) },
    { header: 'Débito', accessor: (l: LinhaEspelho) => formatarMinutosVisual(l.minutosDebito) },
    { header: 'Ocorrência / Notas', accessor: (l: LinhaEspelho) => l.obs },
  ], []);

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* CABEÇALHO DO EXTRATO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Meu Espelho de Ponto</h1>
          <p className="text-sm text-muted">Acompanhamento detalhado das batidas diárias e conformidade do Boletim mensal.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="month"
            value={mesAno}
            onChange={(e) => setMesAno(e.target.value)}
            className="px-3 py-2 bg-card border border-card-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:border-primary transition-colors cursor-pointer"
          />
          <PdfExportButton
            data={registrosFiltrados}
            columns={colunasPdf}
            title={`Espelho de Frequência Eletrônica - Competência ${mesAno} - JFAM`}
            orientation="landscape"
          />
        </div>
      </div>

      {/* CARDS DE APURAÇÃO DO EXTRATO (MINUTOS CONVERTIDOS EM HORAS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Tempo Efetivo no Mês</p>
            <h3 className="text-xl font-bold text-foreground font-mono">{formatarMinutosVisual(somatorios.trabalhados)}h</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Total Créditos Gerados</p>
            <h3 className="text-xl font-bold text-emerald-600 font-mono">+{formatarMinutosVisual(somatorios.creditos)}h</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <FiTrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Total Débitos Acumulados</p>
            <h3 className="text-xl font-bold text-rose-600 font-mono">-{formatarMinutosVisual(somatorios.debitos)}h</h3>
          </div>
        </div>
      </div>

      {/* GRADE DE BATIDAS DIÁRIAS */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        
        {/* FILTROS CAPSULE INTERNOS */}
        <div className="p-4 border-b border-card-border bg-background/30 flex flex-wrap gap-2 select-none">
          {['TODOS', 'NORMAL', 'INCOMPLETO', 'JUSTIFICADO', 'FERIADO'].map((st) => (
            <button
              key={st}
              onClick={() => setFiltroStatus(st)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                filtroStatus === st 
                  ? 'bg-primary border-primary text-white shadow-2xs' 
                  : 'bg-background border-card-border text-muted hover:text-foreground'
              }`}
            >
              {st === 'TODOS' ? 'Exibir Todo o Mês' : st}
            </button>
          ))}
        </div>

        {/* TABELA RESPONSIVA DA FOLHA DE FREQUÊNCIA */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                <th className="p-4 w-36">Data (Dia)</th>
                <th className="p-3 text-center">Entrada 1</th>
                <th className="p-3 text-center">Int. Ida</th>
                <th className="p-3 text-center">Int. Volta</th>
                <th className="p-3 text-center">Saída 2</th>
                <th className="p-3 text-center">Líquido</th>
                <th className="p-4 w-60">Ocorrência / Histórico Administrativo</th>
                <th className="p-4 text-right w-32">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-xs text-foreground font-medium">
              {registrosFiltrados.map((reg) => (
                <tr key={reg.data} className="hover:bg-background/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-muted">
                    {reg.data} <span className="text-[10px] font-normal font-sans">({reg.diaSemana})</span>
                  </td>
                  <td className="p-3 text-center font-mono">{reg.entrada1 || '--:--'}</td>
                  <td className="p-3 text-center font-mono">{reg.saida1 || '--:--'}</td>
                  <td className="p-3 text-center font-mono">{reg.entrada2 || '--:--'}</td>
                  <td className="p-3 text-center font-mono">{reg.saida2 || '--:--'}</td>
                  <td className="p-3 text-center font-mono">
                    <span className={reg.minutosCredito > 0 ? 'text-emerald-600' : reg.minutosDebito > 0 ? 'text-rose-600' : 'text-muted'}>
                      {reg.minutosCredito > 0 ? `+${formatarMinutosVisual(reg.minutosCredito)}` : reg.minutosDebito > 0 ? `-${formatarMinutosVisual(reg.minutosDebito)}` : '00:00'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-foreground tracking-tight">{reg.obs}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider w-max ${
                        reg.status === 'NORMAL' ? 'text-emerald-500' :
                        reg.status === 'JUSTIFICADO' ? 'text-primary' :
                        reg.status === 'FERIADO' ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        Status: {reg.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {reg.status === 'INCOMPLETO' ? (
                      <Link 
                        href="/ocorrencias/novo"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors shadow-2xs"
                      >
                        <FiAlertCircle className="w-3 h-3" />
                        Justificar
                      </Link>
                    ) : (
                      <span className="text-xs text-muted/60 font-normal select-none">Regularizado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}