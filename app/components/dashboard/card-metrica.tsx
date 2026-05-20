import React from 'react';

interface CardMetricaProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  variant?: 'default' | 'alert' | 'success';
}

export function CardMetrica({ title, value, subtext, icon, variant = 'default' }: CardMetricaProps) {
  const badgeStyles = {
    default: 'text-primary bg-primary/10',
    alert: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
    success: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
  };

  return (
    <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{title}</span>
        <div className={`p-2 rounded-lg ${badgeStyles[variant]}`}>{icon}</div>
      </div>
      <div className="mt-2">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
        <p className="text-xs text-muted mt-1">{subtext}</p>
      </div>
    </div>
  );
}