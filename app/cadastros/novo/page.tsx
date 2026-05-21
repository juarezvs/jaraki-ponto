'use client';

import { useState, useEffect } from 'react';
import { 
  FiSave, 
  FiX, 
  FiGrid, 
  FiClock, 
  FiCalendar, 
  FiCheckCircle, 
  FiInfo, 
  FiArrowLeft,
  FiCornerDownRight
} from 'react-icons/fi';
import Link from 'next/link';

// Tipagem para controle do formulário dinâmico
type TipoCadastro = 'LOTACAO' | 'JORNADA' | 'FERIADO';

export default function NovoCadastroPage() {
  const [tipo, setTipo] = useState<TipoCadastro>('LOTACAO');
  const [showSuccess, setShowSuccess] = useState(false);

  // --- ESTADOS DO FORMULÁRIO: LOTAÇÃO (Art. 4º) ---
  const [lotNome, setLotNome] = useState('');
  const [lotSigla, setLotSigla] = useState('');
  const [lotUnidade, setLotUnidade] = useState('SEDE_MANAUS');
  const [lotParentId, setLotParentId] = useState('');

  // Mock de lotações existentes para herança recursiva (Pai/Filho)
  const lotacoesPaisMock = [
    { id: 'diref-id', nome: 'Diretoria do Foro', sigla: 'DIREF' },
    { id: 'v01-id', nome: '1ª Vara Federal - Gabinete', sigla: '01VF-GAB' },
    { id: 'v02-id', nome: '2ª Vara Federal - Gabinete', sigla: '02VF-GAB' },
  ];

  // --- ESTADOS DO FORMULÁRIO: JORNADA (Art. 4º e 18) ---
  const [jorNome, setJorNome] = useState('');
  const [jorTipo, setJorTipo] = useState('SET_HORAS_ININTERRUPTAS');
  const [jorEntrada, setJorEntrada] = useState('08:00');
  const [jorSaida, setJorSaida] = useState('15:00');
  const [jorIntervalo, setJorIntervalo] = useState(0);

  // --- ESTADOS DO FORMULÁRIO: FERIADO/EXCEÇÃO (Art. 2º, VI) ---
  const [ferData, setFerData] = useState('');
  const [ferDescricao, setFerDescricao] = useState('');
  const [ferTipo, setFerTipo] = useState('FERIADO');
  const [ferMultiplicador, setFerMultiplicador] = useState('100%');

  // Regra de Negócio: Ajuste automático de saídas/intervalos conforme o tipo de jornada
  useEffect(() => {
    if (jorTipo === 'SET_HORAS_ININTERRUPTAS') {
      setJorIntervalo(0);
      // Ajusta saída sugerida automática baseado em 7h corridas
      const [horas, minutos] = jorEntrada.split(':').map(Number);
      const novaHoraStr = String((horas + 7) % 24).padStart(2, '0');
      setJorSaida(`${novaHoraStr}:${String(minutos).padStart(2, '0')}`);
    } else if (jorTipo === 'OITO_HORAS_DOIS_TURNOS') {
      if (jorIntervalo === 0) setJorIntervalo(60); // Padrão mínimo de 1h de almoço
      const [horas, minutos] = jorEntrada.split(':').map(Number);
      // 8h de trabalho + 1h de almoço base
      const totalAcrescimo = 8 + (jorIntervalo / 60);
      const novaHoraStr = String((horas + Math.floor(totalAcrescimo)) % 24).padStart(2, '0');
      setJorSaida(`${novaHoraStr}:${String(minutos).padStart(2, '0')}`);
    }
  }, [jorTipo, jorEntrada, jorIntervalo]);

  // Regra de Negócio: Vínculo automático de multiplicador conforme a classificação da data
  useEffect(() => {
    if (ferTipo === 'FERIADO') {
      setFerMultiplicador('100%'); // Fator em dobro por regulamento da DIREF
    } else if (ferTipo === 'PONTO_FACULTATIVO') {
      setFerMultiplicador('50%');
    } else {
      setFerMultiplicador('REGULAR');
    }
  }, [ferTipo]);

  const resetFormularios = () => {
    setLotNome(''); setLotSigla(''); setLotUnidade('SEDE_MANAUS'); setLotParentId('');
    setJorNome(''); setJorTipo('SET_HORAS_ININTERRUPTAS'); setJorEntrada('08:00'); setJorSaida('15:00'); setJorIntervalo(0);
    setFerData(''); setFerDescricao(''); setFerTipo('FERIADO'); setFerMultiplicador('100%');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let dadosPayload = {};

    if (tipo === 'LOTACAO') {
      dadosPayload = { tipo, nome: lotNome, sigla: lotSigla, unidade: lotUnidade, parentId: lotParentId || null };
    } else if (tipo === 'JORNADA') {
      dadosPayload = { tipo, nome: jorNome, tipoRegulamentar: jorTipo, horaEntrada: jorEntrada, horaSaida: jorSaida, intervaloMinutos: jorIntervalo };
    } else {
      dadosPayload = { tipo, data: ferData, descricao: ferDescricao, classificacao: ferTipo, multiplicador: ferMultiplicador };
    }

    console.log('Gravando via Prisma Client:', dadosPayload);
    setShowSuccess(true);
    resetFormularios();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 transition-colors duration-300">
      
      {/* BARRA DE NAVEGAÇÃO E RETORNO */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/cadastros" 
            className="p-2 bg-card border border-card-border text-foreground hover:bg-background rounded-lg transition-colors"
            aria-label="Voltar aos parâmetros"
          >
            <FiArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Novo Registro Paramétrico</h1>
            <p className="text-sm text-muted">Inserção de metadados organizacionais estruturados para auditoria da DIREF.</p>
          </div>
        </div>
      </div>

      {/* BANNER INFORMATIVO DE SUCESSO COGNITIVO */}
      {showSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 shadow-2xs animate-fade-in">
          <FiCheckCircle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold">Cadastro realizado!</span> O registro foi indexado com sucesso e as novas diretrizes fiscais já estão ativas para o espelho de ponto.
          </div>
        </div>
      )}

      {/* CHAVEADOR CAPSULE DO TIPO DE CADASTRO (ORBUND TABS STYLING) */}
      <div className="p-1 bg-card border border-card-border rounded-xl shadow-2xs grid grid-cols-3 gap-1 select-none">
        <button
          type="button"
          onClick={() => { setTipo('LOTACAO'); setShowSuccess(false); }}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            tipo === 'LOTACAO' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground hover:bg-background/50'
          }`}
        >
          <FiGrid className="w-4 h-4" />
          Lotação
        </button>
        <button
          type="button"
          onClick={() => { setTipo('JORNADA'); setShowSuccess(false); }}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            tipo === 'JORNADA' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground hover:bg-background/50'
          }`}
        >
          <FiClock className="w-4 h-4" />
          Jornada
        </button>
        <button
          type="button"
          onClick={() => { setTipo('FERIADO'); setShowSuccess(false); }}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            tipo === 'FERIADO' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground hover:bg-background/50'
          }`}
        >
          <FiCalendar className="w-4 h-4" />
          Exceção/Feriado
        </button>
      </div>

      {/* FORMULÁRIO DO BLOCO DE CONTEXTO */}
      <form onSubmit={handleSubmit} className="bg-card border border-card-border rounded-xl shadow-xs overflow-hidden">
        <div className="p-6 space-y-6">

          {/* FORM CONTEXT 1: NOVO REGISTRO DE LOTAÇÃO (ART. 4º) */}
          {tipo === 'LOTACAO' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Nome Completo do Setor / Unidade</label>
                  <input
                    type="text"
                    value={lotNome}
                    onChange={(e) => setLotNome(e.target.value)}
                    placeholder="Ex: Secretaria Judiciária da 5ª Vara"
                    required
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Sigla Corporativa</label>
                  <input
                    type="text"
                    value={lotSigla}
                    onChange={(e) => setLotSigla(e.target.value)}
                    placeholder="Ex: 05VF-SEC"
                    required
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/60 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Seção Judiciária / Subunidade Física</label>
                  <select
                    value={lotUnidade}
                    onChange={(e) => setLotUnidade(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="SEDE_MANAUS">Sede Manaus</option>
                    <option value="SUBSECAO_TABATINGA">Subseção Judiciária de Tabatinga</option>
                    <option value="UAA_TEFE">Unidade Avançada de Tefé (UAA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Lotação Superior (Hierarquia Opcional)</label>
                  <select
                    value={lotParentId}
                    onChange={(e) => setLotParentId(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">Nenhuma (Definir como Setor Raiz)</option>
                    {lotacoesPaisMock.map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        ↳ {lot.nome} ({lot.sigla})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* FORM CONTEXT 2: NOVO REGISTRO DE JORNADA REGULAMENTADA */}
          {tipo === 'JORNADA' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Nome Identificador do Turno</label>
                <input
                  type="text"
                  value={jorNome}
                  onChange={(e) => setJorNome(e.target.value)}
                  placeholder="Ex: Turno Vespertino - Agentes de Polícia Judicial"
                  required
                  className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/60"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Regime de Enquadramento (Art. 4º)</label>
                  <select
                    value={jorTipo}
                    onChange={(e) => setJorTipo(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="SET_HORAS_ININTERRUPTAS">7 Horas Ininterruptas (Sem Almoço)</option>
                    <option value="OITO_HORAS_DOIS_TURNOS">8 Horas Fracionadas (Com Almoço)</option>
                    <option value="ESPECIAL_LEGISLACAO">Grade Especial / Regime por Legislação Fina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Intervalo de Refeição (Minutos Inteiros)</label>
                  <input
                    type="number"
                    value={jorIntervalo}
                    onChange={(e) => setJorIntervalo(Number(e.target.value))}
                    disabled={jorTipo === 'SET_HORAS_ININTERRUPTAS'}
                    min={0}
                    max={180}
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Horário de Entrada Base</label>
                  <input
                    type="time"
                    value={jorEntrada}
                    onChange={(e) => setJorEntrada(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Horário de Saída Regulamentar (Sugerido)</label>
                  <input
                    type="time"
                    value={jorSaida}
                    onChange={(e) => setJorSaida(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM CONTEXT 3: NOVO REGISTRO DE FERIADO / EXCEÇÃO DE CRÉDITO */}
          {tipo === 'FERIADO' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Data Calendário</label>
                  <input
                    type="date"
                    value={ferData}
                    onChange={(e) => setFerData(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Nome Evento / Descrição do Decreto</label>
                  <input
                    type="text"
                    value={ferDescricao}
                    onChange={(e) => setFerDescricao(e.target.value)}
                    placeholder="Ex: Feriado Estadual - Elevação do Amazonas à Categoria de Província"
                    required
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Classificação Administrativa</label>
                  <select
                    value={ferTipo}
                    onChange={(e) => setFerTipo(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="FERIADO">Feriado Oficial (Nacional/Estadual/Municipal)</option>
                    <option value="PONTO_FACULTATIVO">Ponto Facultativo Decretado pela Administração</option>
                    <option value="RECESSO">Recesso Judiciário Institucional (Art. 15)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase">Gatilho de Multiplicação (Art. 2º, VI)</label>
                  <input
                    type="text"
                    value={ferMultiplicador === 'REGULAR' ? 'Fator Nominal Regular' : `Incorporate Adicional (+${ferMultiplicador})`}
                    disabled
                    className="w-full px-3 py-2 bg-background/50 border border-card-border rounded-lg text-sm text-primary font-bold cursor-not-allowed font-mono opacity-80"
                  />
                </div>
              </div>

              {/* CARD DE ADVERTÊNCIA TÉCNICA */}
              <div className="p-3.5 bg-background border border-card-border rounded-xl flex items-start gap-2.5 text-muted">
                <FiInfo className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-xs leading-relaxed">
                  As batidas computadas nesta data serão avaliadas pelo processador assíncrono do banco de horas com base nesta regra. Feriados e Recessos geram acúmulos com ganho em dobro (100% de crédito temporal).
                </span>
              </div>
            </div>
          )}

        </div>

        {/* BARRA DE AÇÕES INFERIOR DO FORMULÁRIO */}
        <div className="p-4 bg-background/40 border-t border-card-border flex items-center justify-end gap-3">
          <Link
            href="/cadastros"
            className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Voltar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            Salvar Registro
          </button>
        </div>
      </form>

    </div>
  );
}