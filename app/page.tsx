import { FiLayers, FiFolder, FiUsers, FiCornerDownRight } from 'react-icons/fi';

export default function FaseUmFundacaoPage() {
  // Mock estruturado de Lotações Recursivas (Pai e Filho) - Art. 4 Portaria 135/2025
  const lotacoesMock = [
    { id: '1', nome: '1ª Vara Federal', sigla: '01VF', unidade: 'SEDE_MANAUS', parent: null },
    { id: '2', nome: 'Gabinete da 1ª Vara', sigla: 'GAB01', unidade: 'SEDE_MANAUS', parent: '1ª Vara Federal' },
    { id: '3', nome: 'Secretaria da 1ª Vara', sigla: 'SEC01', unidade: 'SEDE_MANAUS', parent: '1ª Vara Federal' },
    { id: '4', nome: 'Subseção Judiciária de Tabatinga', sigla: 'SSJTB', unidade: 'SUBSECAO_TABATINGA', parent: null },
  ];

  // Mock de Usuários com Múltiplos Perfis Simultâneos
  const servidoresMock = [
    { matricula: 'AM1024', nome: 'Dr. Érico Rodrigo Freitas Pinheiro', lotacao: 'Diretoria do Foro (DIREF)', perfis: ['SERVIDOR', 'DIRETOR_DO_FORO'], regime: 'Presencial' },
    { matricula: 'AM5432', nome: 'Mariana Costa Ferreira', lotacao: 'Secretaria da 1ª Vara', perfis: ['SERVIDOR', 'CHEFIA_IMEDIATA', 'DIRETOR_SECRETARIA'], regime: 'Teletrabalho' },
    { matricula: 'AM9876', nome: 'Carlos Augusto Amazonas', lotacao: 'Subseção Judiciária de Tabatinga', perfis: ['SERVIDOR'], regime: 'Presencial' },
  ];

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA VIEW */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Fase 1: Fundação Cadastral</h1>
        <p className="text-sm text-muted">
          Infraestrutura visual homologada e mapeamento de vínculos conforme Portaria SJAM-DIREF 135/2025.
        </p>
      </div>

      {/* CARDS DE HISTÓRICO CADASTRAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiLayers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Estruturas Ativas</p>
            <h3 className="text-xl font-bold text-foreground">3 Unidades JFAM</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiFolder className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Lotações Mapeadas</p>
            <h3 className="text-xl font-bold text-foreground">{lotacoesMock.length} Setores</h3>
          </div>
        </div>

        <div className="p-5 bg-card border border-card-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Servidores Vinculados</p>
            <h3 className="text-xl font-bold text-foreground">{servidoresMock.length} Ativos</h3>
          </div>
        </div>
      </div>

      {/* GRID DE INFORMAÇÕES CORPORATIVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* REQUISITO: HIERARQUIA DE LOTAÇÕES FILHAS */}
        <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-card-border bg-background/30">
            <h3 className="text-sm font-bold text-foreground">Mapeamento de Lotações (Pai/Filho)</h3>
          </div>
          <div className="p-4 space-y-3">
            {lotacoesMock.map((lot) => (
              <div key={lot.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border/40">
                <div className="flex items-center gap-2">
                  {lot.parent ? (
                    <FiCornerDownRight className="w-4 h-4 text-primary ml-2 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{lot.nome}</p>
                    <p className="text-xs text-muted">{lot.unidade.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary font-bold rounded">
                  {lot.sigla}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* REQUISITO: MÚLTIPLOS PERFIS SIMULTÂNEOS POR SERVIDOR */}
        <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-card-border bg-background/30">
            <h3 className="text-sm font-bold text-foreground">Servidores e Acúmulo de Perfis (Art. 4º)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/80 border-b border-card-border text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="p-3">Matrícula</th>
                  <th className="p-3">Servidor / Lotação</th>
                  <th className="p-3 text-right">Perfis Ativos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-xs text-foreground">
                {servidoresMock.map((srv) => (
                  <tr key={srv.matricula} className="hover:bg-background/40 transition-colors">
                    <td className="p-3 font-mono text-muted">{srv.matricula}</td>
                    <td className="p-3">
                      <p className="font-semibold text-foreground">{srv.nome}</p>
                      <p className="text-[11px] text-muted">{srv.lotacao} • <span className="text-primary font-medium">{srv.regime}</span></p>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {srv.perfis.map((perf) => (
                          <span key={perf} className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-primary text-white rounded">
                            {perf.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}