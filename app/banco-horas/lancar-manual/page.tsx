'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FiArrowLeft, 
  FiSave, 
  FiUser, 
  FiFileText, 
  FiClock, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiShield 
} from 'react-icons/fi';
import Link from 'next/link';

// Mock de Servidores da Seção Judiciária do Amazonas para o seletor da SECAP
const SERVIDORES_JFAM_MOCK = [
  { matricula: 'AM5432', nome: 'Mariana Costa Ferreira', lotacao: 'Secretaria da 1ª Vara (01VF-SEC)' },
  { matricula: 'AM9876', nome: 'Carlos Augusto Amazonas', lotacao: 'Subseção Judiciária de Tabatinga (SSJTB)' },
  { matricula: 'AM1122', nome: 'Fernanda Rocha Lima', lotacao: 'Secretaria Administrativa (SECAD)' },
  { matricula: 'AM3344', nome: 'Ricardo Alves Pereira', lotacao: 'Núcleo de Tecnologia (NUTEC)' },
];

// Autoridades competentes para autorização de ajuste conforme Art. 2º, IX
const AUTORIDADES_MOCK = [
  { id: 'diref', nome: 'Dr. Érico Rodrigo Freitas Pinheiro (Juiz Federal Diretor do Foro)' },
  { id: 'v01_juiz', nome: 'Juiz Federal Titular da 1ª Vara Federal' },
  { id: 'secad_dir', nome: 'Diretor da Secretaria Administrativa (SECAD)' },
];

export default function LancamentoManualBancoHorasPage() {
  // --- ESTADOS DO FORMULÁRIO ---
  const [matricula, setMatricula] = useState('');
  const [mesReferencia, setMesReferencia] = useState('2026-05');
  const [tipoOperacao, setTipoOperacao] = useState<'CREDITO' | 'DEBITO'>('CREDITO');
  const [horasInput, setHorasInput] = useState('');
  const [minutosInput, setMinutosInput] = useState('');
  const [autorizadorId, setAutorizadorId] = useState('');
  const [processoSei, setProcessoSei] = useState('');
  const [justificativa, setJustificativa] = useState('');

  // Estados de controle de interface
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ENGENHARIA DE CÁLCULO: Minutos Inteiros para o Prisma ORM ---
  const totalMinutosCalculados = useMemo(() => {
    const h = parseInt(horasInput) || 0;
    const m = parseInt(minutosInput) || 0;
    return (h * 60) + m;
  }, [horasInput, minutosInput]);

  // Alerta Reativo (Art. 14): Caso o lançamento manual de crédito passe de 16h (960 min)
  const excedeLimiteRegulamentar = useMemo(() => {
    return tipoOperacao === 'CREDITO' && totalMinutosCalculados > 960;
  }, [tipoOperacao, totalMinutosCalculados]);

  // Forçar limpeza de estados após gravação bem-sucedida
  const limparFormulario = () => {
    setMatricula(''); setHorasInput(''); setMinutosInput('');
    setAutorizadorId(''); setProcessoSei(''); setJustificativa('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Estrutura em perfeita simetria com as colunas Int do Schema Prisma
    const payloadPrisma = {
      usuarioMatricula: matricula,
      mesReferencia: new Date(`${mesReferencia}-01`),
      // Salva como valor negativo se for débito para contabilidade líquida no banco
      minutosAjuste: tipoOperacao === 'CREDITO' ? totalMinutosCalculados : -totalMinutosCalculados,
      autorizadoPor: autorizadorId,
      seiProcessoCodigo: processoSei || null,
      motivoAuditoria: justificativa,
    };

    // Simulação da persistência assíncrona protegida por log de auditoria
    console.log('Objeto gerado para o Prisma Client + LogAuditoria:', payloadPrisma);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      limparFormulario();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 transition-colors duration-300">
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/banco-horas" 
            className="p-2 bg-card border border-card-border text-foreground hover:bg-background rounded-lg transition-colors shadow-2xs"
            aria-label="Voltar para o extrato de horas"
          >
            <FiArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Ajuste Manual de Banco de Horas</h1>
            <p className="text-sm text-muted">Lançamento excepcional de créditos ou débitos temporais realizado pelo Núcleo de Pessoas .</p>
          </div>
        </div>
      </div>

      {/* ALERTA DE SUCESSO COGNITIVO */}
      {showSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 shadow-2xs animate-fade-in">
          <FiCheckCircle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold">Lançamento efetuado!</span> O ajuste de saldo foi persistido e uma cópia de snapshot do estado foi indexada na tabela imutável de auditoria .
          </div>
        </div>
      )}

      {/* FORMULÁRIO ESTRUTURADO ORBUND SIS */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BLOCO 1: SELEÇÃO DO SERVIDOR E REFERÊNCIA */}
        <div className="p-6 bg-card border border-card-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-card-border">
            <FiUser className="text-primary w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Identificação do Beneficiário</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="servidor-select" className="block text-xs font-bold text-muted mb-1.5 uppercase">Selecionar Servidor SJAM</label>
              <select
                id="servidor-select"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="">Selecione o servidor por nome/lotação...</option>
                {SERVIDORES_JFAM_MOCK.map((srv) => (
                  <option key={srv.matricula} value={srv.matricula}>
                    {srv.nome} ({srv.matricula}) — {srv.lotacao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mes-referencia" className="block text-xs font-bold text-muted mb-1.5 uppercase">Mês de Referência </label>
              <input
                id="mes-referencia"
                type="month"
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* BLOCO 2: QUANTIFICAÇÃO DO TEMPO (MINUTOS INTEIROS) */}
        <div className="p-6 bg-card border border-card-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-card-border">
            <FiClock className="text-primary w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Quantificação do Saldo Adicional</h2>
          </div>

          {/* CHAVEADOR DE OPERAÇÃO (CÁPSULA) */}
          <div>
            <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Natureza do Ajuste </label>
            <div className="p-1 bg-background border border-card-border rounded-xl grid grid-cols-2 gap-1 select-none max-w-xs">
              <button
                type="button"
                onClick={() => setTipoOperacao('CREDITO')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tipoOperacao === 'CREDITO' ? 'bg-emerald-600 text-white shadow-xs' : 'text-muted hover:text-foreground'
                }`}
              >
                Crédito (+) 
              </button>
              <button
                type="button"
                onClick={() => setTipoOperacao('DEBITO')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tipoOperacao === 'DEBITO' ? 'bg-rose-600 text-white shadow-xs' : 'text-muted hover:text-foreground'
                }`}
              >
                Débito (-) 
              </button>
            </div>
          </div>

          {/* CAMPOS DE HORA E MINUTO DE ALTA DENSIDADE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="horas-input" className="block text-xs font-bold text-muted mb-1.5 uppercase">Horas brutas</label>
              <input
                id="horas-input"
                type="number"
                placeholder="00"
                value={horasInput}
                onChange={(e) => setHorasInput(e.target.value)}
                min={0}
                required
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
            <div>
              <label htmlFor="minutos-input" className="block text-xs font-bold text-muted mb-1.5 uppercase">Minutos adicionais </label>
              <input
                id="minutos-input"
                type="number"
                placeholder="00"
                value={minutosInput}
                onChange={(e) => setMinutosInput(e.target.value)}
                min={0}
                max={59}
                required
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>

            {/* CARD INDICADOR DA ABSTRAÇÃO PRISMA INT */}
            <div className="p-3 bg-background border border-card-border rounded-xl flex items-center justify-between h-9 sm:mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Payload Prisma:</span>
              <span className="text-xs font-mono font-bold text-primary">{totalMinutosCalculados} minutos (Int) </span>
            </div>
          </div>

          {/* WARNING ART. 14: EXCESSO DE CRÉDITO MENSAL SEM PROCESSO SEI */}
          {excedeLimiteRegulamentar && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl flex items-start gap-3 animate-fade-in">
              <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">Aviso de Limite Regulamentar (Art. 14):</span> Lançamentos manuais de crédito que superam 16 horas mensais ($960$ minutos) configuram <span className="font-semibold">"Horas acima do limite"</span> . Para acumulação legítima, certifique-se de anexar a justificativa e o número do Processo SEI autorizado pelo Diretor do Foro abaixo .
              </div>
            </div>
          )}
        </div>

        {/* BLOCO 3: RESPONSABILIDADE E AUDITORIA */}
        <div className="p-6 bg-card border border-card-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-card-border">
            <FiShield className="text-primary w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Autorização e Rastreabilidade </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="autorizador-select" className="block text-xs font-bold text-muted mb-1.5 uppercase">Superior Hierárquico Autorizador </label>
              <select
                id="autorizador-select"
                value={autorizadorId}
                onChange={(e) => setAutorizadorId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="">Selecione a autoridade ordenadora...</option>
                {AUTORIDADES_MOCK.map((aut) => (
                  <option key={aut.id} value={aut.id}>{aut.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sei-input" className="block text-xs font-bold text-muted mb-1.5 uppercase">Número do Processo SEI Administrativo </label>
              <input
                id="sei-input"
                type="text"
                placeholder="Ex: 0002698-92.2022.4.01.8002"
                value={processoSei}
                onChange={(e) => setProcessoSei(e.target.value)}
                required={excedeLimiteRegulamentar} // Torna obrigatório se estourar o teto do Art. 14 
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="justificativa-text" className="block text-xs font-bold text-muted uppercase">Motivação Pormenorizada do Ajuste </label>
              <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Vedadas justificativas genéricas (Art. 2º, X) </span>
            </div>
            <textarea
              id="justificativa-text"
              rows={3}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              required
              placeholder="Descreva detalhadamente a imperiosa necessidade do serviço ou evento fortuito que motivou este ajuste manual de banco de horas..."
              className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* BARRA DE AÇÕES INFERIOR */}
        <div className="p-4 bg-card border border-card-border rounded-xl shadow-2xs flex items-center justify-end gap-3">
          <Link
            href="/banco-horas"
            className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors select-none"
          >
            Voltar ao Extrato
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer select-none"
          >
            <FiSave className="w-4 h-4" />
            {isSubmitting ? 'Gravando no Banco...' : 'Persistir Ajuste'}
          </button>
        </div>

      </form>
    </div>
  );
}