const { useState, useMemo, useEffect } = React;

/* ---------- ícones (sem depender de lucide-react) ---------- */

function criarIconeSvg(pathJsx, viewBox = "0 0 24 24") {
  return function IconeSvg({ size = 20, color = "currentColor", strokeWidth = 2, className, style }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
      >
        {pathJsx}
      </svg>
    );
  };
}

const ChevronLeft = criarIconeSvg(<polyline points="15 18 9 12 15 6" />);
const ChevronRight = criarIconeSvg(<polyline points="9 18 15 12 9 6" />);
const ChevronDown = criarIconeSvg(<polyline points="6 9 12 15 18 9" />);
const Plus = criarIconeSvg(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
);
const X = criarIconeSvg(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
);
const Check = criarIconeSvg(<polyline points="20 6 9 17 4 12" />);
const Trash2 = criarIconeSvg(
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </>
);

function Heart({ size = 20, color = "currentColor", fill = "none", className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2} className={className} style={style}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function iconeEmoji(emoji) {
  return function IconeEmoji({ size = 20, className, style }) {
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.85, lineHeight: 1, display: "inline-block", ...style }}
      >
        {emoji}
      </span>
    );
  };
}

const CalendarHeart = iconeEmoji("📅");
const ListChecks = iconeEmoji("✅");
const StickyNote = iconeEmoji("🗒️");
const Sparkles = iconeEmoji("✨");
const Cloud = iconeEmoji("☁️");
const Flower2 = iconeEmoji("🌸");
const Clock = iconeEmoji("🕐");
const Sun = iconeEmoji("☀️");
const GraduationCap = iconeEmoji("🎓");
const Apple = iconeEmoji("🍎");
const Target = iconeEmoji("🎯");
const BookOpen = iconeEmoji("📖");
const Gem = iconeEmoji("💎");
const Mic = iconeEmoji("🎙️");
const Shirt = iconeEmoji("👗");
const Shuffle = iconeEmoji("🔀");

/* ---------- dados fixos ---------- */

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const CORES_NOTA = [
  { bg: "#FDE7EF", tape: "#F7C6DB", text: "#8A5570" },
  { bg: "#FFF3D9", tape: "#F9DFA0", text: "#8A6B36" },
  { bg: "#E1F4E8", tape: "#B8E4C9", text: "#3E7A58" },
  { bg: "#E3ECFB", tape: "#BBD3F5", text: "#4A5F8A" },
  { bg: "#F1E6FB", tape: "#D9C1F1", text: "#6B4C8A" },
];

const ROTINA_PADRAO = [
  { id: 1, hora: "06:30", texto: "Acordar e agradecer", emoji: "🌸", feito: false },
  { id: 2, hora: "07:00", texto: "Café da manhã", emoji: "☕", feito: false },
  { id: 3, hora: "08:00", texto: "Trabalho / Estudos", emoji: "📚", feito: false },
  { id: 4, hora: "12:00", texto: "Almoço", emoji: "🍽️", feito: false },
  { id: 5, hora: "14:00", texto: "Tarefas do dia", emoji: "✅", feito: false },
  { id: 6, hora: "18:00", texto: "Exercício", emoji: "🏋️‍♀️", feito: false },
  { id: 7, hora: "19:30", texto: "Jantar", emoji: "🍲", feito: false },
  { id: 8, hora: "21:00", texto: "Banho / skincare", emoji: "🧴", feito: false },
  { id: 9, hora: "22:00", texto: "Leitura (10 páginas)", emoji: "📖", feito: false },
  { id: 10, hora: "23:00", texto: "Dormir", emoji: "🌙", feito: false },
];

const CHECKLIST_CATEGORIAS = [
  {
    id: "vida",
    titulo: "Vida Prática",
    emoji: "🏠",
    cor: { bg: "#FFEFE7", accent: "#F0A97E" },
    itens: [
      "Fazer um arroz soltinho",
      "Fazer um feijão saboroso",
      "Preparar um macarrão",
      "Fazer um bolo simples",
      "Preparar uma salada completa",
      "Organizar o guarda-roupa",
      "Montar uma rotina de limpeza",
      "Organizar os documentos",
      "Planejar as compras do mês",
      "Cultivar uma planta",
    ],
  },
  {
    id: "beleza",
    titulo: "Beleza e Autocuidado",
    emoji: "💅",
    cor: { bg: "#FBEAF3", accent: "#E39ABF" },
    itens: [
      "Fazer a unha sozinha",
      "Fazer a sobrancelha",
      "Montar uma rotina de skincare",
      "Fazer hidratação no cabelo",
      "Aprender uma make básica",
      "Montar looks estilosos",
      "Testar penteados diferentes",
      "Fazer uma escova em casa",
      "Criar uma rotina de sono",
      "Beber mais água todo dia",
    ],
  },
  {
    id: "financas",
    titulo: "Finanças",
    emoji: "💰",
    cor: { bg: "#EAF6EE", accent: "#7EC79A" },
    itens: [
      "Criar um orçamento mensal",
      "Investir os primeiros R$100",
      "Entender juros e inflação",
      "Controlar gastos diários",
      "Criar uma reserva de emergência",
      "Ler o extrato bancário",
      "Usar cartão de crédito com consciência",
      "Planejar compras inteligentes",
      "Sair das dívidas",
      "Guardar um pouco todo mês",
    ],
  },
  {
    id: "carreira",
    titulo: "Carreira e Produtividade",
    emoji: "💼",
    cor: { bg: "#EAF0FB", accent: "#7FA3E0" },
    itens: [
      "Fazer um currículo profissional",
      "Criar um perfil no LinkedIn",
      "Aprender Excel do básico ao intermediário",
      "Criar apresentações profissionais",
      "Organizar agenda e compromissos",
      "Definir metas e planejar ações",
      "Administrar o tempo com método",
      "Falar em público",
      "Fazer networking",
      "Aprender a dizer não",
    ],
  },
  {
    id: "tech",
    titulo: "Tecnologia e Criação",
    emoji: "💻",
    cor: { bg: "#F3EEFB", accent: "#B98CD9" },
    itens: [
      "Aprender Canva",
      "Aprender edição de vídeos",
      "Tirar fotos melhores com o celular",
      "Criar conteúdos para redes sociais",
      "Aprender IA aplicada ao trabalho",
      "Usar Google Drive e Docs",
      "Criar formulários (Google Forms)",
      "Editar PDFs",
      "Criar artes digitais",
      "Automatizar tarefas simples",
    ],
  },
  {
    id: "pessoal",
    titulo: "Desenvolvimento Pessoal",
    emoji: "🌱",
    cor: { bg: "#FFF6E5", accent: "#E3B95E" },
    itens: [
      "Ler 12 livros no ano",
      "Escrever um diário",
      "Meditar",
      "Melhorar a comunicação",
      "Desenvolver mais disciplina",
      "Aprender inglês básico",
      "Praticar exercícios físicos",
      "Concluir um projeto pessoal",
      "Praticar gratidão",
      "Sair da zona de conforto",
    ],
  },
];

const PLANO_ALIMENTAR = {
  objetivo: "Perder gordura + ganhar massa magra",
  refeicoes: [
    { id: "cafe", hora: "07:30", nome: "Café da Manhã", emoji: "☀️", itens: ["2 ovos mexidos ou cozidos", "Fatia de mamão com aveia", "ou 1 fruta (banana ou maçã)"] },
    { id: "pre", hora: "11:30", nome: "Pré-treino", emoji: "🏋️", itens: ["Banana amassada com aveia"] },
    { id: "almoco", hora: "14:00", nome: "Almoço", emoji: "🍽️", itens: ["2 ovos ou frango", "Vegetais à vontade — muita salada! (brócolis, abobrinha, cenoura, alface, chuchu)", "3 colheres de arroz / 1 concha pequena de feijão"] },
    { id: "lanche", hora: "17:00", nome: "Lanche", emoji: "🍎", itens: ["Ovo cozido ou iogurte natural", "1 iogurte natural + 1 maçã picada"] },
    { id: "jantar", hora: "21:00", nome: "Jantar", emoji: "🌙", itens: ["Omelete de 2 ovos + vegetais", "2 colheres de purê"] },
  ],
  metaAgua: 8,
};

const PLANO_ESTUDO_ATA = {
  objetivo: "Ser aprovada no concurso dos meus sonhos e construir a vida que sempre imaginei!",
  focoDoDia: ["Estudar com qualidade", "Manter a constância", "Resolver questões", "Revisar e aprender com os erros", "Confiar no processo"],
  prioridades: ["Cumprir o plano de estudos", "3h líquidas de estudo por dia", "Resolver questões todos os dias", "Revisar conteúdos constantemente", "Manter equilíbrio: mente e corpo"],
  habitos: ["Estudar no mesmo horário", "Evitar distrações", "Dormir bem", "Me alimentar melhor", "Exercitar meu corpo", "Ler e me informar", "Agradecer e visualizar meu futuro"],
  lembrete: "Não é sobre motivação, é sobre disciplina e persistência! Eu estou me tornando minha melhor versão.",
};

const O_QUE_ESTUDAR = [
  { dia: "Segunda", itens: ["1h Português", "1h Matemática", "1h Questões de Português e Matemática"] },
  { dia: "Terça", itens: ["1h Informática", "1h Administração Pública", "1h Questões"] },
  { dia: "Quarta", itens: ["1h Português", "1h Lei 8.112", "1h Questões"] },
  { dia: "Quinta", itens: ["1h Matemática / Raciocínio Lógico", "1h Ética", "1h Questões"] },
  { dia: "Sexta", itens: ["1h Português", "1h Informática ou Administração", "1h Questões"] },
  { dia: "Sábado", itens: ["Revisão da semana", "Questões erradas", "Simulado curto"] },
];

const EU_SOU = [
  "confiança", "presença", "dona do meu corpo", "autoestima", "charme", "mistério",
  "poder feminino", "inesquecível", "intensa", "rara", "disciplina", "estratégia",
  "foco", "consistência", "organização", "produtividade", "inteligência", "visão",
  "liderança", "controle", "independência", "carisma", "presença marcante",
  "comunicação", "visibilidade", "autenticidade", "brilho", "conexão", "influência",
  "criatividade", "alto astral", "energia positiva", "lembrada", "exemplo",
  "expansão", "análise", "observação", "tomada de decisão", "controle emocional",
  "paciência", "planejamento", "visão de futuro", "solução",
];

const DELULU_MILIONARIA = [
  { emoji: "🌸", texto: "Coloque um perfume como se estivesse indo para uma reunião importante." },
  { emoji: "🥂", texto: "Beba água em uma taça ou copo bonito para treinar energia de abundância." },
  { emoji: "🎶", texto: "Ande pela casa com uma música de 'entrando na minha era rica'." },
  { emoji: "💍", texto: "Vista uma peça bonita (anel, brinco, batom), mesmo sem sair." },
  { emoji: "👠", texto: "Caminhe mais devagar e com postura elevada, como quem é observada." },
  { emoji: "🪞", texto: "Limpe 1 objeto (espelho, mesa, bancada) como se fosse algo caro que você cuida." },
  { emoji: "📱", texto: "Responda mensagens com calma e elegância — sem pressa, sem nervosismo." },
  { emoji: "🧴", texto: "Faça uma micro-rotina de skincare como se estivesse indo para um evento." },
  { emoji: "💗", texto: "Escolha uma frase de poder e repita mentalmente enquanto age." },
  { emoji: "🛋️", texto: "Sente-se com postura de mulher poderosa: ombros abertos, queixo levantado." },
];

const ORATORIA_ETAPAS = [
  { titulo: "Despertar a Voz", duracao: "1 min", itens: ["Faça um som de vibração com os lábios (30s)", "Como uma criança brincando de carrinho (30s)", "Objetivo: aquecer a musculatura da fala, soltar a mandíbula, projetar a voz"] },
  { titulo: "Abrir a Voz", duracao: "1 min", itens: ["Repita exagerando: A E I O U", "Faça como se estivesse falando para alguém do outro lado da sala", "Não grite — projete"] },
  { titulo: "Exercício da Caneta", duracao: "2 min", itens: ["Coloque uma caneta entre os dentes", "Leia um pequeno trecho exagerando a articulação", "Retire a caneta e leia novamente — sentirá melhora imediata"] },
  { titulo: "Dicção de Rainha", duracao: "", itens: ["'O rato roeu a roupa do rei de Roma.' — 5x", "'Três pratos de trigo para três tigres tristes.' — 5x", "'O peito do pé de Pedro é preto.' — 5x"] },
  { titulo: "Treino de Volume", duracao: "", itens: ["Imagine alguém a 1, 3 e 5 metros de distância", "Diga 'Bom dia, tudo bem?' projetando para cada distância", "Sem gritar — apenas projetando"] },
  { titulo: "Treino Antibocejo", duracao: "", itens: ["Respire: 4s inspirando, 4s segurando, 6s soltando", "Repita 5 vezes"] },
];

const CHECKLIST_ORATORIA_DIARIO = ["Grave um vídeo", "Faça o ritual de voz", "Leia um livro em voz alta"];

const CONTEUDO_GRAVACAO = [
  { titulo: "Conselho da Sabrina", emoji: "🎙️", itens: ["Por que você continua esperando a vida mudar antes de mudar suas atitudes?", "O que você está adiando?", "Qual atitude simples poderia começar hoje?", "Como sua vida seria daqui a um ano se você mantivesse a mesma postura?"] },
  { titulo: "Versículo", emoji: "📖", itens: ["'Porque Deus não nos deu espírito de medo.' (Bíblia)", "Diferença entre prudência e medo", "Como o medo trava sonhos", "O que significa agir mesmo sentindo insegurança"] },
  { titulo: "Mentalidade Águia", emoji: "🦅", itens: ["O que uma mulher poderosa faz quando ninguém está olhando?", "Hábitos silenciosos", "Disciplina e estudos", "Construção de caráter"] },
  { titulo: "Mentalidade Diamante", emoji: "💎", itens: ["Qual é o valor que você está colocando em si mesma?", "Autovalorização", "Como as pessoas tratam quem se desvaloriza", "A importância da postura"] },
  { titulo: "Arquétipo Estrela", emoji: "⭐", itens: ["Por que algumas pessoas entram em um ambiente e são notadas imediatamente?", "Presença e linguagem corporal", "Energia", "Comunicação"] },
  { titulo: "Arquétipo Mago", emoji: "🔮", itens: ["A realidade muda primeiro na mente ou na vida?", "Crenças", "Decisões e identidade", "Transformação pessoal"] },
  { titulo: "CEO em Construção", emoji: "💼", itens: ["Se eu fosse contratada hoje para liderar uma empresa, o que ainda precisaria desenvolver?", "Comunicação e liderança", "Inteligência emocional", "Tomada de decisão"] },
  { titulo: "Livro da Semana", emoji: "📚", itens: ["Qual lição do livro mais me chamou atenção e por quê?", "Leitura estratégica + aplicação prática"] },
  { titulo: "Reflexão Profunda", emoji: "🤍", itens: ["O que a você de 2030 agradeceria por você ter começado hoje?"] },
  { titulo: "Pergunta Poderosa", emoji: "☕", itens: ["Se você tivesse certeza absoluta de que não iria fracassar, o que faria ainda este mês?"] },
  { titulo: "10 Temas Aleatórios", emoji: "✨", itens: ["Versículo motivacional", "Notícia: IA e o mercado de trabalho", "Livro: mentalidade de riqueza", "RH: a importância do feedback", "Concurso: disciplina vale mais que motivação", "Conselho de vida: pare de esperar o momento perfeito", "Desenvolvimento profissional", "Comunicação: por que comunicativos têm mais oportunidades?", "Mentalidade: sonhar x executar", "Reflexão: quem você quer ser daqui a 5 anos?"] },
];

const ESTILO_MR = {
  essencia: ["Magnética sem esforço", "Estratégica e observadora", "Focada em crescimento financeiro", "Seletiva e de alto valor"],
  essenciaFrase: "Ela não corre atrás. Ela constrói valor e faz o mundo vir até ela.",
  paleta: [
    { nome: "Preto", significado: "poder, autoridade", cor: "#1C1C1C" },
    { nome: "Dourado", significado: "riqueza", cor: "#C9A227" },
    { nome: "Nude / Bege", significado: "elegância", cor: "#E3CBB0" },
    { nome: "Vinho / Bordô", significado: "sensualidade", cor: "#6E2A3A" },
    { nome: "Off-white", significado: "sofisticação limpa", cor: "#F3EDE3" },
    { nome: "Marrom quente", significado: "estabilidade e luxo", cor: "#6B4A35" },
  ],
  roupaFrase: "Você não se veste 'bonita'. Você se veste cara e memorável.",
  pecasChave: ["Blazer estruturado", "Calça de alfaiataria cintura alta", "Vestidos midi ajustados", "Saia com fenda discreta", "Cropped elegante", "Conjuntos monocromáticos"],
  tecidos: "Cetim · Alfaiataria · Couro · Linho",
  maquiagem: ["Pele luminosa, sem excesso", "Sobrancelha definida", "Olhos: delineado gatinho + cílios marcantes", "Boca: nude sofisticado ou vermelho fechado", "Contorno leve + iluminador estratégico"],
  maquiagemFrase: "Ela se cuida e sabe quem é.",
  cabelo: ["Longo, alinhado", "Brilho impecável", "Liso ou ondas suaves", "Organizado e controlado"],
  cabeloFrase: "Nada bagunçado. Você transmite domínio.",
  corpo: ["Postura reta", "Movimentos lentos", "Olhar direto (não desvia)", "Poucos gestos (controle = poder)"],
  corpoFrase: "Você não precisa falar alto. Sua presença faz isso.",
  comunicacaoTom: ["Calmo", "Seguro", "Direto"],
  comunicacaoComo: ["Sem rodeios", "Sem se justificar", "Sem parecer desesperada"],
  comunicacaoExemplo: { evitar: "Eu acho que...", usar: "O que muda sua vida é..." },
};

function chaveData(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function diasNoMes(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

/* ---------- app ---------- */

function PlannerFofo() {
  const [aba, setAba] = useState("calendario");
  const [mesAtual, setMesAtual] = useState(6); // julho (0-index) — 2026
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const [tarefasPorDia, setTarefasPorDia] = useState({});
  const [tarefasGerais, setTarefasGerais] = useState([
    { id: 1, texto: "Regar as plantinhas 🌱", feito: false },
    { id: 2, texto: "Beber bastante água 💧", feito: true },
  ]);
  const [notas, setNotas] = useState([
    { id: 1, texto: "Ideia: fazer um álbum de fotos do verão ☀️", cor: 0 },
    { id: 2, texto: "Lembrar de ligar pra vovó no domingo 💌", cor: 3 },
  ]);

  const [rotina, setRotina] = useState(ROTINA_PADRAO);

  const [checklists, setChecklists] = useState(() => {
    const estadoInicial = {};
    CHECKLIST_CATEGORIAS.forEach((cat) => {
      estadoInicial[cat.id] = cat.itens.map((texto, i) => ({
        id: i,
        texto,
        feito: false,
      }));
    });
    return estadoInicial;
  });

  const [alimentarFeitos, setAlimentarFeitos] = useState({});
  const [copos, setCopos] = useState(0);

  const [ataFeitos, setAtaFeitos] = useState({
    focoDoDia: PLANO_ESTUDO_ATA.focoDoDia.map(() => false),
    prioridades: PLANO_ESTUDO_ATA.prioridades.map(() => false),
    habitos: PLANO_ESTUDO_ATA.habitos.map(() => false),
  });

  const [estudarFeitos, setEstudarFeitos] = useState(() =>
    O_QUE_ESTUDAR.map((d) => d.itens.map(() => false))
  );

  const [euSouFavoritos, setEuSouFavoritos] = useState(new Set());

  const [deluluFeitos, setDeluluFeitos] = useState(DELULU_MILIONARIA.map(() => false));

  const [oratoriaFeitos, setOratoriaFeitos] = useState(ORATORIA_ETAPAS.map(() => false));
  const [oratoriaDiario, setOratoriaDiario] = useState(CHECKLIST_ORATORIA_DIARIO.map(() => false));

  const [carregado, setCarregado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // 1. CARREGA OS DADOS SALVOS ASSIM QUE O APP ABRE (Corrigido com localStorage nativo)
  useEffect(() => {
    try {
      const resultado = localStorage.getItem("planner-dados");
      if (resultado) {
        const d = JSON.parse(resultado);
        if (d.mesAtual !== undefined) setMesAtual(d.mesAtual);
        if (d.tarefasPorDia) setTarefasPorDia(d.tarefasPorDia);
        if (d.tarefasGerais) setTarefasGerais(d.tarefasGerais);
        if (d.notas) setNotas(d.notas);
        if (d.rotina) setRotina(d.rotina);
        if (d.checklists) setChecklists(d.checklists);
        if (d.alimentarFeitos) setAlimentarFeitos(d.alimentarFeitos);
        if (d.copos !== undefined) setCopos(d.copos);
        if (d.ataFeitos) setAtaFeitos(d.ataFeitos);
        if (d.estudarFeitos) setEstudarFeitos(d.estudarFeitos);
        if (d.euSouFavoritos) setEuSouFavoritos(new Set(d.euSouFavoritos));
        if (d.deluluFeitos) setDeluluFeitos(d.deluluFeitos);
        if (d.oratoriaFeitos) setOratoriaFeitos(d.oratoriaFeitos);
        if (d.oratoriaDiario) setOratoriaDiario(d.oratoriaDiario);
      }
    } catch (e) {
      console.error("Erro ao carregar do localStorage:", e);
    } finally {
      setCarregado(true);
    }
  }, []);

  // 2. SALVA AUTOMATICAMENTE SEMPRE QUE ALGO MUDA (Corrigido com localStorage nativo)
  useEffect(() => {
    if (!carregado) return;
    setSalvando(true);
    const timeout = setTimeout(() => {
      try {
        const dados = {
          mesAtual,
          tarefasPorDia,
          tarefasGerais,
          notas,
          rotina,
          checklists,
          alimentarFeitos,
          copos,
          ataFeitos,
          estudarFeitos,
          euSouFavoritos: Array.from(euSouFavoritos),
          deluluFeitos,
          oratoriaFeitos,
          oratoriaDiario,
        };
        localStorage.setItem("planner-dados", JSON.stringify(dados));
      } catch (e) {
        console.error("Erro ao salvar no localStorage:", e);
      } finally {
        setSalvando(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [
    carregado,
    mesAtual,
    tarefasPorDia,
    tarefasGerais,
    notas,
    rotina,
    checklists,
    alimentarFeitos,
    copos,
    ataFeitos,
    estudarFeitos,
    euSouFavoritos,
    deluluFeitos,
    oratoriaFeitos,
    oratoriaDiario,
  ]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const styleBase = {
    fontFamily: "'Nunito', sans-serif",
    background:
      "linear-gradient(180deg, #FFF8F3 0%, #FDF3F8 45%, #F3ECFB 100%)",
    minHeight: "100vh",
    color: "#6B5B73",
  };

  return (
    <div style={styleBase} className="w-full">
      <TopBar aba={aba} setAba={setAba} salvando={salvando} carregado={carregado} />

      <div className="max-w-3xl mx-auto px-4 pb-16 pt-6">
        {aba === "calendario" && (
          <Calendario
            ano={2026}
            mes={mesAtual}
            setMes={setMesAtual}
            diaSelecionado={diaSelecionado}
            setDiaSelecionado={setDiaSelecionado}
            tarefasPorDia={tarefasPorDia}
            setTarefasPorDia={setTarefasPorDia}
          />
        )}
        {aba === "tarefas" && (
          <Tarefas tarefas={tarefasGerais} setTarefas={setTarefasGerais} />
        )}
        {aba === "notas" && <Notas notas={notas} setNotas={setNotas} />}
        {aba === "rotina" && <Rotina rotina={rotina} setRotina={setRotina} />}
        {aba === "checklists" && (
          <Checklists checklists={checklists} setChecklists={setChecklists} />
        )}
        {aba === "alimentar" && (
          <PlanoAlimentar
            feitos={alimentarFeitos}
            setFeitos={setAlimentarFeitos}
            copos={copos}
            setCopos={setCopos}
          />
        )}
        {aba === "ata" && (
          <PlanoEstudoATA feitos={ataFeitos} setFeitos={setAtaFeitos} />
        )}
        {aba === "estudar" && (
          <OQueEstudar feitos={estudarFeitos} setFeitos={setEstudarFeitos} />
        )}
        {aba === "eusou" && (
          <EuSou favoritos={euSouFavoritos} setFavoritos={setEuSouFavoritos} />
        )}
        {aba === "delulu" && (
          <DeluluMilionaria feitos={deluluFeitos} setFeitos={setDeluluFeitos} />
        )}
        {aba === "oratoria" && (
          <Oratoria
            feitos={oratoriaFeitos}
            setFeitos={setOratoriaFeitos}
            diario={oratoriaDiario}
            setDiario={setOratoriaDiario}
          />
        )}
        {aba === "estilo" && <EstiloMR />}
      </div>
    </div>
  );
}

/* ---------- barra superior ---------- */

function TopBar({ aba, setAba, salvando, carregado }) {
  const itens = [
    { id: "calendario", label: "Calendário", icon: CalendarHeart },
    { id: "rotina", label: "Rotina", icon: Clock },
    { id: "tarefas", label: "Tarefas", icon: ListChecks },
    { id: "checklists", label: "50 Coisas", icon: GraduationCap },
    { id: "notas", label: "Notas", icon: StickyNote },
    { id: "alimentar", label: "Plano Alimentar", icon: Apple },
    { id: "ata", label: "Plano de Estudo", icon: Target },
    { id: "estudar", label: "O que Estudar", icon: BookOpen },
    { id: "eusou", label: "Eu Sou", icon: Heart },
    { id: "delulu", label: "Delulu Milionária", icon: Gem },
    { id: "oratoria", label: "Oratória & Gravação", icon: Mic },
    { id: "estilo", label: "Estilo MR", icon: Shirt },
  ];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #F3D9E7",
      }}
      className="sticky top-0 z-20"
    >
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-3">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={22} color="#D9A8C4" />
          <h1
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 700,
              color: "#8A5570",
            }}
            className="text-2xl"
          >
            Meu Cantinho — 2026
          </h1>
          <span
            style={{ color: "#C9A9BE", fontFamily: "'Nunito', sans-serif" }}
            className="text-[11px] ml-1 flex items-center gap-1"
          >
            {!carregado ? "abrindo..." : salvando ? "salvando..." : "✓ salvo"}
          </span>
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {itens.map((it) => {
            const ativo = aba === it.id;
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => setAba(it.id)}
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 600,
                  background: ativo
                    ? "linear-gradient(135deg,#F7C6DB,#E3C6F1)"
                    : "#FFFFFFAA",
                  color: ativo ? "#6B3C57" : "#9A8AA3",
                  border: ativo ? "none" : "1px solid #EEDCEA",
                  boxShadow: ativo ? "0 3px 10px rgba(217,168,196,0.4)" : "none",
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm transition-all shrink-0 whitespace-nowrap"
              >
                <Icon size={16} />
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- calendário ---------- */

function Calendario({
  ano,
  mes,
  setMes,
  diaSelecionado,
  setDiaSelecionado,
  tarefasPorDia,
  setTarefasPorDia,
}) {
  const totalDias = diasNoMes(ano, mes);
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const celulas = [];
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null);
  for (let d = 1; d <= totalDias; d++) celulas.push(d);

  const hoje = new Date();
  const ehHoje = (d) =>
    hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === d;

  const chaveSel = diaSelecionado
    ? chaveData(ano, mes, diaSelecionado)
    : null;

  return (
    <div>
      {/* seletor de mês */}
      <div
        style={{
          background: "#FFFFFFCC",
          border: "1px solid #F3D9E7",
          borderRadius: 24,
        }}
        className="p-4 mb-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setMes((m) => (m === 0 ? 0 : m - 1));
              setDiaSelecionado(null);
            }}
            disabled={mes === 0}
            style={{ color: mes === 0 ? "#E6D5E0" : "#C48AAE" }}
            className="p-2 rounded-full hover:bg-pink-50"
          >
            <ChevronLeft size={20} />
          </button>
          <h2
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 700,
              color: "#8A5570",
            }}
            className="text-lg flex items-center gap-2"
          >
            <Flower2 size={18} color="#E3A8C8" />
            {MESES[mes]} de {ano}
          </h2>
          <button
            onClick={() => {
              setMes((m) => (m === 11 ? 11 : m + 1));
              setDiaSelecionado(null);
            }}
            disabled={mes === 11}
            style={{ color: mes === 11 ? "#E6D5E0" : "#C48AAE" }}
            className="p-2 rounded-full hover:bg-pink-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DIAS_SEMANA.map((d, i) => (
            <div
              key={i}
              style={{ color: "#C9A9BE", fontFamily: "'Quicksand', sans-serif" }}
              className="text-center text-xs font-semibold py-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {celulas.map((d, i) => {
            if (d === null) return <div key={i} />;
            const chave = chaveData(ano, mes, d);
            const temTarefas = (tarefasPorDia[chave] || []).length > 0;
            const selecionado = diaSelecionado === d;
            return (
              <button
                key={i}
                onClick={() => setDiaSelecionado(d)}
                style={{
                  background: selecionado
                    ? "linear-gradient(135deg,#F7C6DB,#E3C6F1)"
                    : ehHoje(d)
                    ? "#FFF3D9"
                    : "transparent",
                  color: selecionado ? "#6B3C57" : "#7A6B80",
                  fontWeight: selecionado || ehHoje(d) ? 700 : 500,
                  border: ehHoje(d) && !selecionado ? "1.5px solid #F3D28E" : "1px solid transparent",
                }}
                className="relative aspect-square rounded-2xl text-sm flex items-center justify-center hover:bg-pink-50 transition-all"
              >
                {d}
                {temTarefas && (
                  <span
                    style={{ background: selecionado ? "#6B3C57" : "#E3A8C8" }}
                    className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {diaSelecionado && (
        <PainelDia
          titulo={`${diaSelecionado} de ${MESES[mes]}`}
          tarefas={tarefasPorDia[chaveSel] || []}
          onFechar={() => setDiaSelecionado(null)}
          onAdd={(texto) =>
            setTarefasPorDia((prev) => ({
              ...prev,
              [chaveSel]: [
                ...(prev[chaveSel] || []),
                { id: Date.now(), texto, feito: false },
              ],
            }))
          }
          onToggle={(id) =>
            setTarefasPorDia((prev) => ({
              ...prev,
              [chaveSel]: prev[chaveSel].map((t) =>
                t.id === id ? { ...t, feito: !t.feito } : t
              ),
            }))
          }
          onRemover={(id) =>
            setTarefasPorDia((prev) => ({
              ...prev,
              [chaveSel]: prev[chaveSel].filter((t) => t.id !== id),
            }))
          }
        />
      )}
    </div>
  );
}

function PainelDia({ titulo, tarefas, onFechar, onAdd, onToggle, onRemover }) {
  const [novo, setNovo] = useState("");

  const enviar = () => {
    if (!novo.trim()) return;
    onAdd(novo.trim());
    setNovo("");
  };

  return (
    <div
      style={{
        background: "#FFFFFFE0",
        border: "1px solid #F3D9E7",
        borderRadius: 24,
      }}
      className="p-4 shadow-sm animate-[fadeIn_0.2s_ease]"
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          style={{
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: 700,
            color: "#8A5570",
          }}
          className="text-base"
        >
          🗓️ {titulo}
        </h3>
        <button onClick={onFechar} className="text-[#C9A9BE] hover:text-[#8A5570]">
          <X size={18} />
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Adicionar compromisso ou tarefinha..."
          style={{
            fontFamily: "'Nunito', sans-serif",
            border: "1px solid #F0DCE8",
            borderRadius: 14,
          }}
          className="flex-1 px-3 py-2 text-sm outline-none focus:border-[#E3A8C8] bg-white"
        />
        <button
          onClick={enviar}
          style={{ background: "#F0C6DB", color: "#6B3C57" }}
          className="px-3 rounded-2xl hover:opacity-90"
        >
          <Plus size={18} />
        </button>
      </div>

      {tarefas.length === 0 ? (
        <p className="text-sm text-[#C9A9BE] italic">Nenhum plano por aqui ainda ✨</p>
      ) : (
        <ul className="space-y-1.5">
          {tarefas.map((t) => (
            <ItemTarefa
              key={t.id}
              item={t}
              onToggle={() => onToggle(t.id)}
              onRemover={() => onRemover(t.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- tarefas gerais ---------- */

function ItemTarefa({ item, onToggle, onRemover }) {
  return (
    <li
      style={{ background: "#FDF6FA", borderRadius: 14 }}
      className="flex items-center gap-2 px-3 py-2 group"
    >
      <button
        onClick={onToggle}
        style={{
          background: item.feito ? "#E3A8C8" : "white",
          border: "1.5px solid #E3A8C8",
        }}
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
      >
        {item.feito && <Check size={12} color="white" strokeWidth={3} />}
      </button>
      <span
        style={{
          fontFamily: "'Nunito', sans-serif",
          color: item.feito ? "#C9A9BE" : "#6B5B73",
          textDecoration: item.feito ? "line-through" : "none",
        }}
        className="text-sm flex-1"
      >
        {item.texto}
      </span>
      <button
        onClick={onRemover}
        className="opacity-0 group-hover:opacity-100 text-[#E0B9CC] hover:text-[#C46B8F] transition-opacity"
      >
        <Trash2 size={15} />
      </button>
    </li>
  );
}

function Tarefas({ tarefas, setTarefas }) {
  const [novo, setNovo] = useState("");
  const feitas = tarefas.filter((t) => t.feito).length;

  const enviar = () => {
    if (!novo.trim()) return;
    setTarefas((prev) => [...prev, { id: Date.now(), texto: novo.trim(), feito: false }]);
    setNovo("");
  };

  return (
    <div
      style={{ background: "#FFFFFFCC", border: "1px solid #F3D9E7", borderRadius: 24 }}
      className="p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-1">
        <h2
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }}
          className="text-lg flex items-center gap-2"
        >
          <ListChecks size={19} color="#B8E4C9" />
          Lista de Tarefas
        </h2>
        <span style={{ color: "#B7A6BF" }} className="text-xs">
          {feitas}/{tarefas.length} concluídas
        </span>
      </div>

      {/* barra de progresso fofa */}
      <div
        style={{ background: "#F3E6ED", borderRadius: 10 }}
        className="h-2 mb-4 overflow-hidden"
      >
        <div
          style={{
            width: tarefas.length ? `${(feitas / tarefas.length) * 100}%` : "0%",
            background: "linear-gradient(90deg,#B8E4C9,#F7C6DB)",
            transition: "width 0.3s ease",
          }}
          className="h-full rounded-full"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="O que você precisa fazer? 🌸"
          style={{ fontFamily: "'Nunito', sans-serif", border: "1px solid #F0DCE8", borderRadius: 14 }}
          className="flex-1 px-3 py-2.5 text-sm outline-none focus:border-[#E3A8C8] bg-white"
        />
        <button
          onClick={enviar}
          style={{ background: "#B8E4C9", color: "#3E7A58" }}
          className="px-4 rounded-2xl hover:opacity-90 font-semibold"
        >
          <Plus size={18} />
        </button>
      </div>

      {tarefas.length === 0 ? (
        <p className="text-sm text-[#C9A9BE] italic text-center py-6">
          Sua lista está vazia — que tal adicionar algo? 🎀
        </p>
      ) : (
        <ul className="space-y-1.5">
          {tarefas.map((t) => (
            <ItemTarefa
              key={t.id}
              item={t}
              onToggle={() =>
                setTarefas((prev) =>
                  prev.map((x) => (x.id === t.id ? { ...x, feito: !x.feito } : x))
                )
              }
              onRemover={() => setTarefas((prev) => prev.filter((x) => x.id !== t.id))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- notas (mural de post-its) ---------- */

function Notas({ notas, setNotas }) {
  const [texto, setTexto] = useState("");

  const adicionar = () => {
    if (!texto.trim()) return;
    const cor = Math.floor(Math.random() * CORES_NOTA.length);
    setNotas((prev) => [...prev, { id: Date.now(), texto: texto.trim(), cor }]);
    setTexto("");
  };

  return (
    <div>
      <div
        style={{ background: "#FFFFFFCC", border: "1px solid #F3D9E7", borderRadius: 24 }}
        className="p-4 mb-5 shadow-sm"
      >
        <h2
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }}
          className="text-lg flex items-center gap-2 mb-3"
        >
          <StickyNote size={18} color="#D9C1F1" />
          Mural de Notas
        </h2>
        <div className="flex gap-2">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva um lembrete, uma ideia, um sonho..."
            rows={2}
            style={{ fontFamily: "'Nunito', sans-serif", border: "1px solid #F0DCE8", borderRadius: 14 }}
            className="flex-1 px-3 py-2 text-sm outline-none focus:border-[#E3A8C8] bg-white resize-none"
          />
          <button
            onClick={adicionar}
            style={{ background: "#D9C1F1", color: "#5B3C7A" }}
            className="px-4 rounded-2xl hover:opacity-90 self-stretch"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {notes_count := notas.length; notes_count === 0 ? (
        <div className="text-center py-10">
          <Cloud size={30} color="#E6D5E0" className="mx-auto mb-2" />
          <p className="text-sm text-[#C9A9BE] italic">Nenhuma nota por aqui ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {notas.map((n) => {
            const c = CORES_NOTA[n.cor % CORES_NOTA.length];
            return (
              <div
                key={n.id}
                style={{
                  background: c.bg,
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(150,110,140,0.12)",
                  transform: `rotate(${(n.id % 5) - 2}deg)`,
                }}
                className="p-3 relative group transition-transform hover:rotate-0"
              >
                <div
                  style={{ background: c.tape }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 rounded-sm opacity-80"
                />
                <button
                  onClick={() => setNotas((prev) => prev.filter((x) => x.id !== n.id))}
                  style={{ color: c.text }}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-60 hover:!opacity-100"
                >
                  <X size={14} />
                </button>
                <p
                  style={{ fontFamily: "'Nunito', sans-serif", color: c.text }}
                  className="text-sm mt-1.5 whitespace-pre-wrap break-words"
                >
                  {n.texto}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- rotina diária ---------- */

function Rotina({ rotina, setRotina }) {
  const [hora, setHora] = useState("");
  const [texto, setTexto] = useState("");

  const ordenados = useMemo(
    () => [...rotina].sort((a, b) => a.hora.localeCompare(b.hora)),
    [rotina]
  );
  const feitos = rotina.filter((r) => r.feito).length;

  const adicionar = () => {
    if (!hora || !texto.trim()) return;
    setRotina((prev) => [
      ...prev,
      { id: Date.now(), hora, texto: texto.trim(), emoji: "🌷", feito: false },
    ]);
    setHora("");
    setTexto("");
  };

  const reiniciarDia = () => {
    setRotina((prev) => prev.map((r) => ({ ...r, feito: false })));
  };

  return (
    <div
      style={{ background: "#FFFFFFCC", border: "1px solid #F3D9E7", borderRadius: 24 }}
      className="p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-1">
        <h2
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }}
          className="text-lg flex items-center gap-2"
        >
          <Sun size={19} color="#F3D28E" />
          Minha Rotina Base
        </h2>
        <button
          onClick={reiniciarDia}
          style={{ color: "#C9A9BE" }}
          className="text-xs underline hover:text-[#8A5570]"
        >
          reiniciar dia
        </button>
      </div>
      <p style={{ color: "#B7A6BF" }} className="text-xs mb-3">
        Foco hoje, liberdade amanhã 🎀 — {feitos}/{rotina.length} feitos
      </p>

      <div
        style={{ background: "#F3E6ED", borderRadius: 10 }}
        className="h-2 mb-4 overflow-hidden"
      >
        <div
          style={{
            width: rotina.length ? `${(feitos / rotina.length) * 100}%` : "0%",
            background: "linear-gradient(90deg,#F3D28E,#F7C6DB)",
            transition: "width 0.3s ease",
          }}
          className="h-full rounded-full"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          style={{ fontFamily: "'Nunito', sans-serif", border: "1px solid #F0DCE8", borderRadius: 14 }}
          className="w-28 px-2 py-2.5 text-sm outline-none focus:border-[#E3A8C8] bg-white"
        />
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionar()}
          placeholder="Novo compromisso da rotina..."
          style={{ fontFamily: "'Nunito', sans-serif", border: "1px solid #F0DCE8", borderRadius: 14 }}
          className="flex-1 px-3 py-2.5 text-sm outline-none focus:border-[#E3A8C8] bg-white min-w-0"
        />
        <button
          onClick={adicionar}
          style={{ background: "#F3D28E", color: "#7A5A20" }}
          className="px-4 rounded-2xl hover:opacity-90 shrink-0"
        >
          <Plus size={18} />
        </button>
      </div>

      <ul className="space-y-1.5">
        {ordenados.map((r) => (
          <li
            key={r.id}
            style={{ background: "#FDF6FA", borderRadius: 14 }}
            className="flex items-center gap-3 px-3 py-2.5 group"
          >
            <span
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 700,
                color: "#C48AAE",
                background: "#FBEAF3",
                borderRadius: 10,
              }}
              className="text-xs px-2 py-1 shrink-0"
            >
              {r.hora}
            </span>
            <button
              onClick={() =>
                setRotina((prev) =>
                  prev.map((x) => (x.id === r.id ? { ...x, feito: !x.feito } : x))
                )
              }
              style={{
                background: r.feito ? "#E3A8C8" : "white",
                border: "1.5px solid #E3A8C8",
              }}
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            >
              {r.feito && <Check size={12} color="white" strokeWidth={3} />}
            </button>
            <span className="shrink-0">{r.emoji}</span>
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: r.feito ? "#C9A9BE" : "#6B5B73",
                textDecoration: r.feito ? "line-through" : "none",
              }}
              className="text-sm flex-1"
            >
              {r.texto}
            </span>
            <button
              onClick={() => setRotina((prev) => prev.filter((x) => x.id !== r.id))}
              className="opacity-0 group-hover:opacity-100 text-[#E0B9CC] hover:text-[#C46B8F] transition-opacity shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- checklists temáticos (50 coisas) ---------- */

function Checklists({ checklists, setChecklists }) {
  const [aberta, setAberta] = useState(CHECKLIST_CATEGORIAS[0].id);
  const [novoItem, setNovoItem] = useState("");

  const toggleItem = (catId, itemId) => {
    setChecklists((prev) => ({
      ...prev,
      [catId]: prev[catId].map((it) =>
        it.id === itemId ? { ...it, feito: !it.feito } : it
      ),
    }));
  };

  const removerItem = (catId, itemId) => {
    setChecklists((prev) => ({
      ...prev,
      [catId]: prev[catId].filter((it) => it.id !== itemId),
    }));
  };

  const adicionarItem = (catId) => {
    if (!novoItem.trim()) return;
    setChecklists((prev) => ({
      ...prev,
      [catId]: [
        ...prev[catId],
        { id: Date.now(), texto: novoItem.trim(), feito: false },
      ],
    }));
    setNovoItem("");
  };

  return (
    <div>
      <div className="mb-4 text-center">
        <h2
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }}
          className="text-lg"
        >
          ✨ Coisas para aprender e fazer
        </h2>
        <p style={{ color: "#B7A6BF" }} className="text-xs mt-1">
          Pequenas atitudes transformam sua vida 💗
        </p>
      </div>

      <div className="space-y-3">
        {CHECKLIST_CATEGORIAS.map((cat) => {
          const itens = checklists[cat.id] || [];
          const feitos = itens.filter((i) => i.feito).length;
          const estaAberta = aberta === cat.id;

          return (
            <div
              key={cat.id}
              style={{
                background: cat.cor.bg,
                borderRadius: 20,
                border: `1px solid ${cat.cor.accent}33`,
              }}
              className="overflow-hidden"
            >
              <button
                onClick={() => setAberta(estaAberta ? null : cat.id)}
                className="w-full flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.emoji}</span>
                  <span
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: 700,
                      color: cat.cor.accent,
                    }}
                    className="text-sm"
                  >
                    {cat.titulo}
                  </span>
                  <span style={{ color: cat.cor.accent }} className="text-xs opacity-70">
                    {feitos}/{itens.length}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  color={cat.cor.accent}
                  style={{
                    transform: estaAberta ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {estaAberta && (
                <div className="px-4 pb-4">
                  <div
                    style={{ background: "#FFFFFF80", borderRadius: 10 }}
                    className="h-1.5 mb-3 overflow-hidden"
                  >
                    <div
                      style={{
                        width: itens.length ? `${(feitos / itens.length) * 100}%` : "0%",
                        background: cat.cor.accent,
                        transition: "width 0.3s ease",
                      }}
                      className="h-full rounded-full"
                    />
                  </div>

                  <ul className="space-y-1">
                    {itens.map((it) => (
                      <li key={it.id} className="flex items-center gap-2 group py-0.5">
                        <button
                          onClick={() => toggleItem(cat.id, it.id)}
                          style={{
                            background: it.feito ? cat.cor.accent : "white",
                            border: `1.5px solid ${cat.cor.accent}`,
                          }}
                          className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
                        >
                          {it.feito && <Check size={10} color="white" strokeWidth={3} />}
                        </button>
                        <span
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            color: it.feito ? `${cat.cor.accent}99` : "#6B5B73",
                            textDecoration: it.feito ? "line-through" : "none",
                          }}
                          className="text-sm flex-1"
                        >
                          {it.texto}
                        </span>
                        <button
                          onClick={() => removerItem(cat.id, it.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#0000004D] hover:text-[#C46B8F] transition-opacity"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2 mt-3">
                    <input
                      value={aberta === cat.id ? novoItem : ""}
                      onChange={(e) => setNovoItem(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && adicionarItem(cat.id)}
                      placeholder="Adicionar item..."
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        border: `1px solid ${cat.cor.accent}55`,
                        borderRadius: 12,
                      }}
                      className="flex-1 px-2.5 py-1.5 text-xs outline-none bg-white/70 min-w-0"
                    />
                    <button
                      onClick={() => adicionarItem(cat.id)}
                      style={{ background: cat.cor.accent, color: "white" }}
                      className="px-2.5 rounded-xl shrink-0"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- barrinha de progresso reutilizável ---------- */

function BarraProgresso({ feito, total, cor1, cor2 }) {
  return (
    <div style={{ background: "#F3E6ED", borderRadius: 10 }} className="h-2 mb-4 overflow-hidden">
      <div
        style={{
          width: total ? `${(feito / total) * 100}%` : "0%",
          background: `linear-gradient(90deg,${cor1},${cor2})`,
          transition: "width 0.3s ease",
        }}
        className="h-full rounded-full"
      />
    </div>
  );
}

function CardBase({ children, style }) {
  return (
    <div
      style={{ background: "#FFFFFFCC", border: "1px solid #F3D9E7", borderRadius: 24, ...style }}
      className="p-5 shadow-sm mb-4"
    >
      {children}
    </div>
  );
}

function TituloSecao({ icon: Icon, cor, children }) {
  return (
    <h2
      style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }}
      className="text-lg flex items-center gap-2 mb-3"
    >
      <Icon size={19} color={cor} />
      {children}
    </h2>
  );
}

/* ---------- plano alimentar ---------- */

function PlanoAlimentar({ feitos, setFeitos, copos, setCopos }) {
  const toggle = (refId, idx) => {
    const chave = `${refId}-${idx}`;
    setFeitos((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  const totalItens = PLANO_ALIMENTAR.refeicoes.reduce((s, r) => s + r.itens.length, 0);
  const totalFeitos = Object.values(feitos).filter(Boolean).length;

  return (
    <div>
      <CardBase>
        <TituloSecao icon={Apple} cor="#E39A6B">Plano Alimentar</TituloSecao>
        <p style={{ color: "#B7A6BF" }} className="text-xs mb-3">
          Foco: {PLANO_ALIMENTAR.objetivo} 🌱
        </p>
        <BarraProgresso feito={totalFeitos} total={totalItens} cor1="#F5C99B" cor2="#F7C6DB" />

        {PLANO_ALIMENTAR.refeicoes.map((ref) => (
          <div key={ref.id} className="mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#C48A5C", background: "#FFEFE0", borderRadius: 10 }}
                className="text-xs px-2 py-1"
              >
                {ref.hora}
              </span>
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }} className="text-sm">
                {ref.emoji} {ref.nome}
              </span>
            </div>
            <ul className="space-y-1">
              {ref.itens.map((item, idx) => {
                const marcado = !!feitos[`${ref.id}-${idx}`];
                return (
                  <li key={idx} style={{ background: "#FFF7F1", borderRadius: 12 }} className="flex items-start gap-2 px-3 py-2">
                    <button
                      onClick={() => toggle(ref.id, idx)}
                      style={{ background: marcado ? "#E39A6B" : "white", border: "1.5px solid #E39A6B", marginTop: 2 }}
                      className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
                    >
                      {marcado && <Check size={10} color="white" strokeWidth={3} />}
                    </button>
                    <span
                      style={{ fontFamily: "'Nunito', sans-serif", color: marcado ? "#C9A98F" : "#6B5B73", textDecoration: marcado ? "line-through" : "none" }}
                      className="text-sm"
                    >
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </CardBase>

      <CardBase>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }} className="text-sm">
            💧 Água ({copos}/{PLANO_ALIMENTAR.metaAgua} copos ≈ 2L)
          </span>
          <button onClick={() => setCopos(0)} style={{ color: "#C9A9BE" }} className="text-xs underline">
            reiniciar
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: PLANO_ALIMENTAR.metaAgua }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCopos(i < copos ? i : i + 1)}
              style={{
                background: i < copos ? "linear-gradient(180deg,#BEE1F5,#DCEEFB)" : "#F3F6FA",
                border: "1.5px solid #BEE1F5",
              }}
              className="w-8 h-9 rounded-b-xl rounded-t-sm"
            />
          ))}
        </div>
      </CardBase>
    </div>
  );
}

/* ---------- plano de estudo (ATA) ---------- */

function ListaChecavel({ titulo, itens, marcados, onToggle, cor }) {
  const feito = marcados.filter(Boolean).length;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }} className="text-sm">
          {titulo}
        </span>
        <span style={{ color: "#B7A6BF" }} className="text-xs">{feito}/{itens.length}</span>
      </div>
      <ul className="space-y-1">
        {itens.map((texto, idx) => (
          <li key={idx} style={{ background: "#FDF6FA", borderRadius: 12 }} className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={() => onToggle(idx)}
              style={{ background: marcados[idx] ? cor : "white", border: `1.5px solid ${cor}` }}
              className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
            >
              {marcados[idx] && <Check size={10} color="white" strokeWidth={3} />}
            </button>
            <span
              style={{ fontFamily: "'Nunito', sans-serif", color: marcados[idx] ? "#C9A9BE" : "#6B5B73", textDecoration: marcados[idx] ? "line-through" : "none" }}
              className="text-sm"
            >
              {texto}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlanoEstudoATA({ feitos, setFeitos }) {
  const toggleFabrica = (secao) => (idx) =>
    setFeitos((prev) => ({
      ...prev,
      [secao]: prev[secao].map((v, i) => (i === idx ? !v : v)),
    }));

  return (
    <CardBase>
      <TituloSecao icon={Target} cor="#D9B36B">Plano de Estudo — ATA</TituloSecao>
      <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5B73" }} className="text-sm mb-1">
        <strong>Objetivo:</strong> {PLANO_ESTUDO_ATA.objective || PLANO_ESTUDO_ATA.objetivo}
      </p>
      <p style={{ color: "#B7A6BF" }} className="text-xs mb-4 italic">Foco hoje, conquista amanhã ✨</p>

      <ListaChecavel titulo="🎯 Foco do dia" itens={PLANO_ESTUDO_ATA.focoDoDia} marcados={feitos.focoDoDia} onToggle={toggleFabrica("focoDoDia")} cor="#D9B36B" />
      <ListaChecavel titulo="📌 Prioridades" itens={PLANO_ESTUDO_ATA.prioridades} marcados={feitos.prioridades} onToggle={toggleFabrica("prioridades")} cor="#C9899E" />
      <ListaChecavel titulo="💫 Hábitos que constroem resultados" itens={PLANO_ESTUDO_ATA.habitos} marcados={feitos.habitos} onToggle={toggleFabrica("habitos")} cor="#8FBF9F" />

      <div style={{ background: "#FDEEF1", borderRadius: 16 }} className="p-3 mt-2">
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#C9899E" }} className="text-xs mb-1">
          Lembrete importante 💗
        </p>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#8A5570" }} className="text-sm">
          {PLANO_ESTUDO_ATA.lembrete}
        </p>
      </div>
    </CardBase>
  );
}

/* ---------- o que estudar (plano semanal) ---------- */

function OQueEstudar({ feitos, setFeitos }) {
  const toggle = (diaIdx, itemIdx) =>
    setFeitos((prev) =>
      prev.map((dia, di) => (di === diaIdx ? dia.map((v, ii) => (ii === itemIdx ? !v : v)) : dia))
    );

  return (
    <CardBase>
      <TituloSecao icon={BookOpen} cor="#8B6B4A">O que Estudar</TituloSecao>
      <p style={{ color: "#B7A6BF" }} className="text-xs mb-3">
        Alternância de matérias para melhor fixação e desempenho 📖
      </p>
      <div className="space-y-3">
        {O_QUE_ESTUDAR.map((dia, di) => {
          const marcados = feitos[di] || [];
          const feito = marcados.filter(Boolean).length;
          return (
            <div key={dia.dia} style={{ background: "#F5EFE6", borderRadius: 16 }} className="p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8B6B4A" }} className="text-sm">
                  {dia.dia}
                </span>
                <span style={{ color: "#B7A08A" }} className="text-xs">{feito}/{dia.itens.length}</span>
              </div>
              <ul className="space-y-1">
                {dia.itens.map((item, ii) => (
                  <li key={ii} className="flex items-center gap-2">
                    <button
                      onClick={() => toggle(di, ii)}
                      style={{ background: marcados[ii] ? "#8B6B4A" : "white", border: "1.5px solid #8B6B4A" }}
                      className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
                    >
                      {marcados[ii] && <Check size={10} color="white" strokeWidth={3} />}
                    </button>
                    <span
                      style={{ fontFamily: "'Nunito', sans-serif", color: marcados[ii] ? "#B7A08A" : "#6B5B47", textDecoration: marcados[ii] ? "line-through" : "none" }}
                      className="text-sm"
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </CardBase>
  );
}

/* ---------- eu sou (afirmações) ---------- */

function EuSou({ favoritos, setFavoritos }) {
  const [fraseDoDia, setFraseDoDia] = useState(EU_SOU[0]);

  const sortear = () => {
    const escolha = EU_SOU[Math.floor(Math.random() * EU_SOU.length)];
    setFraseDoDia(escolha);
  };

  const toggleFav = (item) => {
    setFavoritos((prev) => {
      const novo = new Set(prev);
      novo.has(item) ? novo.delete(item) : novo.add(item);
      return novo;
    });
  };

  return (
    <div>
      <div
        style={{ background: "linear-gradient(135deg,#FDEAF0,#F3EEFB)", borderRadius: 24, border: "1px solid #F0C6DB" }}
        className="p-5 mb-4 text-center"
      >
        <p style={{ color: "#C48AAE" }} className="text-xs mb-1">Frase do dia</p>
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#8A5570" }} className="text-xl mb-3">
          EU SOU {fraseDoDia} 💗
        </p>
        <button
          onClick={sortear}
          style={{ background: "#F0C6DB", color: "#6B3C57" }}
          className="px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
        >
          <Shuffle size={13} /> sortear outra
        </button>
      </div>

      <CardBase>
        <TituloSecao icon={Heart} cor="#E38AA8">Eu Sou</TituloSecao>
        <p style={{ color: "#B7A6BF" }} className="text-xs mb-3">
          Toque no coração para guardar suas favoritas ✨
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {EU_SOU.map((item) => {
            const fav = favoritos.has(item);
            return (
              <button
                key={item}
                onClick={() => toggleFav(item)}
                style={{ background: fav ? "#FDEAF0" : "#FDF6FA", border: fav ? "1px solid #E38AA8" : "1px solid transparent" }}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-left"
              >
                <Heart size={13} color="#E38AA8" fill={fav ? "#E38AA8" : "none"} className="shrink-0" />
                <span style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5B73" }} className="text-xs">
                  eu sou {item}
                </span>
              </button>
            );
          })}
        </div>
      </CardBase>
    </div>
  );
}

/* ---------- delulu milionária ---------- */

function DeluluMilionaria({ feitos, setFeitos }) {
  const toggle = (idx) => setFeitos((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  const reiniciar = () => setFeitos(DELULU_MILIONARIA.map(() => false));
  const feito = feitos.filter(Boolean).length;

  return (
    <CardBase style={{ background: "linear-gradient(180deg,#FFFFFFCC,#FDF0F5CC)" }}>
      <div className="flex items-center justify-between mb-1">
        <TituloSecao icon={Gem} cor="#D9A8C4">Delulu Milionária 👑</TituloSecao>
        <button onClick={reiniciar} style={{ color: "#C9A9BE" }} className="text-xs underline">reiniciar</button>
      </div>
      <p style={{ color: "#B7A6BF" }} className="text-xs mb-3">
        Pequenos rituais para treinar sua energia de abundância
      </p>
      <BarraProgresso feito={feito} total={DELULU_MILIONARIA.length} cor1="#D9A8C4" cor2="#F3D28E" />
      <ul className="space-y-1.5">
        {DELULU_MILIONARIA.map((item, idx) => (
          <li key={idx} style={{ background: "#FDF6FA", borderRadius: 14 }} className="flex items-start gap-2.5 px-3 py-2.5">
            <button
              onClick={() => toggle(idx)}
              style={{ background: feitos[idx] ? "#D9A8C4" : "white", border: "1.5px solid #D9A8C4", marginTop: 2 }}
              className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
            >
              {feitos[idx] && <Check size={10} color="white" strokeWidth={3} />}
            </button>
            <span className="shrink-0">{item.emoji}</span>
            <span
              style={{ fontFamily: "'Nunito', sans-serif", color: feitos[idx] ? "#C9A9BE" : "#6B5B73", textDecoration: feitos[idx] ? "line-through" : "none" }}
              className="text-sm"
            >
              {item.texto}
            </span>
          </li>
        ))}
      </ul>
    </CardBase>
  );
}

/* ---------- oratória & conteúdo de gravação ---------- */

function Oratoria({ feitos, setFeitos, diario, setDiario }) {
  const [temaHoje, setTemaHoje] = useState(null);
  const [aberta, setAberta] = useState(null);

  const toggleEtapa = (idx) => setFeitos((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  const toggleDiario = (idx) => setDiario((prev) => prev.map((v, i) => (i === idx ? !v : v)));

  const sortearTema = () => {
    const cat = CONTEUDO_GRAVACAO[Math.floor(Math.random() * CONTEUDO_GRAVACAO.length)];
    const item = cat.itens[Math.floor(Math.random() * cat.itens.length)];
    setTemaHoje({ categoria: cat.titulo, emoji: cat.emoji, item });
  };

  return (
    <div>
      <CardBase style={{ background: "linear-gradient(135deg,#F1EAFB,#FDEAF0)" }}>
        <TituloSecao icon={Mic} cor="#8B6BC9">Exercícios de Oratória</TituloSecao>
        <p style={{ color: "#9A8AA3" }} className="text-xs mb-3">
          Tudo o que é treinável pode ser transformado ✨
        </p>
        <ul className="space-y-1.5 mb-4">
          {ORATORIA_ETAPAS.map((etapa, idx) => (
            <li key={idx} style={{ background: "#FFFFFFAA", borderRadius: 14 }} className="px-3 py-2.5">
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => toggleEtapa(idx)}
                  style={{ background: feitos[idx] ? "#8B6BC9" : "white", border: "1.5px solid #8B6BC9", marginTop: 2 }}
                  className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
                >
                  {feitos[idx] && <Check size={10} color="white" strokeWidth={3} />}
                </button>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#6B4C8A" }} className="text-sm">
                    Etapa {idx + 1} — {etapa.titulo} {etapa.duracao && `(${etapa.duracao})`}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {etapa.itens.map((it, ii) => (
                      <li key={ii} style={{ fontFamily: "'Nunito', sans-serif", color: "#8A7A93" }} className="text-xs">
                        • {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#6B4C8A" }} className="text-sm mb-1.5">
          Checklist diário ✅
        </p>
        <ul className="space-y-1">
          {CHECKLIST_ORATORIA_DIARIO.map((texto, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <button
                onClick={() => toggleDiario(idx)}
                style={{ background: diario[idx] ? "#8B6BC9" : "white", border: "1.5px solid #8B6BC9" }}
                className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
              >
                {diario[idx] && <Check size={10} color="white" strokeWidth={3} />}
              </button>
              <span
                style={{ fontFamily: "'Nunito', sans-serif", color: diario[idx] ? "#B7A6BF" : "#6B5B73", textDecoration: diario[idx] ? "line-through" : "none" }}
                className="text-sm"
              >
                {texto}
              </span>
            </li>
          ))}
        </ul>
      </CardBase>

      <CardBase>
        <div className="flex items-center justify-between mb-1">
          <TituloSecao icon={Sparkles} cor="#B98CD9">Conteúdo para Gravação</TituloSecao>
        </div>
        <button
          onClick={sortearTema}
          style={{ background: "#B98CD9", color: "white" }}
          className="mb-3 px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
        >
          <Shuffle size={13} /> sortear tema de hoje
        </button>

        {temaHoje && (
          <div style={{ background: "#F3EEFB", borderRadius: 14 }} className="p-3 mb-3">
            <p style={{ color: "#9A6BD9" }} className="text-xs mb-1">
              {temaHoje.emoji} {temaHoje.categoria}
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B4C8A" }} className="text-sm">
              {temaHoje.item}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {CONTEUDO_GRAVACAO.map((cat) => {
            const estaAberta = aberta === cat.titulo;
            return (
              <div key={cat.titulo} style={{ background: "#F9F5FD", borderRadius: 16 }} className="overflow-hidden">
                <button
                  onClick={() => setAberta(estaAberta ? null : cat.titulo)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5"
                >
                  <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#6B4C8A" }} className="text-sm">
                    {cat.emoji} {cat.titulo}
                  </span>
                  <ChevronDown
                    size={16}
                    color="#B98CD9"
                    style={{ transform: estaAberta ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                  />
                </button>
                {estaAberta && (
                  <ul className="px-3.5 pb-3 space-y-1">
                    {cat.itens.map((item, ii) => (
                      <li key={ii} style={{ fontFamily: "'Nunito', sans-serif", color: "#8A7A93" }} className="text-xs">
                        • {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </CardBase>
    </div>
  );
}

/* ---------- estilo Mônica Rodrigues (guia de referência) ---------- */

function BlocoEstilo({ titulo, children, frase }) {
  return (
    <div style={{ background: "#FBF7F1", border: "1px solid #E8DCC8", borderRadius: 18 }} className="p-4 mb-3">
      <p style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#6B4A35" }} className="text-sm mb-2">
        {titulo}
      </p>
      {children}
      {frase && (
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#9A8368", fontStyle: "italic" }} className="text-xs mt-2">
          "{frase}"
        </p>
      )}
    </div>
  );
}

function EstiloMR() {
  return (
    <div>
      <div style={{ background: "#2A211B", borderRadius: 24 }} className="p-5 mb-4 text-center">
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#E8DCC8" }} className="text-lg">
          Estilo Mônica Rodrigues
        </p>
        <p style={{ color: "#B7A98A" }} className="text-xs mt-1">
          disciplina · foco · consistência · elegância · execução
        </p>
      </div>

      <BlocoEstilo titulo="💎 Essência" frase={ESTILO_MR.essenciaFrase}>
        <ul className="space-y-1">
          {ESTILO_MR.essencia.map((it, i) => (
            <li key={i} style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-sm">✓ {it}</li>
          ))}
        </ul>
      </BlocoEstilo>

      <BlocoEstilo titulo="🎨 Paleta de Cores">
        <div className="grid grid-cols-2 gap-2">
          {ESTILO_MR.paleta.map((c) => (
            <div key={c.nome} className="flex items-center gap-2">
              <span style={{ background: c.cor, width: 18, height: 18, borderRadius: 6, border: "1px solid #0002" }} className="shrink-0" />
              <span style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-xs">
                <strong>{c.nome}</strong> — {c.significado}
              </span>
            </div>
          ))}
        </div>
      </BlocoEstilo>

      <BlocoEstilo titulo="👗 Estilo de Roupa" frase={ESTILO_MR.roupaFrase}>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-xs mb-1"><strong>Peças-chave:</strong> {ESTILO_MR.pecasChave.join(" · ")}</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-xs"><strong>Tecidos:</strong> {ESTILO_MR.tecidos}</p>
      </BlocoEstilo>

      <BlocoEstilo titulo="💄 Maquiagem" frase={ESTILO_MR.maquiagemFrase}>
        <ul className="space-y-1">
          {ESTILO_MR.maquiagem.map((it, i) => (
            <li key={i} style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-sm">✓ {it}</li>
          ))}
        </ul>
      </BlocoEstilo>

      <BlocoEstilo titulo="💇 Cabelo" frase={ESTILO_MR.cabeloFrase}>
        <ul className="space-y-1">
          {ESTILO_MR.cabelo.map((it, i) => (
            <li key={i} style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-sm">✓ {it}</li>
          ))}
        </ul>
      </BlocoEstilo>

      <BlocoEstilo titulo="🚶 Linguagem Corporal" frase={ESTILO_MR.corpoFrase}>
        <ul className="space-y-1">
          {ESTILO_MR.corpo.map((it, i) => (
            <li key={i} style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-sm">✓ {it}</li>
          ))}
        </ul>
      </BlocoEstilo>

      <BlocoEstilo titulo="🗣️ Comunicação">
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-xs mb-1"><strong>Tom de voz:</strong> {ESTILO_MR.comunicacaoTom.join(" · ")}</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B5A47" }} className="text-xs mb-2"><strong>Como fala:</strong> {ESTILO_MR.comunicacaoComo.join(" · ")}</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#C46B6B" }} className="text-xs">✗ "{ESTILO_MR.comunicacaoExemplo.evitar}"</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6BA37A" }} className="text-xs">✓ "{ESTILO_MR.comunicacaoExemplo.usar}"</p>
      </BlocoEstilo>
    </div>
  );
}

/* ---------- montagem do app ---------- */

const raizDiv = document.getElementById("root");
const raiz = ReactDOM.createRoot(raizDiv);
raiz.render(<PlannerFofo />);