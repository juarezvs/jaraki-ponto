'use client';

import { useState } from 'react';
import Stepper from '../components/Stepper'; 
import { StepItem, StepperStyles } from '../types/stepper';

export default function FormularioGuiadoPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Estado para guardar os dados que o usuário preenche no formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    servico: 'suporte',
    observacoes: '',
  });

  // 1. Definição das etapas com seus respectivos ícones
  const etapas: StepItem[] = [
    {
      label: 'Solicitação',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
    },
    {
      label: 'Confirmação',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
    {
      label: 'Comprovante',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      ),
    },
  ];

  // 2. Vincula as linhas do Stepper para usarem as mesmas variáveis globais da página servidor
  const estilosDoStepper: StepperStyles = {
    activeColor: 'var(--color-primary, #4f46e5)',        // Usa o roxo/azul padrão do seu sistema
    inactiveColor: 'var(--color-card-border, #e5e7eb)',  // Usa a cor das bordas dos seus cards
    activeLineWidth: '5px',       
    inactiveLineWidth: '2px',     
  };

  const avancarEtapa = () => setCurrentStep((prev) => Math.min(prev + 1, etapas.length));
  const voltarEtapa = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 antialiased transition-colors duration-300">
      <div className="w-full max-w-2xl bg-card rounded-xl shadow-sm border border-card-border p-6 sm:p-10 transition-colors duration-300">
        
        {/* Cabeçalho igualado com a tipografia e tokens da página do servidor */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Abertura de Chamado</h1>
          <p className="text-sm text-muted mt-1">Siga os passos abaixo para registrar sua solicitação</p>
        </div>

        {/* Instanciando o Stepper ajustado */}
        <Stepper steps={etapas} currentStep={currentStep} styles={estilosDoStepper} />

        {/* CONTAINER DO CONTEÚDO DINÂMICO (Adotado o padrão muted-light ou background secundário do seu tema) */}
        <div className="mt-8 bg-background/60 rounded-xl border border-card-border p-6 min-h-75 flex flex-col justify-between transition-colors duration-300">
          
          {/* ETAPA 1: SOLICITAÇÃO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-card-border pb-2">1. Dados da Solicitação</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted">Seu Nome</label>
                  <input 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo" 
                    className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors placeholder-muted/60"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted">Seu E-mail</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="nome@empresa.com" 
                    className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors placeholder-muted/60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted">Tipo de Serviço</label>
                <select 
                  name="servico" 
                  value={formData.servico} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="suporte">Suporte Técnico</option>
                  <option value="financeiro">Departamento Financeiro</option>
                  <option value="comercial">Setor Comercial</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted">Descreva o problema ou pedido</label>
                <textarea 
                  name="observacoes" 
                  value={formData.observacoes} 
                  onChange={handleInputChange}
                  rows={3} 
                  placeholder="Escreva aqui os detalhes..." 
                  className="w-full px-3 py-2 bg-card border border-card-border text-foreground rounded-lg text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted/60"
                />
              </div>
            </div>
          )}

          {/* ETAPA 2: CONFIRMAÇÃO */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-card-border pb-2">2. Revise seus Dados</h2>
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                ⚠️ Por favor, confirme as informações abaixo antes de gerar o comprovante definitivo.
              </p>

              <div className="bg-card rounded-lg p-4 border border-card-border space-y-3 text-sm text-foreground/90 transition-colors">
                <p><strong className="text-muted">Nome completo:</strong> {formData.nome || <span className="text-rose-500 italic">Não preenchido</span>}</p>
                <p><strong className="text-muted">E-mail de contato:</strong> {formData.email || <span className="text-rose-500 italic">Não preenchido</span>}</p>
                <p className="capitalize"><strong className="text-muted">Setor de destino:</strong> {formData.servico}</p>
                <p className="bg-background border border-card-border p-2 rounded text-muted text-xs italic break-words">
                  &quot;{formData.observacoes || 'Nenhuma observação informada.'}&quot;
                </p>
              </div>
            </div>
          )}

          {/* ETAPA 3: COMPROVANTE */}
          {currentStep === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 border-4 border-green-500/20 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">Solicitação Enviada com Sucesso!</h2>
              <p className="text-sm text-muted max-w-md mx-auto">
                Seu comprovante de registro foi gerado sob o protocolo <strong className="text-foreground">#REQ-{Math.floor(100000 + Math.random() * 900000)}</strong>.
              </p>

              <div className="pt-4">
                <button 
                  onClick={() => alert('Disparando download do arquivo PDF...')}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Baixar Comprovante (PDF)
                </button>
              </div>
            </div>
          )}

        </div>

        {/* BOTÕES DE NAVEGAÇÃO DE CONTEXTO */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={voltarEtapa}
            disabled={currentStep === 1 || currentStep === etapas.length}
            className="px-5 py-2.5 text-sm font-medium border border-card-border text-foreground bg-card hover:bg-background/80 rounded-xl shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            Anterior
          </button>

          {currentStep < etapas.length ? (
            <button
              type="button"
              onClick={avancarEtapa}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:opacity-90 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {currentStep === etapas.length - 1 ? 'Concluir e Enviar' : 'Próximo Passo'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setFormData({ nome: '', email: '', servico: 'suporte', observacoes: '' });
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all cursor-pointer"
            >
              Criar Nova Solicitação
            </button>
          )}
        </div>

      </div>
    </main>
  );
}