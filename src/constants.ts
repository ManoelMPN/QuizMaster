export const NOMES_ANIMAIS = [
  "Unicórnio", "Gato", "Cachorro", "Panda", "Leão", "Tigre", "Elefante", "Girafa", "Zebra", "Macaco",
  "Coelho", "Urso", "Pinguim", "Tartaruga", "Jacaré", "Lobo", "Raposa", "Esquilo", "Hamster", "Pássaro",
  "Peixe", "Tubarão", "Baleia", "Polvo", "Caranguejo"
];

export const ADJETIVOS_DIVERTIDOS = [
  "Azarado", "Preguiçoso", "Sabichão", "Esquecido", "Bagunceiro", "Sonolento", "Aplicado", "Desesperado", "Criativo", "Nerd",
  "Filósofo", "Matemático", "Literário", "Científico", "Histórico", "Geográfico", "Artístico", "Esportivo", "Tecnológico", "Poliglota",
  "Genial", "Saltitante", "Risonho", "Curioso", "Veloz"
];

export const ICONES_DIVERTIDOS = [
  "🚀", "🌈", "🍕", "🍦", "🎮", "🎸", "🎨", "📚", "🔬", "🧠",
  "⚡", "🔥", "💎", "🍀", "🍄", "🐱", "🐶", "🦊", "🦁", "🐼",
  "🐨", "🐙", "🦄", "🦖", "🛸"
];

export function gerarPersonaUnica(usados: Set<string>) {
  let persona = "";
  let tentativa = 0;
  while (tentativa < 1000) {
    const nome = NOMES_ANIMAIS[Math.floor(Math.random() * NOMES_ANIMAIS.length)];
    const adjetivo = ADJETIVOS_DIVERTIDOS[Math.floor(Math.random() * ADJETIVOS_DIVERTIDOS.length)];
    const icone = ICONES_DIVERTIDOS[Math.floor(Math.random() * ICONES_DIVERTIDOS.length)];
    persona = `${icone} ${nome} ${adjetivo}`;
    if (!usados.has(persona)) break;
    tentativa++;
  }
  return persona;
}
