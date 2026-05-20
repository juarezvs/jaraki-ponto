'use client';

import { useState } from 'react';
import Stepper from '@/app/components/Stepper'; 
import { StepItem, StepperStyles } from '@/app/types/stepper';
import { Calendar, AlertCircle, FileCheck, ArrowRight, ArrowLeft, Send } from 'lucide-react';

export default function SolicitacaoAjustePontoPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Estado estruturado para os dados regulamentares do ajuste de ponto
  const [formData, setFormData] = useState({
    dataOcorrencia: '',
    tipoOcorrencia: 'esquecimento',
    horarioSugerido: '',
    justificativaDetalhada: '',
    declaroVerdadeiro: false
  });

  // 1. Definição das etapas usando ícones do Lucide
  const etapas: StepItem[] = [
    {
      label: 'Dados do Ajuste',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: 'Conferência da Chefia',
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      label: 'Protocolo Gerado',
      icon: <FileCheck className="h-5 w-5" />,
    },
  ];

  // 2. Cores e espessuras vinculadas às variáveis semânticas do seu sistema
  const estilosDoStepper: StepperStyles = {
    activeColor: 'var(--color-primary, #4f46e5)',        
    inactiveColor: 'var(--color-card-border, #e5e7eb)',  
    activeLineWidth: '5px',       
    inactiveLineWidth: '2px',     
  };

  const avancarEtapa = () => setCurrentStep((prev) => Math.min(prev + 1, etapas.length));
  const voltarEtapa = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 antialiased transition-colors duration-300">
      <div className="w-full max-w-2xl bg-card rounded-xl shadow-sm border border-card-border p-6 sm:p-10 transition-colors duration-300">
        
        {/* Cabeçalho */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Requerimento de Ajuste de Ponto</h1>
          <p className="text-sm text-muted mt-1">Tratamento de inconsistência individual em conformidade com a Portaria DIREF</p>
        </div>

        {/* Instanciando o Stepper Semântico */}
        <Stepper steps={etapas} currentStep={currentStep} styles={estilosDoStepper} />

        {/* CONTAINER DO FORMULÁRIO COM VARIÁVEIS DE TEMA */}
        <div className="mt-8 bg-background/50 rounded-xl border border-card-border p-5 sm:p-6 min-h-80 flex flex-col justify-between transition-colors duration-300">
          
          {/* ETAPA 1: PREENCHIMENTO DOS DADOS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground border-b border-card-border pb-2">1. Informações da Ocorrência</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted">Data do Esquecimento/Inconsistência</label>
                  <input 
                    type="date" 
                    name="dataOcorrencia" 
                    value={formData.dataOcorrencia} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted">Tipo de Marcação Omitida</label>
                  <select 
                    name="tipoOcorrencia" 
                    value={formData.tipoOcorrencia} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="esquecimento">Início de Jornada (Entrada M manhã)</option>
                    <option value="saida-almoco">Saída Intervalo (Almoço)</option>
                    <option value="retorno-almoco">Retorno Intervalo (Almoço)</option>
                    <option value="fim-jornada">Fim de Jornada (Saída Tarde)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted">Horário Real do Fato (HH:MM)</label>
                <input 
                  type="time" 
                  name="horarioSugerido" 
                  value={formData.horarioSugerido} 
                  onChange={handleInputChange}
                  className="w-28 px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted">Justificativa Legal fundamentada</label>
                <textarea 
                  name="justificativaDetalhada" 
                  value={formData.justificativaDetalhada} 
                  onChange={handleInputChange}
                  rows={3} 
                  placeholder="Escreva detalhadamente o motivo do ajuste para avaliação da chefia..." 
                  className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted/60"
                />
              </div>
            </div>
          )}

          {/* ETAPA 2: REVISÃO E COMPROMISSO LEGAL */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground border-b border-card-border pb-2">2. Declaração e Termo de Responsabilidade</h2>
              
              <div className="bg-card rounded-lg p-4 border border-card-border space-y-3 text-sm text-foreground/90 transition-colors">
                <p><strong className="text-muted">Data solicitada:</strong> {formData.dataOcorrencia ? new Date(formData.dataOcorrencia).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : <span className="text-rose-500 italic">Não informada</span>}</p>
                <p className="capitalize"><strong className="text-muted">Tipo de Ajuste:</strong> {formData.tipoOcorrencia.replace('-', ' ')}</p>
                <p><strong>Horário a ser inserido:</strong> {formData.horarioSugerido || <span className="text-rose-500 italic">Não informado</span>}h</p>
                <p className="bg-background border border-card-border p-2 rounded text-muted text-xs italic break-words">
                  &quot;{formData.justificativaDetalhada || 'Nenhuma justificativa digitada.'}&quot;
                </p>
              </div>

              {/* Termo de aceite obrigatório conforme responsabilidade do servidor público */}
              <div className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <input 
                  type="checkbox" 
                  id="declaroVerdadeiro"
                  name="declaroVerdadeiro"
                  checked={formData.declaroVerdadeiro}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-card-border text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="declaroVerdadeiro" className="text-xs text-muted leading-relaxed cursor-pointer select-none">
                  Declaro para os devidos fins que as informações acima descritas expressam estritamente a verdade sobre o meu horário de trabalho efetuado, estando ciente das sanções administrativas cabíveis em caso de falsa declaração.
                </label>
              </div>
            </div>
          )}

          {/* ETAPA 3: PROTOCOLO EMITIDO */}
          {currentStep === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 text-green-500 border-4 border-green-500/20 mb-1">
                <Send className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Requerimento Enviado à Chefia</h2>
              <p className="text-sm text-muted max-w-md mx-auto">
                O chamado de retificação de ponto foi gerado com sucesso sob o número de protocolo eletrônico <strong className="text-foreground">#AJU-{Math.floor(100000 + Math.random() * 900000)}</strong>.
              </p>
              <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 max-w-md mx-auto">
                Sua chefia imediata foi notificada via sistema e possui o prazo regulamentar estabelecido na portaria DIREF para despachar o deferimento ou indeferimento da sua marcação.
              </div>
            </div>
          )}

        </div>

        {/* BOTÕES DE NAVEGAÇÃO COMPATÍVEIS COM O SEU LOGO/LAYOUT */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={voltarEtapa}
            disabled={currentStep === 1 || currentStep === etapas.length}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-card-border text-foreground bg-card hover:bg-background/80 rounded-xl shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </button>

          {currentStep < etapas.length ? (
            <button
              type="button"
              onClick={avancarEtapa}
              disabled={currentStep === 2 && !formData.declaroVerdadeiro} // Bloqueia o envio se não assinar o termo
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:opacity-90 rounded-xl shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {currentStep === etapas.length - 1 ? 'Enviar Requerimento' : 'Avançar'} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setFormData({ dataOcorrencia: '', tipoOcorrencia: 'esquecimento', horarioSugerido: '', justificativaDetalhada: '', declaroVerdadeiro: false });
                setCurrentStep(1);
              }}
              className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all cursor-pointer"
            >
              Novo Ajuste
            </button>
          )}
        </div>

      </div>
    </main>
  );
}