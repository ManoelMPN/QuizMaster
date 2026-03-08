export const NOMES_BASE = [
  "Capivara", "Quokka", "Axolote", "Panda", "Gato", "Cachorro", "Lobo", "Raposa", "Leão", "Tigre",
  "Urso", "Coelho", "Esquilo", "Pinguim", "Coruja", "Águia", "Falcão", "Tubarão", "Baleia", "Golfinho",
  "Tartaruga", "Jacaré", "Dragão", "Fênix", "Unicórnio", "Grifo", "Pégaso", "Dinossauro", "Mamute", "Preguiça",
  "Suricato", "Lêmure", "Guaxinim", "Texugo", "Alce", "Cervo", "Búfalo", "Elefante", "Girafa", "Zebra",
  "Hipopótamo", "Rinoceronte", "Gorila", "Chimpanzé", "Orangotango", "Canguru", "Coala", "Ornitorrinco", "Ema", "Avestruz",
  "Panda-Vermelho", "Lontra", "Castor", "Esquilo-Voador", "Morcego", "Vagalume", "Borboleta", "Libélula", "Escorpião", "Aranha"
];

export const APELIDOS_DIVERTIDOS = [
  "Ninja", "Espacial", "Galáctico", "Cibernético", "Místico", "Lendário", "Veloz", "Furioso", "Sábio", "Mestre",
  "Guerreiro", "Explorador", "Viajante", "Guardião", "Sentinela", "Vigilante", "Protetor", "Defensor", "Campeão", "Herói",
  "Vilão", "Pirata", "Viking", "Samurai", "Cavaleiro", "Mago", "Feiticeiro", "Alquimista", "Cientista", "Inventor",
  "Artista", "Músico", "Poeta", "Escritor", "Sonhador", "Visionário", "Líder", "Rei", "Rainha", "Príncipe",
  "Princesa", "Duque", "Barão", "Lorde", "Soberano", "Imortal", "Eterno", "Infinito", "Cosmos", "Estelar",
  "Super", "Mega", "Ultra", "Hyper", "Cyber", "Neo", "Retro", "Alpha", "Omega", "Zeta"
];

export const ICONES_DIVERTIDOS = [
  "🐾", "🦊", "🐱", "🐶", "🦁", "🐯", "🐼", "🐨", "🐻", "🐰",
  "🐹", "🐭", "🐸", "🐲", "🦖", "🐙", "🦑", "🦀", "🐡", "🐠",
  "🐬", "🐳", "🦈", "🐊", "🐢", "🦎", "🐍", "🐉", "🦄", "🐝",
  "🦋", "🐞", "🐜", "🕷️", "🦂", "🦟", "🦠", "🧬", "🧪", "🔬",
  "🔭", "📡", "🛰️", "🛸", "🚀", "🌌", "🪐", "🌍", "🌙", "☀️",
  "⚡", "🔥", "💧", "🌱", "🌈", "❄️", "🌪️", "🌋", "☄️", "✨"
];

export function gerarPersonaUnica(usados: Set<string>) {
  let persona = "";
  let tentativa = 0;
  // 50 nomes * 50 apelidos * 50 ícones = 125.000 combinações
  while (tentativa < 2000) {
    const nome = NOMES_BASE[Math.floor(Math.random() * NOMES_BASE.length)];
    const apelido = APELIDOS_DIVERTIDOS[Math.floor(Math.random() * APELIDOS_DIVERTIDOS.length)];
    const icone = ICONES_DIVERTIDOS[Math.floor(Math.random() * ICONES_DIVERTIDOS.length)];
    persona = `${icone} ${nome} ${apelido}`;
    if (!usados.has(persona)) break;
    tentativa++;
  }
  return persona;
}
