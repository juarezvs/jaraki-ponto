'use client';

import { useState } from 'react';
import { 
  FiFolder, 
  FiClock, 
  FiCalendar, 
  FiPlus, 
  FiGrid, 
  FiCornerDownRight, 
  FiMapPin, 
  FiAlertCircle 
} from 'react-icons/fi';
// AJUSTE: Importação do componente de link nativo para navegação estável
import Link from 'next/link';

interface LotacaoItem {
  id: string;
  nome: string;
  sigla: string;
  unidade: 'SEDE_MANAUS' | 'SUBSECAO_TABATINGA' | 'UAA_TEFE';
  parentName: string | null;
}

interface JornadaItem {
  id: string;
  nome: string;
  tipo: '7_HORAS' | '8_HORAS' | 'ESPECIAL';
  entrada: string;
  saida: string;
  intervaloMinutos: number;
}

interface FeriadoItem {
  id: string;
  data: string;
  descricao: string;
  tipo: 'FERIADO' | 'PONTO_FACULTATIVO' | 'RECESSO';
  multiplicador: '50%' | '100%' | 'REGULAR';
}

export default function CadastrosBasicosPage() {
  const [activeTab, setActiveTab] = useState<'LOTACAO' | 'JORNADA' | 'CALENDARIO'>('LOTACAO');

  // Mocks de dados estruturados com base na Portaria 135/2025
  const [lotacoes] = useState<LotacaoItem[]>([
    { id: '1', nome: 'Diretoria do Foro', sigla: 'DIREF', unidade: 'SEDE_MANAUS', parentName: null },
    { id: '2', nome: 'Seção de Cadastro de Pessoal', sigla: 'SECAP', unidade: 'SEDE_MANAUS', parentName: 'Diretoria do Foro' },
    { id: '3', nome: '1ª Vara Federal - Gabinete', sigla: '01VF-GAB', unidade: 'SEDE_MANAUS', parentName: null },
    { id: '4', nome: '1ª Vara Federal - Secretaria', sigla: '01VF-SEC', unidade: 'SEDE_MANAUS', parentName: '1ª Vara Federal - Gabinete' },
    { id: '5', nome: 'Subseção Judiciária de Tabatinga', sigla: 'SSJTB', unidade: 'SUBSECAO_TABATINGA', parentName: null },
    { id: '6', nome: 'Unidade Avançada de Tefé', sigla: 'UAA-TEFE', unidade: 'UAA_TEFE', parentName: null },
  ]);

  const [jornadas] = useState<JornadaItem[]>([
    { id: 'j1', nome: 'Jornada Padrão Ininterrupta', tipo: '7_HORAS', entrada: '08:00', saida: '15:00', intervaloMinutos: 0 },
    { id: 'j2', nome: 'Jornada Ordinária Administrativa', tipo: '8_HORAS', entrada: '08:00', saida: '17:00', intervaloMinutos: 60 },
    { id: 'j3', nome: 'Horário Diferenciado Excepcional', tipo: 'ESPECIAL', entrada: '06:00', saida: '13:00', intervaloMinutos: 0 },
  ]);

  const [calendario] = useState<FeriadoItem[]>([
    { id: 'c1', data: '01/01/2026', descricao: 'Confraternização Universal', tipo: 'FERIADO', multiplicador: '100%' },
    { id: 'c2', data: '24/10/2026', descricao: 'Aniversário de Manaus', tipo: 'FERIADO', multiplicador: '100%' },
    { id: 'c3', data: '28/10/2026', descricao: 'Dia do Servidor Público', tipo: 'PONTO_FACULTATIVO', multiplicador: '50%' },
    { id: 'c4', data: '20/12/2026', descricao: 'Início do Recesso Forense', tipo: 'RECESSO', multiplicador: 'REGULAR' },
  ]);

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* CABEÇALHO DO MÓDULO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Parâmetros e Cadastros Básicos
          </h1>
          <p className="text-sm text-muted">
            Gerenciamento das tabelas de infraestrutura organizacional e regras fiscais da JFAM.
          </p>
        </div>
        
        {/* AJUSTE: Transformado de <button> para <Link> dinâmico direcionando para a rota de criação */}
        <Link 
          href="/cadastros/novo"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          Novo Registro
        </Link>
      </div>

      {/* SELETOR DE ABAS CORPORATIVAS */}
      <div className="flex border-b border-card-border gap-2 select-none">
        <button
          onClick={() => setActiveTab('LOTACAO')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'LOTACAO'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <FiGrid className="w-4 h-4" />
          Lotações e Subunidades (Art. 4º)
        </button>

        <button
          onClick={() => setActiveTab('JORNADA')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'JORNADA'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <FiClock className="w-4 h-4" />
          Regimes de Jornada
        </button>

        <button
          onClick={() => setActiveTab('CALENDARIO')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'CALENDARIO'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <FiCalendar className="w-4 h-4" />
          Calendário de Exceções
        </button>
      </div>

      {/* CONTEÚDO DINÂMICO DAS ABAS */}
      <div className="bg-card border border-card-border rounded-xl shadow-xs overflow-hidden">
        
        {/* ABA 1: LOTAÇÕES */}
        {activeTab === 'LOTACAO' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/60 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="p-4">Estrutura Setorial (JFAM)</th>
                  <th className="p-4 w-32">Sigla</th>
                  <th className="p-4 w-56">Unidade Física</th>
                  <th className="p-4 w-64">Vínculo Hierárquico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-sm text-foreground">
                {lotacoes.map((lot) => (
                  <tr key={lot.id} className="hover:bg-background/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {lot.parentName ? (
                          <FiCornerDownRight className="w-4 h-4 text-primary ml-4 shrink-0" />
                        ) : (
                          <FiFolder className="w-4 h-4 text-primary shrink-0" />
                        )}
                        <span className={lot.parentName ? 'font-medium text-muted/90' : 'font-bold tracking-tight'}>
                          {lot.nome}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-primary">
                      {lot.sigla}
                    </td>
                    <td className="p-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <FiMapPin className="w-3.5 h-3.5 text-muted" />
                        {lot.unidade.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-muted font-medium">
                      {lot.parentName ? lot.parentName : <span className="text-emerald-500 font-bold uppercase tracking-wide text-[10px]">Unidade Raiz</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ABA 2: REGIMES DE JORNADA */}
        {activeTab === 'JORNADA' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/60 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="p-4">Nome da Grade Horária</th>
                  <th className="p-4 w-44">Tipo Regulamentar</th>
                  <th className="p-4 w-32 text-center">Entrada Base</th>
                  <th className="p-4 w-32 text-center">Saída Base</th>
                  <th className="p-4 w-40 text-right">Intervalo Obrigatório</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-sm text-foreground">
                {jornadas.map((jor) => (
                  <tr key={jor.id} className="hover:bg-background/30 transition-colors">
                    <td className="p-4 font-bold tracking-tight">{jor.nome}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        jor.tipo === '7_HORAS' ? 'bg-indigo-500/10 text-primary' :
                        jor.tipo === '8_HORAS' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {jor.tipo.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-xs font-semibold">{jor.entrada}</td>
                    <td className="p-4 text-center font-mono text-xs font-semibold">{jor.saida}</td>
                    <td className="p-4 text-right font-medium text-muted">
                      {jor.intervaloMinutos > 0 ? `${jor.intervaloMinutos} min (Almoço)` : 'Ininterrupto'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ABA 3: CALENDÁRIO DE FERIADOS */}
        {activeTab === 'CALENDARIO' && (
          <div>
            <div className="m-4 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-amber-700 dark:text-amber-400">
              <FiAlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-bold uppercase tracking-wide">Regra Automática Baseada no Art. 2º, VI:</p>
                <p>O sistema processará batidas em dias marcados como <strong>Feriado</strong> com fator multiplicador em dobro (100%)[cite: 46, 247]. Horas excedentes em dias de <strong>Ponto Facultativo</strong> ou Sábados aplicarão acréscimo de 50%[cite: 46, 47].</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background/60 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                    <th className="p-4 w-36">Data Geral</th>
                    <th className="p-4">Descrição do Evento / Feriado</th>
                    <th className="p-4 w-48">Classificação Administrativa</th>
                    <th className="p-4 w-40 text-right">Multiplicador de Crédito</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-sm text-foreground">
                  {calendario.map((cal) => (
                    <tr key={cal.id} className="hover:bg-background/30 transition-colors">
                      <td className="p-4 font-mono text-xs font-bold text-muted">{cal.data}</td>
                      <td className="p-4 font-semibold tracking-tight">{cal.descricao}</td>
                      <td className="p-4">
                        <span className="text-xs font-medium text-foreground">{cal.tipo.replace('_', ' ')}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded ${
                          cal.multiplicador === '100%' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                          cal.multiplicador === '50%' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          'bg-background border border-card-border text-muted'
                        }`}>
                          {cal.multiplicador === 'REGULAR' ? 'Fator Nominal' : `Ganha +${cal.multiplicador}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}