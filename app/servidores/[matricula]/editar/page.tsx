'use client';

import { useState, useEffect, use } from 'react';
import { 
  FiSave, 
  FiX, 
  FiUser, 
  FiBriefcase, 
  FiShield, 
  FiCheckCircle,
  FiCornerDownRight
} from 'react-icons/fi';
import Link from 'next/link';

// Definição dos Perfis operacionais da Portaria 135/2025
const PERFIS_DISPONIVEIS = [
  { id: 'SERVIDOR', label: 'Servidor Regular' },
  { id: 'CHEFIA_IMEDIATA', label: 'Chefia Imediata (Diretores de Núcleo/Secretaria)' },
  { id: 'DIRETOR_SECRETARIA', label: 'Diretor de Secretaria' },
  { id: 'DIRETOR_NUCLEO', label: 'Diretor de Núcleo' },
  { id: 'DIRETOR_DO_FORO', label: 'Diretor do Foro (DIREF)' },
  { id: 'ADMINISTRADOR_SECAP', label: 'Administrador SECAP (Recursos Humanos)' },
  { id: 'NUTEC_ADMIN', label: 'Suporte Técnico NUTEC' },
];

// Mock da hierarquia recursiva de Lotações da JFAM
const LOTACOES_SISTEMA = [
  { id: 'diref', nome: 'Diretoria do Foro (DIREF)', sigla: 'DIREF', isChild: false },
  { id: 'secap', nome: 'Seção de Cadastro de Pessoal', sigla: 'SECAP', isChild: true },
  { id: 'v01', nome: '1ª Vara Federal - Gabinete', sigla: '01VF-GAB', isChild: false },
  { id: 'v01-sec', nome: '1ª Vara Federal - Secretaria', sigla: '01VF-SEC', isChild: true },
  { id: 'ssj-tab', nome: 'Subseção Judiciária de Tabatinga', sigla: 'SSJTB', isChild: false },
  { id: 'uaa-tefe', nome: 'Unidade Avançada de Atendimento de Tefé', sigla: 'UAA-TEFE', isChild: false },
];

interface EditarServidorPageProps {
  params: Promise<{ matricula: string }>;
}

export default function EditarServidorPage({ params }: EditarServidorPageProps) {
  // Desembrulha os parâmetros de rota de forma segura no Next.js
  const resolvedParams = use(params);
  const matriculaUrl = resolvedParams.matricula;

  // Estados dos campos do formulário corporativo
  const [nome, setNome] = useState('Mariana Costa Ferreira');
  const [email, setEmail] = useState('mariana.ferreira@trf1.jus.br');
  const [lotacaoId, setLotacaoId] = useState('v01-sec');
  const [tipoJornada, setTipoJornada] = useState('SET_HORAS_ININTERRUPTAS');
  const [isTeletrabalho, setIsTeletrabalho] = useState(true);
  const [isOficialJustica, setIsOficialJustica] = useState(false);
  const [perfisSelecionados, setPerfisSelecionados] = useState<string[]>([
    'SERVIDOR',
    'CHEFIA_IMEDIATA',
    'DIRETOR_SECRETARIA',
  ]);

  // Alerta de sucesso temporário
  const [showSuccess, setShowSuccess] = useState(false);

  // Regra de Negócio Cruzada (Art. 6, §4º): Se virar Oficial de Justiça, força presencial externa
  useEffect(() => {
    if (isOficialJustica) {
      setIsTeletrabalho(false);
    }
  }, [isOficialJustica]);

  // Manipulador do acúmulo de múltiplos perfis simultâneos
  const handlePerfilToggle = (perfilId: string) => {
    setPerfisSelecionados((prev) =>
      prev.includes(perfilId)
        ? prev.filter((p) => p !== perfilId) // Remove se já existir
        : [...prev, perfilId] // Adiciona se não existir
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Objeto consolidado pronto para ser persistido pelo Prisma ORM
    const dadosAtualizados = {
      matricula: matriculaUrl,
      nome,
      email,
      lotacaoId,
      tipoJornada,
      isTeletrabalho,
      isOficialJustica,
      perfis: perfisSelecionados,
    };

    console.log('Salvando via Prisma Client:', dadosAtualizados);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 transition-colors duration-300">
      
      {/* CABEÇALHO DO FORMULÁRIO */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Alterar Cadastro de Servidor
          </h1>
          <p className="text-sm text-muted">
            Configuração de regimes jurídicos, jornadas e permissões de segurança da sub-rede JFAM.
          </p>
        </div>
        
        <Link
          href="/servidores"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-card border border-card-border text-foreground text-sm font-medium rounded-lg hover:bg-background transition-colors shadow-2xs"
        >
          <FiX className="w-4 h-4" />
          Cancelar
        </Link>
      </div>

      {/* BANNER NOTIFICADOR DE SUCESSO */}
      {showSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 shadow-2xs animate-fade-in">
          <FiCheckCircle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold">Alterações salvas!</span> O espelho de ponto de <span className="font-semibold">{nome}</span> foi reconfigurado com sucesso no banco corporativo.
          </div>
        </div>
      )}

      {/* BLOCO FORMULÁRIO PRINCIPAL */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SEÇÃO 1: DADOS IDENTIFICADORES */}
        <div className="p-6 bg-card border border-card-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-card-border">
            <FiUser className="text-primary w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Dados de Identificação</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Matrícula Funcional (SJAM)</label>
              <input
                type="text"
                value={matriculaUrl}
                disabled
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-muted font-mono font-semibold cursor-not-allowed opacity-70"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted mb-1.5 uppercase">E-mail Institucional</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* SEÇÃO 2: LOTAÇÃO E REGIME DE JORNADA */}
        <div className="p-6 bg-card border border-card-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-card-border">
            <FiBriefcase className="text-primary w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Lotação e Carga Horária</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SELETOR DE LOTAÇÃO COM INDICAÇÃO DE DEPARTAMENTO FILHO */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Unidade de Lotação (Art. 4º)</label>
              <select
                value={lotacaoId}
                onChange={(e) => setLotacaoId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {LOTACOES_SISTEMA.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.isChild ? `↳  ${lot.nome}` : lot.nome} ({lot.sigla})
                  </option>
                ))}
              </select>
            </div>

            {/* SELETOR DE JORNADA BASE DA PORTARIA */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Regime de Jornada Diária (Art. 4º)</label>
              <select
                value={tipoJornada}
                onChange={(e) => setTipoJornada(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="SET_HORAS_ININTERRUPTAS">7 Horas Ininterruptas (Padrão Ordinário)</option>
                <option value="OITO_HORAS_DOIS_TURNOS">8 Horas em Dois Turnos (Com Almoço)</option>
                <option value="ESPECIAL_LEGISLACAO">Jornada Especial por Legislação Fina</option>
              </select>
            </div>
          </div>

          {/* CHECKBOXES SEMÂNTICOS DE EXCEÇÕES DE REGIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* CHECKBOX: TELETRABALHO (Art. 6º, §6º) */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
              isTeletrabalho 
                ? 'bg-primary/5 border-primary text-foreground' 
                : 'bg-background border-card-border text-muted hover:border-primary/40'
            }`}>
              <input
                type="checkbox"
                checked={isTeletrabalho}
                disabled={isOficialJustica}
                onChange={(e) => setIsTeletrabalho(e.target.checked)}
                className="mt-0.5 rounded text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
              />
              <div>
                <span className="block text-sm font-bold text-foreground">Regime de Teletrabalho (Art. 6º, §6º)</span>
                <span className="block text-xs text-muted mt-0.5">Avaliação de frequência vinculada às metas estabelecidas no plano de trabalho da unidade.</span>
              </div>
            </label>

            {/* CHECKBOX: OFICIAL DE JUSTIÇA (Art. 6º, §4º, I) */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
              isOficialJustica 
                ? 'bg-amber-500/5 border-amber-500/40 text-foreground' 
                : 'bg-background border-card-border text-muted hover:border-primary/40'
            }`}>
              <input
                type="checkbox"
                checked={isOficialJustica}
                onChange={(e) => setIsOficialJustica(e.target.checked)}
                className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="block text-sm font-bold text-foreground">Oficial de Justiça Avaliador Federal</span>
                <span className="block text-xs text-muted mt-0.5">Dispensa regulamentar do ponto eletrônico biométrico devido ao cumprimento exclusivo de mandados externos.</span>
              </div>
            </label>

          </div>
        </div>

        {/* SEÇÃO 3: GOVERNANÇA DE PERFIS ACUMULADOS */}
        <div className="p-6 bg-card border border-card-border rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-card-border">
            <FiShield className="text-primary w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Perfis e Atribuições Funcionais (Múltiplos)</h2>
          </div>
          
          <p className="text-xs text-muted">
            Marque os papéis que o servidor desempenha cumulativamente na seção judiciária. Usuários com papéis de chefia ganham acesso automático ao espelho de ponto de seus subordinados[cite: 181].
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PERFIS_DISPONIVEIS.map((perfil) => {
              const isChecked = perfisSelecionados.includes(perfil.id);
              return (
                <div
                  key={perfil.id}
                  onClick={() => handlePerfilToggle(perfil.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-semibold select-none transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-background border-primary text-primary shadow-2xs'
                      : 'bg-background/40 border-card-border text-foreground hover:bg-background'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-primary border-primary text-white' : 'border-card-border bg-card'
                  }`}>
                    {isChecked && <div className="w-1.5 h-1.5 rounded-xs bg-white" />}
                  </div>
                  <span className="tracking-tight">{perfil.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BARRA DE AÇÕES INFERIOR */}
        <div className="flex items-center justify-end gap-3 p-4 bg-card border border-card-border rounded-xl shadow-2xs">
          <Link
            href="/servidores"
            className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Voltar para a Lista
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>

      </form>
    </div>
  );
}