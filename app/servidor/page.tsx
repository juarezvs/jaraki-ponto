'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FiClock, 
  FiTrendingUp, 
  FiAlertCircle, 
  FiFileText, 
  FiCheckCircle, 
  FiArrowRight, 
  FiCalendar, 
  FiMapPin 
} from 'react-icons/fi';
import Link from 'next/link';

interface ServidorLogado {
  matricula: string;
  nome: string;
  lotacao: string;
  regime: string;
  jornadaBase: string;
  unidade: string;
}

interface RegistroHoje {
  entrada1: string | null;
  saida1: string | null;
  entrada2: string | null;
  saida2: string | null;
  minutosTrabalhadosHoje: number;
}

export default function DashboardServidorPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- MOCK 1: Perfil do Servidor Autenticado (Prisma: Usuario) ---
  const servidor: ServidorLogado = {
    matricula: 'AM5432',
    nome: 'Mariana Costa Ferreira',
    lotacao: 'Secretaria da 1ª Vara Federal (01VF-SEC)',
    unidade: 'Sede Manaus',
    regime: 'Trabalho Híbrido (Art. 6º, §6º) [cite: 834]',
    jornadaBase: '07 horas diárias ininterruptas (Art. 4º) [cite: 810]'
  };

  // --- MOCK 2: Batidas Efetuadas no Dia Corrente (Prisma: RegistroPonto) ---
  const [pontoHoje, setPontoHoje] = useState<RegistroHoje>({
    entrada1: '08:02',
    saida1: '12:00',
    entrada2: '13:00',
    saida2: null, 
    minutosTrabalhadosHoje: 300 
  });

  // --- MOCK 3: Resumo Consolidado do Mês (Prisma: BancoHorasMensal) ---
  const saldoMensalMinutos = 450; 
  const creditosAcumuladosMes = 660; 

  // Alerta Reativo de Ampla Defesa (Art. 16, §4º) [cite: 904, 1232]
  const notificacaoAlerta = {
    id: 'notif-01',
    titulo: 'Notificação de Inconsistência Pendente (Art. 16, §4º) [cite: 904, 1232]',
    descricao: 'Identificada ausência de registro em 18/05/2026. Apresente sua justificativa em até 2 dias úteis[cite: 905].',
    diasRestantes: 2
  };

  // CORREÇÃO: Variável 'absolute' unificada em português para 'absoluto' para matar o ReferenceError
  const formatarMinutos = (minutos: number) => {
    const absoluto = Math.abs(minutos);
    const h = Math.floor(absoluto / 60);
    const m = absoluto % 60; 
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    return `${minutos < 0 ? '-' : ''}${hStr}:${mStr}`;
  };

  const labelProximaBatida = useMemo(() => {
    if (!pontoHoje.entrada1) return 'Registrar Entrada 1';
    if (!pontoHoje.saida1) return 'Registrar Intervalo (Saída)';
    if (!pontoHoje.entrada2) return 'Registrar Retorno Intervalo';
    return 'Registrar Saída Final';
  }, [pontoHoje]);

  const handleBaterPonto = () => {
    const agora = new Date();
    const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    setPontoHoje((prev) => {
      if (!prev.entrada1) return { ...prev, entrada1: horaStr };
      if (!prev.saida1) return { ...prev, saida1: horaStr };
      if (!prev.entrada2) return { ...prev, entrada2: horaStr };
      return { ...prev, saida2: horaStr };
    });
    alert(`Batida biométrica simulada com sucesso às ${horaStr}! [cite: 776]`);
  };

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* SEÇÃO 1: CABEÇALHO COM RELÓGIO EM TEMPO REAL */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-6 bg-card border border-card-border rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded">
              Matrícula: {servidor.matricula}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted font-medium">
              <FiMapPin className="w-3.5 h-3.5" />
              {servidor.unidade}
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Olá, {servidor.nome}
          </h1>
          <p className="text-sm text-muted">
            {servidor.lotacao} • <span className="font-semibold text-primary">{servidor.regime}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-background border border-card-border rounded-xl p-3 px-5 self-start lg:self-center">
          <FiClock className="w-6 h-6 text-primary animate-pulse" />
          <div className="text-left">
            <p className="text-xl font-bold font-mono text-foreground leading-none">
              {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-[10px] text-muted font-bold uppercase mt-1">
              {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>

      {/* PAINEL CENTRAL DE ALERTAS DE GOVERNANÇA (Art. 16, §4º) [cite: 904, 1232] */}
      {notificacaoAlerta && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl flex items-start gap-3 shadow-2xs animate-fade-in">
          <FiAlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm space-y-1 flex-1">
            <p className="font-bold uppercase tracking-wide">{notificacaoAlerta.titulo}</p>
            <p className="text-muted text-xs leading-relaxed">{notificacaoAlerta.descricao}</p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-center"
          >
            Justificar
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* SEÇÃO 2: GRID DE MÉTRICAS MENSAIS [cite: 1226] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CARD 2.1: SALDO DO MÊS */}
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Saldo Acumulado no Mês [cite: 793]</p>
            <h3 className="text-2xl font-bold tracking-tight text-emerald-600">
              +{formatarMinutos(saldoMensalMinutos)} <span className="text-xs text-muted font-normal">horas</span>
            </h3>
          </div>
        </div>

        {/* CARD 2.2: TETO MENSAL ART. 14 [cite: 888, 1230] */}
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FiClock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Teto para Fruição (Art. 14) [cite: 888, 1230]</p>
              <span className="text-[10px] font-bold font-mono text-muted">{formatarMinutos(creditosAcumuladosMes)} / 16:00 [cite: 888, 1230]</span>
            </div>
            <div className="w-full bg-background border border-card-border/60 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min((creditosAcumuladosMes / 960) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* CARD 2.3: JORNADA DIÁRIA REGULAMENTADA */}
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FiFileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Contrato de Jornada Diária [cite: 810]</p>
            <h3 className="text-xs font-bold text-foreground mt-1 leading-relaxed">
              {servidor.jornadaBase}
            </h3>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: BATIDA VIRTUAL E QUADRO DO DIA [cite: 1029] */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTERFACE DE MARCAÇÃO BIOMÉTRICA [cite: 825, 841] */}
        <div className="bg-card border border-card-border rounded-xl shadow-sm p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Identificação Biométrica Eletrônica [cite: 825]</h3>
            <p className="text-xs text-muted">
              Pressione o botão abaixo para simular a validação digital do seu registro de presença diária[cite: 776, 841].
            </p>
          </div>

          <button
            type="button"
            onClick={handleBaterPonto}
            className="w-full py-4 bg-primary text-white font-bold text-sm rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
          >
            <FiClock className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
            {labelProximaBatida}
          </button>

          <div className="border-t border-card-border/60 pt-4 grid grid-cols-2 gap-2">
            <Link 
              href="#"
              className="p-2.5 bg-background border border-card-border rounded-lg text-xs font-bold text-foreground text-center hover:bg-card-border/30 transition-colors shadow-2xs"
            >
              Meu Extrato Mensal
            </Link>
            <Link 
              href="#"
              className="p-2.5 bg-background border border-card-border rounded-lg text-xs font-bold text-foreground text-center hover:bg-card-border/30 transition-colors shadow-2xs"
            >
              Incluir Justificativa
            </Link>
          </div>
        </div>

        {/* ESPELHO DIÁRIO REAL DE MARCAÇÕES (Art. 6º) [cite: 828, 1234] */}
        <div className="lg:col-span-2 bg-card border border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-card-border bg-background/30 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FiCheckCircle className="text-primary w-4 h-4" />
              Linha do Tempo de Batidas (Hoje) [cite: 828]
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded">
              Efetivo: {formatarMinutos(pontoHoje.minutosTrabalhadosHoje)} horas
            </span>
          </div>

          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 items-center">
            
            <div className="p-4 bg-background border border-card-border rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Entrada 1</span>
              <span className="font-mono text-base font-bold text-foreground">{pontoHoje.entrada1 || '--:--'}</span>
            </div>

            <div className="p-4 bg-background border border-card-border rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Intervalo (Ida) [cite: 828]</span>
              <span className="font-mono text-base font-bold text-foreground">{pontoHoje.saida1 || '--:--'}</span>
            </div>

            <div className="p-4 bg-background border border-card-border rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Intervalo (Volta) [cite: 828]</span>
              <span className="font-mono text-base font-bold text-foreground">{pontoHoje.entrada2 || '--:--'}</span>
            </div>

            <div className="p-4 bg-background border border-card-border rounded-xl text-center space-y-1 ring-1 ring-primary/40 dark:ring-primary/20">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Saída Final</span>
              <span className="font-mono text-base font-bold text-primary animate-pulse">{pontoHoje.saida2 || '--:--'}</span>
            </div>

          </div>

          <div className="p-3 bg-background/50 border-t border-card-border text-[10px] text-muted text-center font-medium">
            Os dados aqui exibidos são integrados em tempo real com o barramento do Núcleo de Tecnologia (NUTEC)[cite: 927].
          </div>
        </div>

      </div>

    </div>
  );
}