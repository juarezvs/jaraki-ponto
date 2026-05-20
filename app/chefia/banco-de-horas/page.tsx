'use client';

import { useState } from 'react';
import Stepper from '@/app/components/Stepper'; 
import { StepItem, StepperStyles } from '@/app/types/stepper';
import { UserCheck, ShieldAlert, BadgeCheck, ArrowRight, ArrowLeft, Save } from 'lucide-react';

export default function LancamentoBancoChefiaPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Estado estruturado para o lançamento gerencial de banco de horas
  const [formData, setFormData] = useState({
    servidorId: '',
    tipoOperacao: 'credito',
    quantidadeHoras: '',
    dataFato: '',
    fundamentacaoLegal: 'sobrejornada',
    parecerDescritivo: '',
    autorizoDiref: false
  });

  // Lista simulada de subordinados da chefia para o select
  const subordinados = [
    { id: 'AM200401', nome: 'Juarez de Vasconcelos da Silva' },
    { id: 'AM200402', nome: 'Adriana Cristo de Castro' },
    { id: 'AM200403', nome: 'Carlos Eduardo Souza' },
  ];

  // 1. Definição das etapas de lançamento gerencial
  const etapas: StepItem[] = [
    {
      label: 'Lançamento',
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      label: 'Parecer Legal',
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    {
      label: 'Efetivado',
      icon: <BadgeCheck className="h-5 w-5" />,
    },
  ];

  // 2. Cores e espessuras vinculadas estritamente às variáveis do seu sistema
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

  const funcionarioSelecionado = subordinados.find(f => f.id === formData.servidorId)?.nome;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 antialiased transition-colors duration-300">
      <div className="w-full max-w-2xl bg-card rounded-xl shadow-sm border border-card-border p-6 sm:p-10 transition-colors duration-300">
        
        {/* Cabeçalho de Gestão */}
        <div className="text-center mb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md">Painel da Chefia</span>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-2">Ajuste Manual de Banco de Horas</h1>
          <p className="text-sm text-muted mt-1">Inclusão excepcional de débitos ou créditos por prerrogativa da Chefia Imediata</p>
        </div>

        {/* Instanciando o Stepper Semântico */}
        <Stepper steps={etapas} currentStep={currentStep} styles={estilosDoStepper} />

        {/* CONTAINER DINÂMICO DE FORMULÁRIO */}
        <div className="mt-8 bg-background/50 rounded-xl border border-card-border p-5 sm:p-6 min-h-80 flex flex-col justify-between transition-colors duration-300">
          
          {/* ETAPA 1: SELEÇÃO E QUANTIDADE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground border-b border-card-border pb-2">1. Escopo do Lançamento</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted">Selecionar Servidor Subordinado</label>
                <select 
                  name="servidorId" 
                  value={formData.servidorId} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="">-- Escolha um funcionário da sua lotação --</option>
                  {subordinados.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.nome} ({sub.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted">Operação de Saldo</label>
                  <select 
                    name="tipoOperacao" 
                    value={formData.tipoOperacao} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="credito">Crédito (+)</option>
                    <option value="debito">Débito (-)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted">Quantidade (HH:MM)</label>
                  <input 
                    type="time" 
                    name="quantidadeHoras" 
                    value={formData.quantidadeHoras} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted">Data do Fato Gerador</label>
                  <input 
                    type="date" 
                    name="dataFato" 
                    value={formData.dataFato} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: JUSTIFICATIVA E PARECER DA CHEFIA */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground border-b border-card-border pb-2">2. Fundamentação e Avaliação Gerencial</h2>
              
              <div className="bg-card rounded-lg p-4 border border-card-border space-y-2.5 text-sm text-foreground/90 transition-colors">
                <p><strong className="text-muted">Beneficiário:</strong> {funcionarioSelecionado || <span className="text-rose-500 italic">Nenhum selecionado</span>}</p>
                <p>
                  <strong className="text-muted">Ajuste Proposto:</strong>{' '}
                  <span className={`font-bold ${formData.tipoOperacao === 'credito' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formData.tipoOperacao === 'credito' ? `+${formData.quantidadeHoras}` : `-${formData.quantidadeHoras}`} horas
                  </span>
                </p>
                <p><strong className="text-muted">Data de Referência:</strong> {formData.dataFato ? new Date(formData.dataFato).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : <span className="text-rose-500 italic">Não informada</span>}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted">Enquadramento Legal (Portaria DIREF)</label>
                <select 
                  name="fundamentacaoLegal" 
                  value={formData.fundamentacaoLegal} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="sobrejornada">Convocação Extraordinária por Necessidade do Serviço</option>
                  <option value="compensacao">Compensação de Horas Autorizada Prévias</option>
                  <option value="missao">Representação Institucional ou Missão Externa</option>
                  <option value="erro-sistema">Ajuste Técnico por Falha Logística do Dispositivo Relógio</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted">Parecer Descritivo do Gestor</label>
                <textarea 
                  name="parecerDescritivo" 
                  value={formData.parecerDescritivo} 
                  onChange={handleInputChange}
                  rows={3} 
                  placeholder="Justifique o motivo do lançamento manual para fins de auditoria interna..." 
                  className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted/60"
                />
              </div>

              {/* Termo de Responsabilidade e Controle Interno */}
              <div className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <input 
                  type="checkbox" 
                  id="autorizoDiref"
                  name="autorizoDiref"
                  checked={formData.autorizoDiref}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-card-border text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="autorizoDiref" className="text-xs text-muted leading-relaxed cursor-pointer select-none">
                  Confirmo que este lançamento manual foi validado por mim na qualidade de chefia imediata, assumindo a corresponsabilidade pela alteração do banco de horas deste servidor em estrita conformidade com os regulamentos da portaria DIREF.
                </label>
              </div>
            </div>
          )}

          {/* ETAPA 3: EFETIVAÇÃO DO PROTOCOLO */}
          {currentStep === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border-4 border-emerald-500/20 mb-1">
                <Save className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Lançamento Efetivado no Sistema</h2>
              <p className="text-sm text-muted max-w-md mx-auto">
                O saldo foi atualizado no espelho de ponto do servidor sob o número de auditoria digital <strong className="text-foreground">#AUD-{Math.floor(100000 + Math.random() * 900000)}</strong>.
              </p>
              <div className="text-xs text-muted bg-background border border-card-border rounded-lg p-3 max-w-md mx-auto">
                Uma cópia desta ação de ajuste foi enviada automaticamente ao histórico do servidor e registrada no painel de relatórios consolidados de recursos humanos da DIREF.
              </div>
            </div>
          )}

        </div>

        {/* BOTÕES DE NAVEGAÇÃO */}
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
              disabled={
                (currentStep === 1 && (!formData.servidorId || !formData.quantidadeHoras || !formData.dataFato)) ||
                (currentStep === 2 && (!formData.autorizoDiref || !formData.parecerDescritivo))
              } // Bloqueia avanços caso campos cruciais fiquem em branco ou termo não seja aceito
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:opacity-90 rounded-xl shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {currentStep === etapas.length - 1 ? 'Homologar Saldo' : 'Avançar'} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setFormData({ servidorId: '', tipoOperacao: 'credito', quantidadeHoras: '', dataFato: '', fundamentacaoLegal: 'sobrejornada', parecerDescritivo: '', autorizoDiref: false });
                setCurrentStep(1);
              }}
              className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all cursor-pointer"
            >
              Novo Lançamento Gerencial
            </button>
          )}
        </div>

      </div>
    </main>
  );
}