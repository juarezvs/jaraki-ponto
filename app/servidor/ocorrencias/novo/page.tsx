'use client';

import { useState } from 'react';
import { 
  FiArrowLeft, 
  FiSave, 
  FiCalendar, 
  FiFileText, 
  FiShield, 
  FiInfo, 
  FiCheckCircle 
} from 'react-icons/fi';
import Link from 'next/link';

// Tipos de ocorrências regulamentadas na Portaria JFAM 135/2025
const TIPOS_OCORRENCIA = [
  { id: 'TRABALHO_EXTERNO', label: 'Trabalho Externo Autorizado (Art. 8º, §4º, II)' },
  { id: 'VIAGEM_SERVICO', label: 'Viagem a Serviço / Convocação (Art. 8º, §5º)' },
  { id: 'ATESTADO_MEDICO', label: 'Afastamento para Tratamento de Saúde / Atestado (Art. 7º)' },
  { id: 'TRE_CONVOCACAO', label: 'Serviço Eleitoral (Convocação TRE)' },
  { id: 'FALHA_BIOMETRIA', label: 'Correção por Falha Técnica de Equipamento (Art. 18, IV)' },
];

export default function IncluirJustificativaPontoPage() {
  // --- ESTADOS DO FORMULÁRIO ---
  const [dataOcorrencia, setDataOcorrencia] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState('TRABALHO_EXTERNO');
  const [processoSeiCode, setProcessoSeiCode] = useState('');
  const [detalhamento, setDetalhamento] = useState('');

  // Estados controladores de submissão e UX
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Payload estruturado em perfeita simetria com o modelo JustificativaPonto do Prisma
    const payloadPrisma = {
      dataAlvo: new Date(dataOcorrencia + 'T00:00:00'),
      tipo: tipoOcorrencia,
      boletimSeiCodigo: processoSeiCode || null,
      descricaoPormenorizada: detalhamento, // Atende ao Art. 2º, X
      status: 'PENDENTE', // Workflow inicializa aguardando crivo da chefia
    };

    console.log('Enviando via Prisma Client para avaliação da Chefia Imediata:', payloadPrisma);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setDataOcorrencia('');
      setProcessoSeiCode('');
      setDetalhamento('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 transition-colors duration-300">
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/extrato-mensal" 
            className="p-2 bg-card border border-card-border text-foreground hover:bg-background rounded-lg transition-colors shadow-2xs"
            aria-label="Retornar ao espelho mensal"
          >
            <FiArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Incluir Justificativa de Ponto</h1>
            <p className="text-sm text-muted">Apresentação de ocorrências e amparo regulamentar de inconsistências.</p>
          </div>
        </div>
      </div>

      {/* ALERTA COGNITIVO DE GRAVAÇÃO COM SUCESSO */}
      {showSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 shadow-2xs animate-fade-in">
          <FiCheckCircle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold">Ocorrência protocolada!</span> A justificativa foi salva com sucesso e enviada para o painel de homologação eletrônica da sua Chefia Imediata[cite: 909].
          </div>
        </div>
      )}

      {/* BLOCO DE FORMULÁRIO CORPORATIVO */}
      <form onSubmit={handleSubmit} className="bg-card border border-card-border rounded-xl shadow-xs overflow-hidden">
        <div className="p-6 space-y-5">
          
          {/* BLOCO INFORMATIVO LEGAL DA PORTARIA */}
          <div className="p-3.5 bg-background border border-card-border rounded-xl flex items-start gap-2.5 text-muted">
            <FiInfo className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <span className="text-xs leading-relaxed">
              O preenchimento destas informações assegura o cumprimento do <strong>Art. 16, §4º (Direito à Ampla Defesa)</strong>. Lançamentos deferidos pela chefia corrigem automaticamente o saldo de horas-débito diárias[cite: 791].
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DATA DA INCONSISTÊNCIA */}
            <div>
              <label htmlFor="data-ocorrencia" className="block text-xs font-bold text-muted mb-1.5 uppercase">Data da Ocorrência</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  id="data-ocorrencia"
                  type="date"
                  value={dataOcorrencia}
                  onChange={(e) => setDataOcorrencia(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
                />
              </div>
            </div>

            {/* ENQUADRAMENTO LEGAL DA PORTARIA */}
            <div>
              <label htmlFor="tipo-select" className="block text-xs font-bold text-muted mb-1.5 uppercase">Enquadramento Legal (Art. 2º)</label>
              <select
                id="tipo-select"
                value={tipoOcorrencia}
                onChange={(e) => setTipoOcorrencia(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {TIPOS_OCORRENCIA.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* VÍNCULO AO SEI ADMINISTRATIVO */}
          <div>
            <label htmlFor="sei-code" className="block text-xs font-bold text-muted mb-1.5 uppercase">Código do Processo Administrativo SEI (Opcional)</label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                id="sei-code"
                type="text"
                value={processoSeiCode}
                onChange={(e) => setProcessoSeiCode(e.target.value)}
                placeholder="Ex: 0002698-92.2022.4.01.8002"
                className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-muted/40"
              />
            </div>
          </div>

          {/* MOTIVAÇÃO DETALHADA - COMPLIANCE ART. 2º, X */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
              <label htmlFor="descricao" className="block text-xs font-bold text-muted uppercase">Motivação Pormenorizada </label>
              <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Vedadas justificativas genéricas (Art. 2º, X) </span>
            </div>
            <textarea
              id="descricao"
              rows={4}
              value={detalhamento}
              onChange={(e) => setDetalhamento(e.target.value)}
              required
              placeholder="Descreva minuciosamente a justificativa para a falta, atraso ou inconsistência técnica de registro de ponto (Ex: Número do atestado, detalhes de intimações judiciais ou ordens de missão externa)..."
              className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/40 resize-none leading-relaxed"
            />
          </div>

        </div>

        {/* BARRA DE AÇÕES INFERIOR */}
        <div className="p-4 bg-background/40 border-t border-card-border flex items-center justify-end gap-3">
          <Link
            href="/extrato-mensal"
            className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors select-none"
          >
            Descartar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer select-none"
          >
            <FiSave className="w-4 h-4" />
            {isSubmitting ? 'Protocolando...' : 'Enviar Justificativa'}
          </button>
        </div>
      </form>

    </div>
  );
}