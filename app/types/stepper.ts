import { ReactNode } from 'react';

export interface StepItem {
  label: string;
  icon: ReactNode;
}

export interface StepperStyles {
  activeColor?: string;       // Cor do ícone ativo (Ex: '#4f46e5' ou 'var(--indigo-600)')
  inactiveColor?: string;     // Cor do ícone inativo
  activeLineWidth?: string;   // Espessura da linha ativa (Ex: '4px', '6px')
  inactiveLineWidth?: string; // Espessura da linha inativa (Ex: '1px', '2px')
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  styles?: StepperStyles;
}