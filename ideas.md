# Ideias de Design - Painel Admin Gênesis

## Contexto
Painel administrativo para plataforma de análise de criptoativos com IA (Gemini 3.0), incluindo gestão de parâmetros, custos operacionais, métricas de receita e configurações de créditos.

---

<response>
<text>
**Design Movement**: Cyberpunk Neon Noir

**Core Principles**:
- Contraste extremo entre escuridão profunda e neon vibrante
- Hierarquia visual através de brilho e saturação, não apenas tamanho
- Elementos de interface que simulam displays holográficos e terminais futuristas
- Assimetria calculada com grid quebrado intencionalmente

**Color Philosophy**: 
Paleta baseada em néon sobre preto absoluto (#000000 ou #0a0a0f). Cores primárias: ciano elétrico (#00f0ff), verde limão (#39ff14), magenta (#ff00ff), roxo profundo (#8b00ff). Vermelho (#ff0040) para alertas. Amarelo ácido (#ffff00) para destaques críticos. Uso de gradientes lineares entre ciano-magenta e verde-ciano para criar profundidade.

**Layout Paradigm**: 
Dashboard assimétrico com sidebar fixa à esquerda (200px), conteúdo principal em grid fluido de 12 colunas com quebras intencionais. Cards flutuantes com bordas neon e sombras coloridas (box-shadow com blur alto). Seções com ângulos diagonais usando clip-path para criar sensação de profundidade 3D.

**Signature Elements**:
- Bordas neon animadas com efeito de "scan line" pulsante
- Tipografia monospace para números e dados técnicos (JetBrains Mono)
- Ícones com efeito de glitch sutil ao hover
- Background com grid de linhas finas (#ffffff10) e noise texture

**Interaction Philosophy**: 
Micro-animações rápidas (150-250ms) com easing cubic-bezier(0.4, 0, 0.2, 1). Hover states com glow effect (filter: drop-shadow). Transições de página com fade + slide lateral. Inputs com borda que acende em neon ao focus.

**Animation**: 
Entrada de cards com stagger de 50ms usando opacity + translateY. Números animam com counter effect. Gráficos desenham com animation-delay progressivo. Pulse animation em elementos críticos (2s infinite).

**Typography System**: 
Display: Orbitron Bold (títulos, 24-48px, tracking wide, uppercase)
Body: Inter Regular/Medium (parágrafos, 14-16px)
Mono: JetBrains Mono (dados, códigos, 12-14px)
Hierarquia: peso + cor neon, não apenas tamanho
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Design Movement**: Glassmorphism Tech

**Core Principles**:
- Transparência e blur para criar camadas de profundidade
- Bordas suaves com backdrop-filter para efeito de vidro fosco
- Iluminação ambiente com gradientes sutis e reflexos
- Minimalismo funcional com foco em legibilidade

**Color Philosophy**: 
Base escura com tons de azul profundo (#0f1419, #1a1f2e). Acentos em azul elétrico (#0ea5e9), verde água (#06b6d4), roxo suave (#8b5cf6). Uso de gradientes radiais para simular iluminação. Transparência em 60-80% para cards principais.

**Layout Paradigm**: 
Grid simétrico 4x3 com gaps generosos (24px). Cards com backdrop-blur-xl e border-opacity baixa. Sidebar translúcida que se sobrepõe ao conteúdo. Header fixo com blur effect. Conteúdo organizado em seções bem definidas com separadores sutis.

**Signature Elements**:
- Cards com background rgba(255,255,255,0.05) e backdrop-filter blur(20px)
- Bordas com gradiente sutil (border-image-source)
- Sombras coloridas suaves (0 8px 32px rgba(0,0,0,0.3))
- Ícones com stroke fino e fill gradiente

**Interaction Philosophy**: 
Transições suaves e orgânicas (300-400ms ease-out). Hover eleva cards com transform translateY(-4px) e aumenta blur. Click adiciona ripple effect. Estados de loading com skeleton screens translúcidos.

**Animation**: 
Fade-in com scale(0.95) to scale(1) na entrada. Gráficos animam com draw effect (stroke-dasharray). Números contam progressivamente. Parallax sutil no scroll (transform translateY).

**Typography System**: 
Display: Poppins SemiBold (títulos, 28-56px, tracking normal)
Body: Inter Regular (parágrafos, 15-17px, line-height 1.6)
Mono: Fira Code (dados técnicos, 13-15px)
Hierarquia: contraste de peso + opacity (0.6 para secundário)
</text>
<probability>0.07</probability>
</response>

<response>
<text>
**Design Movement**: Brutalist Data Terminal

**Core Principles**:
- Funcionalidade crua sem ornamentação desnecessária
- Tipografia massiva e pesada como elemento estrutural
- Contraste extremo preto/branco com acentos de cor mínimos
- Grid rígido e modular exposto visualmente

**Color Philosophy**: 
Base em preto puro (#000000) e branco (#ffffff). Acentos em verde terminal (#00ff41) para sucesso, vermelho (#ff0000) para erros, amarelo (#ffff00) para warnings. Sem gradientes - apenas cores sólidas. Uso de inversão (background preto com texto branco, ou vice-versa) para criar hierarquia.

**Layout Paradigm**: 
Grid exposto com linhas de guia visíveis (1px solid #333). Layout em blocos retangulares sem border-radius. Sidebar com largura fixa 240px. Conteúdo em colunas de largura igual. Sem espaçamento suave - tudo alinhado ao grid de 8px.

**Signature Elements**:
- Bordas grossas (3-5px) em elementos interativos
- Tipografia gigante para títulos (64-96px, uppercase, weight 900)
- Tabelas com linhas alternadas (#0a0a0a / #000000)
- Botões quadrados sem radius com hover state invertido

**Interaction Philosophy**: 
Sem animações suaves - transições instantâneas ou muito rápidas (50ms). Hover inverte cores (background ↔ foreground). Click adiciona borda grossa temporária. Estados binários - sem intermediários.

**Animation**: 
Entrada instantânea ou com fade rápido (100ms linear). Gráficos aparecem de uma vez, sem draw animation. Números atualizam sem counter effect. Scroll sem smooth behavior.

**Typography System**: 
Display: Space Grotesk Black (títulos, 48-96px, uppercase, tracking tight)
Body: IBM Plex Mono Regular (todo texto, 14-16px, line-height 1.4)
Mono: IBM Plex Mono Bold (destaque, 14-16px)
Hierarquia: tamanho + inversão de cor, peso constante
</text>
<probability>0.09</probability>
</response>

---

## Escolha Final: **Cyberpunk Neon Noir**

Este estilo reflete perfeitamente a natureza tecnológica e futurista da plataforma Gênesis, criando uma experiência visual imersiva que remete a terminais de trading avançados e interfaces de ficção científica. O contraste entre o preto profundo e os neons vibrantes garante legibilidade enquanto mantém a estética cyberpunk desejada.
