"use client";

import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Image from "next/image";
import { Anton, Great_Vibes } from "next/font/google";
/* ------------------------------------------------------------------ */
/* Conteúdo (troque pelos textos reais da empresa)                     */
/* -----------------------------------------

------------------------- */


const display = Anton({ weight: "400", subsets: ["latin"] });
const script = Great_Vibes({ weight: "400", subsets: ["latin"] });


const TEXTO_GIGANTE = "PROJETISTA";
const NOME_EMPRESA = "HsolarCivil";



const numeros = [
  { valor: "3+", rotulo: "Anos de experiência" },
  { valor: "40+", rotulo: "Projetos entregues" },
  { valor: "20+", rotulo: "Clientes satisfeitos" },
];

const links = [
  { href: "#o-que-projetamos", label: "O que projetamos" },
  { href: "#projetos", label: "Projetos" },
  { href: "#diferencial", label: "Diferencial" },
  { href: "#automacoes", label: "Automações" },
  { href: "#sobre", label: "Sobre nós" },
];

const servicos = [
  {
    titulo: "Projetos sob medida",
    texto: "Descreva aqui o primeiro serviço em uma ou duas frases.",
  },
  {
    titulo: "Integração de sistemas",
    texto: "Descreva aqui o segundo serviço em uma ou duas frases.",
  },
  {
    titulo: "Planejamento e consultoria",
    texto: "Descreva aqui o terceiro serviço em uma ou duas frases.",
  },
  {
    titulo: "Suporte e evolução",
    texto: "Descreva aqui o quarto serviço em uma ou duas frases.",
  },
];

type Projeto = {
  titulo: string;
  categoria: string;
  texto: string;
};

// Troque por uma lista com os projetos reais, no mesmo formato.
// Aqui geramos 20 projetos de exemplo só para você ver a paginação funcionando.
const projetos: Projeto[] = Array.from({ length: 20 }, (_, i) => ({
  titulo: `Projeto ${String(i + 1).padStart(2, "0")}`,
  categoria: "Categoria",
  texto: "Resumo curto do projeto, do desafio e do resultado entregue.",
}));

const PROJETOS_POR_PAGINA = 9;

const diferenciais = [
  {
    titulo: "Atendimento próximo",
    texto: "Explique como o cliente é acompanhado em cada etapa.",
  },
  {
    titulo: "Soluções personalizadas",
    texto: "Explique por que cada projeto é pensado do zero para o cliente.",
  },
  {
    titulo: "Tecnologia atual",
    texto: "Explique quais tecnologias e padrões a empresa utiliza.",
  },
  {
    titulo: "Prazo e transparência",
    texto: "Explique como funcionam prazos, entregas e comunicação.",
  },
];

const beneficios = [
  "Menos tarefas manuais e repetitivas",
  "Processos conectados entre si",
  "Mais controle e visibilidade do que acontece",
  "Escala sem aumentar a complexidade",
];

const pilares = [
  { titulo: "Missão", texto: "Escreva aqui a missão da empresa." },
  { titulo: "Visão", texto: "Escreva aqui a visão da empresa." },
  { titulo: "Valores", texto: "Escreva aqui os valores da empresa." },
];

/* ------------------------------------------------------------------ */
/* Tema: cada seção escolhe um "tom" e as cores vêm daqui              */
/*   light = fundo branco  | dark = fundo preto | brand = fundo laranja */
/* ------------------------------------------------------------------ */

type Tone = "light" | "dark" | "brand";

const tones: Record<
  Tone,
  { section: string; eyebrow: string; description: string }
> = {
  light: {
    section: "bg-white text-neutral-950",
    eyebrow: "text-orange-700",
    description: "text-neutral-600",
  },
  dark: {
    section: "bg-neutral-950 text-white",
    eyebrow: "text-orange-500",
    description: "text-neutral-400",
  },
  brand: {
    section: "bg-orange-500 text-neutral-950",
    eyebrow: "text-neutral-950",
    description: "text-neutral-900",
  },
};

// Cards das seções de fundo branco e de fundo preto
const cardClaro =
  "rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-orange-500";
const cardEscuro =
  "overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-colors hover:border-orange-500";

/* ------------------------------------------------------------------ */
/* Pedaço reutilizável: define espaçamento, container e título         */
/* de cada seção, para não repetir isso oito vezes.                    */
/* ------------------------------------------------------------------ */

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: Tone;
}) {
  const estilo = tones[tone];

  return (
    // scroll-mt-20 compensa a altura do header fixo ao navegar pelos links (#id)
    <section
      id={id}
      className={`scroll-mt-20 px-6 py-20 md:py-28 ${estilo.section}`}
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p
            className={`text-sm font-medium uppercase tracking-widest ${estilo.eyebrow}`}
          >
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className={`mt-4 text-lg ${estilo.description}`}>
              {description}
            </p>
          )}
        </header>
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}

// Campos do formulário (ficam sobre o fundo laranja)
const campo =
  "w-full rounded-lg border border-neutral-950/20 bg-white px-4 py-3 text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950";

/* ------------------------------------------------------------------ */
/* Projetos paginados: cada página é uma "fatia" horizontal            */
/* ------------------------------------------------------------------ */

// Divide uma lista em páginas.
// Ex.: [1, 2, 3, 4, 5] em páginas de 2 -> [[1, 2], [3, 4], [5]]
function dividirEmPaginas<T>(lista: T[], tamanho: number): T[][] {
  const paginas: T[][] = [];
  for (let i = 0; i < lista.length; i += tamanho) {
    paginas.push(lista.slice(i, i + tamanho));
  }
  return paginas;
}

const botaoSeta =
  "flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 text-white trPansition-colors hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-700 disabled:hover:text-white";

function ProjetosPaginados({ projetos }: { projetos: Projeto[] }) {
  // ref = acesso direto ao elemento HTML (precisamos dele para rolar)
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);

  const paginas = dividirEmPaginas(projetos, PROJETOS_POR_PAGINA);
  const ultimaPagina = paginas.length - 1;

  // Roda enquanto o usuário rola na horizontal: descobre em qual página está.
  function aoRolar() {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    setPaginaAtual(Math.round(trilho.scrollLeft / trilho.clientWidth));
  }

  // Rola suavemente até o início da página escolhida.
  function irParaPagina(indice: number) {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    trilho.scrollTo({ left: indice * trilho.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      {/* Trilho: as páginas ficam lado a lado e só a rolagem HORIZONTAL
          acontece aqui dentro, então a rolagem vertical do site não é afetada.
          snap-x + snap-mandatory fazem a rolagem "encaixar" em cada página. */}
      <div
        ref={trilhoRef}
        onScroll={aoRolar}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {paginas.map((pagina, indice) => (
          <div
            key={indice}
            role="group"
            aria-label={`Página ${indice + 1} de ${paginas.length}`}
            className="grid w-full shrink-0 snap-start snap-always content-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {pagina.map((projeto) => (
              <article key={projeto.titulo} className={cardEscuro}>
                {/* Espaço reservado para a imagem do projeto */}
                <div className="aspect-video bg-gradient-to-br from-orange-500/30 to-neutral-900" />
                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-widest text-orange-500">
                    {projeto.categoria}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{projeto.titulo}</h3>
                  <p className="mt-3 text-neutral-400">{projeto.texto}</p>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>

      {/* Controles: só aparecem se houver mais de uma página */}
      {paginas.length > 1 && (
        <nav
          aria-label="Paginação dos projetos"
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          <button
            type="button"
            onClick={() => irParaPagina(paginaAtual - 1)}
            disabled={paginaAtual === 0}
            aria-label="Página anterior"
            className={botaoSeta}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <div className="flex items-center">
            {paginas.map((_, indice) => (
              <button
                key={indice}
                type="button"
                onClick={() => irParaPagina(indice)}
                aria-label={`Ir para a página ${indice + 1}`}
                aria-current={indice === paginaAtual ? "page" : undefined}
                className="p-2"
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    indice === paginaAtual
                      ? "w-6 bg-orange-500"
                      : "w-2 bg-neutral-700 hover:bg-neutral-500"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => irParaPagina(paginaAtual + 1)}
            disabled={paginaAtual === ultimaPagina}
            aria-label="Próxima página"
            className={botaoSeta}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <p aria-live="polite" className="w-full text-center text-sm text-neutral-400">
            Página {paginaAtual + 1} de {paginas.length}
          </p>
        </nav>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section
      id="apresentacao"
      className="relative isolate scroll-mt-20 overflow-hidden bg-black pt-8 md:pt-0"
    >
      {/* 1) Texto gigante ao fundo, com degradê que some para baixo */}
      <p
        aria-hidden="true"
        className={`${display.className} pointer-events-none absolute inset-x-0 top-4 select-none whitespace-nowrap bg-gradient-to-b from-orange-600 via-orange-700/70 to-transparent bg-clip-text text-center text-[20vw] leading-none text-transparent md:top-6`}
      >
        {TEXTO_GIGANTE}
      </p>

      {/* 2) Foto recortada: no celular fica no fluxo da página;
             no desktop vai para o centro, por cima do texto gigante */}
      <div className="relative z-10 mx-auto mt-6 h-[55vh] w-fit md:absolute md:bottom-0 md:left-1/2 md:mx-0 md:mt-0 md:h-[94%] md:-translate-x-1/2">
        <Image
          src="/henrique.png"
          alt={`Responsável pela ${NOME_EMPRESA}`}
          width={900}
          height={1200}
          priority
          className="h-full w-auto [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
        />
      </div>

      {/* 3) Conteúdo: três colunas no desktop (texto | espaço da foto | números) */}
      <div className="relative z-20 mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-10 md:min-h-[calc(100svh-4rem)] md:grid-cols-3 md:items-end md:pt-0">
        {/* Esquerda */}
        <div className="md:pb-8">
          <p className={`${script.className} text-3xl text-orange-500 md:text-4xl`}>
            Olá, eu sou
          </p>
          <h1
            className={`${display.className} mt-2 text-5xl uppercase leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-8xl`}
          >
            Antônio
            <br/>
            Henrique
          </h1>
          <p
            className={`${display.className} mt-5 text-xl uppercase tracking-wide text-orange-500 md:text-2xl`}
          >
            Engenheiro civil &amp; projetista
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
            Escreva aqui uma frase curta explicando o que a empresa faz e qual
            problema resolve para o cliente.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#orcamento"
              className="rounded-full bg-orange-500 px-7 py-3 font-semibold text-neutral-950 transition-colors hover:bg-orange-400"
            >
              Solicitar orçamento
            </a>
            <a
              href="#projetos"
              className="rounded-full border border-neutral-600 px-7 py-3 font-medium text-white transition-colors hover:border-orange-500 hover:text-orange-500"
            >
              Ver projetos
            </a>
          </div>
        </div>

        {/* Meio: vazio no desktop, é onde a foto aparece */}
        <div aria-hidden="true" className="hidden md:block" />

        {/* Direita: selo no topo, números embaixo */}
        <aside className="flex flex-col gap-10 md:self-stretch md:justify-between md:pb-8 md:pt-24">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-orange-500/60">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-orange-500"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
              </svg>
            </span>
            <p className="max-w-[10rem] text-sm leading-snug text-neutral-300">
              Transformando ideias em projetos de alto desempenho.
            </p>
          </div>

          <ul className="divide-y divide-neutral-800 border-t border-neutral-800">
            {numeros.map((item) => (
              <li key={item.rotulo} className="flex items-center gap-5 py-4">
                <span className={`${display.className} w-24 text-5xl text-orange-500`}>
                  {item.valor}
                </span>
                <span className="text-xs uppercase tracking-widest text-neutral-400">
                  {item.rotulo}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);

  function enviarOrcamento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: enviar os dados para um Route Handler (app/api/orcamento/route.ts)
    const dados = Object.fromEntries(new FormData(event.currentTarget));
    console.log(dados);
  }

  return (
    <div className="bg-neutral-950 text-white">
      {/* ============================ HEADER ============================ */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/90 text-white backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#apresentacao" aria-label={NOME_EMPRESA}>
            <Image
              src="/hsolarcivil.png"
              alt={NOME_EMPRESA}
              width={160}
              height={40}
              priority
              className="h-13 w-auto bg-black"
            />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-300 transition-colors hover:text-orange-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#orcamento"
            className="hidden rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400 md:inline-block"
          >
            Solicitar orçamento
          </a>

          <button
            type="button"
            className="md:hidden"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuAberto ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {menuAberto && (
          <nav className="border-t border-neutral-800 px-6 py-4 md:hidden">
            <ul className="flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuAberto(false)}
                    className="block text-neutral-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#orcamento"
                  onClick={() => setMenuAberto(false)}
                  className="inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-neutral-950"
                >
                  Solicitar orçamento
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* ========================= APRESENTAÇÃO (preto) ================= */}
<Hero />
        {/* ======================= O QUE PROJETAMOS (branco) ============== */}
        <Section
          id="o-que-projetamos"
          eyebrow="O que projetamos"
          title="Do planejamento à entrega"
          description="Uma visão geral dos tipos de projeto que desenvolvemos."
          tone="light"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicos.map((servico) => (
              <article key={servico.titulo} className={cardClaro}>
                <h3 className="text-lg font-semibold">{servico.titulo}</h3>
                <p className="mt-3 text-neutral-600">{servico.texto}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ======================= PROJETOS NOSSOS (preto) ================ */}
        <Section
          id="projetos"
          eyebrow="Projetos nossos"
          title="Trabalhos que já entregamos"
          description="Uma seleção de projetos que mostram como trabalhamos."
          tone="dark"
        >
          <ProjetosPaginados projetos={projetos} />
        </Section>

        {/* =========================== DIFERENCIAL (branco) =============== */}
        <Section
          id="diferencial"
          eyebrow="Diferencial"
          title="Por que escolher a gente"
          tone="light"
        >
          <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {diferenciais.map((item, index) => (
              <li key={item.titulo} className="flex gap-5">
                <span className="text-3xl font-semibold text-orange-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{item.titulo}</h3>
                  <p className="mt-2 text-neutral-600">{item.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ================ AUTOMAÇÕES INTELIGENTES (preto) =============== */}
        <Section
          id="automacoes"
          eyebrow="Automações inteligentes"
          title="Deixe a tecnologia trabalhar por você"
          description="Explique aqui, em poucas linhas, como as automações funcionam e o que mudam na rotina do cliente."
          tone="dark"
        >
          <div className="grid items-center gap-12 md:grid-cols-2">
            <ul className="space-y-4">
              {beneficios.map((beneficio) => (
                <li key={beneficio} className="flex items-start gap-3">
                  <svg
                    className="mt-1 shrink-0 text-orange-500"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  <span className="text-lg text-neutral-200">{beneficio}</span>
                </li>
              ))}
            </ul>

            {/* Espaço reservado para uma imagem ou ilustração */}
            <div className="aspect-[4/3] rounded-2xl border border-neutral-800 bg-gradient-to-br from-orange-500/30 to-neutral-900" />
          </div>
        </Section>

        {/* ============================ SOBRE NÓS (branco) ================ */}
        <Section
          id="sobre"
          eyebrow="Sobre nós"
          title="Quem está por trás dos projetos"
          tone="light"
        >
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-4 text-lg text-neutral-600">
              <p>
                Conte aqui a história da empresa: como começou, quem faz parte e
                o que motiva o trabalho de vocês.
              </p>
              <p>
                Um segundo parágrafo pode falar da forma de trabalhar e do que o
                cliente pode esperar na parceria.
              </p>
            </div>

            <dl className="space-y-6">
              {pilares.map((pilar) => (
                <div
                  key={pilar.titulo}
                  className="border-l-2 border-orange-500 pl-5"
                >
                  <dt className="font-semibold">{pilar.titulo}</dt>
                  <dd className="mt-1 text-neutral-600">{pilar.texto}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        {/* ================= SOLICITE SEU ORÇAMENTO (laranja) ============= */}
        <Section
          id="orcamento"
          eyebrow="Solicite seu orçamento"
          title="Vamos conversar sobre o seu projeto"
          description="Preencha o formulário e retornamos o contato o mais rápido possível."
          tone="brand"
        >
          <form onSubmit={enviarOrcamento} className="grid max-w-2xl gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Nome
                <input name="nome" type="text" required className={campo} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                E-mail
                <input name="email" type="email" required className={campo} />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Telefone / WhatsApp
                <input name="telefone" type="tel" className={campo} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Tipo de projeto
                <select name="tipo" defaultValue="" className={campo}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="projeto">Projeto sob medida</option>
                  <option value="automacao">Automação inteligente</option>
                  <option value="integracao">Integração de sistemas</option>
                  <option value="outro">Outro</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Conte sobre o que você precisa
              <textarea name="mensagem" rows={5} required className={campo} />
            </label>

            <button
              type="submit"
              className="justify-self-start rounded-full bg-neutral-950 px-8 py-3 font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Enviar solicitação
            </button>
          </form>
        </Section>
      </main>
    </div>
  );
}