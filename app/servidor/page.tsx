'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { PDFExportButton } from '../components/pdf-export-button';

// 1. Defina a interface dos dados dessa página
interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'Ativo' | 'Afastado';
}

export default function ListaFuncionariosPage() {
  // 2. Seus dados (podem vir de uma API, Prisma, Postgres, etc.)
  const funcionarios: Funcionario[] = [
    { id: 'AM200401', nome: 'Juarez de Vasconcelos da Silva', cargo: 'Arquiteto de TI', departamento: 'Tecnologia', dataAdmissao: '12/04/2020', status: 'Ativo' },
    { id: 'AM200401', nome: 'Adriana Cristo de Castro', cargo: 'Coordenadora Acadêmica', departamento: 'Pedagógico', dataAdmissao: '19/05/2022', status: 'Ativo' },
    { id: 'AM200401', nome: 'Carlos Eduardo Souza', cargo: 'Desenvolvedor Full Stack', departamento: 'Tecnologia', dataAdmissao: '03/01/2025', status: 'Ativo' },
  ];

  // 3. Mapeie as colunas especificamente para o formato do PDF corporativo
  const colunasParaOPdf = [
    { header: 'ID', accessor: 'id' as const, align: 'center' as const },
    { header: 'Nome Completo', accessor: 'nome' as const },
    { header: 'Cargo / Função', accessor: 'cargo' as const },
    { header: 'Departamento', accessor: 'departamento' as const },
    { header: 'Admissão', accessor: 'dataAdmissao' as const, align: 'center' as const },
    { 
      header: 'Situação', 
      // Usando uma função no accessor para customizar a string se necessário
      accessor: (f: Funcionario) => f.status.toUpperCase() 
    },
  ];

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Quadro Geral de Funcionários
          </h2>
          <p className="text-muted text-sm">Gerenciamento e emissão de relatórios de recursos humanos.</p>
        </div>

        {/* 4. REUTILIZE O MESMO BOTÃO! Modificando apenas as propriedades de entrada */}
        <PDFExportButton 
          title="Relatório Gerencial - Quadro Geral de Funcionários"
          filename="quadro-funcionarios-orbund"
          columns={colunasParaOPdf}
          data={funcionarios}
          buttonText="Exportar Lista (PDF)"
          orientation='landscape'
        />
      </div>

        <div className="bg-card rounded-xl border border-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-card-border text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="py-3 px-4">Matrícula</th>
                <th className="py-3 px-3 ">Nome</th>
                <th className="py-3 px-3 ">Cargo</th>
                <th className="py-3 px-3 ">Lotação</th>
                <th className="py-3 px-3 ">Admissão</th>
                <th className="py-3 px-3 ">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm">
              {funcionarios.map((reg, index) => (
                <tr key={index} className="hover:bg-muted-light/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-foreground/80">
                    <div>{reg.id}</div>
                    {/* <div className="text-[11px] text-muted font-normal">{reg.id}</div> */}
                  </td>
                  <td className="py-3.5 px-3  font-mono text-xs text-foreground/80">{reg.nome}</td>
                  <td className="py-3.5 px-3  font-mono text-xs text-foreground/80">{reg.cargo}</td>
                  <td className="py-3.5 px-3  font-mono text-xs text-foreground/80">{reg.departamento}</td>
                  <td className="py-3.5 px-3  font-mono text-xs text-foreground/80">{reg.dataAdmissao}</td>
                  <td className="py-3.5 px-3  font-semibold text-foreground">{reg.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}