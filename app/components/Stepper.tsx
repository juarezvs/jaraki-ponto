'use client';

import React from 'react';
import { StepperProps } from '../types/stepper';

export default function Stepper({ 
  steps, 
  currentStep,
  styles 
}: StepperProps) {
  
  // Valores padrão ajustados para herdar variáveis ou cores seguras em dark mode
  const config = {
  activeColor: styles?.activeColor || 'var(--color-stepper-active)', 
  inactiveColor: styles?.inactiveColor || 'var(--color-stepper-border)', 
  activeLineWidth: styles?.activeLineWidth || '5px',     
  inactiveLineWidth: styles?.inactiveLineWidth || '2px', 
};

  const calculateProgress = () => {
    if (steps.length <= 1) return 0;
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="relative flex w-full items-center justify-between mx-auto my-10 select-none">
      
      {/* CONTAINER DAS LINHAS */}
      <div 
        className="absolute z-0 rounded transition-all duration-500 ease-in-out bg-slate-200 dark:bg-zinc-700"
        style={{ 
          left: `calc(100% / ${steps.length} / 2)`,
          right: `calc(100% / ${steps.length} / 2)`,
          height: config.inactiveLineWidth,
          backgroundColor: styles?.inactiveColor, // Usa customizado se houver, se não, herda a classe acima
          top: `calc(24px - (${config.inactiveLineWidth} / 2))` 
        }}
      >
        {/* LINHA ATIVA */}
        <div 
          className="absolute left-0 rounded transition-all duration-500 ease-in-out"
          style={{ 
            width: `${calculateProgress()}%`,
            height: config.activeLineWidth,
            backgroundColor: config.activeColor,
            top: `calc(50% - (${config.activeLineWidth} / 2))`
          }}
        />
      </div>

      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompletedOrActive = currentStep >= stepNumber;

        return (
          <div key={index} className="flex flex-col items-center flex-1 text-center relative z-10">
            
            {/* Círculo do Ícone */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white dark:bg-zinc-800 transition-all duration-500 ease-in-out ${
                !isCompletedOrActive ? 'border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500' : ''
              }`}
              style={{
                borderColor: isCompletedOrActive ? config.activeColor : undefined,
                backgroundColor: isCompletedOrActive ? config.activeColor : undefined,
                color: isCompletedOrActive ? '#ffffff' : undefined,
                boxShadow: isCompletedOrActive ? `${config.activeColor}20 0px 10px 15px -3px` : 'none'
              }}
            >
              {step.icon}
            </div>
            
            {/* Texto da Etapa */}
            <span
              className={`mt-3 text-xs sm:text-sm transition-colors duration-500 max-w-30 px-1 line-clamp-2 ${
                isCompletedOrActive 
                  ? 'font-semibold text-slate-900 dark:text-zinc-100' 
                  : 'font-medium text-slate-400 dark:text-zinc-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}