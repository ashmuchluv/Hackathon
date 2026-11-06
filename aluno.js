/* =====================================================
   LÓGICA DA ÁREA DO ALUNO
   Tudo fica dentro de (() => { ... })(), assim as funções
   daqui não "brigam" com as do app.js do professor quando
   os dois sites forem juntados na mesma página.

   Organização:
   1. Atalhos, estado e utilitários
   2. Entrada, saída e menu
   3. Avisos
   4. Notas
   5. Chat com IA (fake)
   ===================================================== */
(() => {

/* ---------- 1. ATALHOS, ESTADO E UTILITÁRIOS ---------- */
const $ = (id) => document.getElementById(id);

const estado = {
  aluno: null,        // aluno logado
  disciplina: null,   // disciplina aberta no chat
  conversas: {},      // mensagens de cada disciplina: { "Matemática": [ {de, texto}, ... ] }
  pendente: {}        // exercício que a IA está esperando o aluno responder
};

// Cria um elemento HTML com classe e texto (textContent evita injeção de HTML)
function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach((t) => t.classList.remove("ativa"));
  $(id).classList.add("ativa");
}

// Média de uma lista de notas
function media(notas) {
  return notas.reduce((soma, n) => soma + n, 0) / notas.length;
}

/* ---------- 2. ENTRADA, SAÍDA E MENU ---------- */
// Chamada pelo login.js depois de conferir RA e senha
window.entrarAluno = function (aluno) {
  estado.aluno = aluno;
  estado.disciplina = null;
  estado.conversas = {};
  estado.pendente = {};

  $("ola").textContent = `Olá, ${aluno.nome.split(" ")[0]}`;
  mostrarTela("tela-aluno");
  mostrarSecao("avisos");
};

$("btn-sair-aluno").addEventListener("click", () => {
  estado.aluno = null;
  window.voltarAoLogin();
});

// Cada botão do menu tem data-secao="avisos" | "notas" | "chat"
document.querySelectorAll(".item-menu").forEach((botao) => {
  botao.addEventListener("click", () => mostrarSecao(botao.dataset.secao));
});

// Mostra só a seção pedida, destaca o botão do menu e desenha o conteúdo
function mostrarSecao(nome) {
  document.querySelectorAll(".secao").forEach((s) => s.classList.remove("ativa"));
  $("secao-" + nome).classList.add("ativa");
  document.querySelectorAll(".item-menu").forEach((b) => {
    b.classList.toggle("ativo", b.dataset.secao === nome);
  });

  if (nome === "avisos") desenharAvisos();
  if (nome === "notas") desenharNotas();
  if (nome === "chat") desenharChat();
}

/* ---------- 3. AVISOS ---------- */
function lerAvisos() {
  try {
    const salvo = localStorage.getItem("avisos");   // o painel do professor pode salvar aqui
    if (salvo) return JSON.parse(salvo);
  } catch (e) { /* usa os de exemplo */ }
  return AVISOS_EXEMPLO;
}

function desenharAvisos() {
  const lista = $("lista-avisos");
  lista.replaceChildren();

  const avisos = lerAvisos();
  if (avisos.length === 0) {
    lista.appendChild(el("p", "dica", "Nenhum aviso por enquanto."));
    return;
  }

  avisos.forEach((aviso) => {
    const cartao = el("article", "cartao");
    cartao.append(
      el("h3", "", aviso.titulo),
      el("p", "meta", `${aviso.professor} · ${aviso.data}`),
      el("p", "texto", aviso.texto)
    );
    lista.appendChild(cartao);
  });
}

/* ---------- 4. NOTAS ---------- */
function desenharNotas() {
  const aluno = estado.aluno;
  const lista = $("lista-notas");
  lista.replaceChildren();

  const medias = Object.values(aluno.notas).map(media);
  const geral = medias.reduce((s, m) => s + m, 0) / medias.length;
  $("resumo-notas").textContent = `Frequência ${aluno.frequencia}% · Média geral ${geral.toFixed(1)}`;

  // Um cartão por disciplina
  Object.entries(aluno.notas).forEach(([disciplina, notas]) => {
    const m = media(notas);
    const bom = m >= MEDIA_MINIMA;

    const topo = el("div", "cartao-topo");
    topo.append(el("h3", "", disciplina), el("span", "chip " + (bom ? "ok" : "atencao"), bom ? "Bom" : "Abaixo da média"));

    const barra = el("div", "barra");
    const preenchimento = el("span", bom ? "" : "baixa");
    preenchimento.style.width = `${m * 10}%`;
    barra.appendChild(preenchimento);

    const linhaMedia = el("div", "nota");
    linhaMedia.append(el("span", "", "Média"), barra, el("b", "", m.toFixed(1)));

    const cartao = el("article", "cartao");
    cartao.append(
      topo,
      el("p", "notas-linha", notas.map((n, i) => `${i + 1}º bim: ${n.toFixed(1)}`).join("  ·  ")),
      linhaMedia
    );
    lista.appendChild(cartao);
  });
}

/* ---------- 5. CHAT COM IA (FAKE) ---------- */

// Botões de disciplina: só liberadas as que estão abaixo da média
function desenharChat() {
  const barra = $("disciplinas-chat");
  barra.replaceChildren();
  let liberadas = 0;

  Object.entries(estado.aluno.notas).forEach(([disciplina, notas]) => {
    const liberada = media(notas) < MEDIA_MINIMA;
    const botao = el("button", "chip-disc", disciplina);
    botao.disabled = !liberada;

    if (liberada) {
      liberadas++;
      if (disciplina === estado.disciplina) botao.classList.add("ativo");
      botao.addEventListener("click", () => abrirConversa(disciplina));
    } else {
      botao.title = "Liberada só para disciplinas abaixo da média";
    }
    barra.appendChild(botao);
  });

  $("aviso-chat").textContent = liberadas > 0
    ? "Escolha uma disciplina para estudar. Só ficam liberadas as que estão abaixo da média."
    : "Parabéns! Todas as suas notas estão acima da média, então nenhuma disciplina precisa de reforço agora.";

  $("area-chat").hidden = !estado.disciplina;
  desenharMensagens();
}

function abrirConversa(disciplina) {
  estado.disciplina = disciplina;

  // Primeira vez nessa disciplina: a IA cumprimenta
  if (!estado.conversas[disciplina]) {
    const nome = estado.aluno.nome.split(" ")[0];
    estado.conversas[disciplina] = [{
      de: "ia",
      texto: `Oi, ${nome}! Vamos reforçar ${disciplina}? Posso explicar o conteúdo, passar um exercício ou tirar suas dúvidas.`
    }];
  }
  desenharChat();
  $("texto-chat").focus();
}

function desenharMensagens(digitando = false) {
  const caixa = $("mensagens");
  caixa.replaceChildren();
  if (!estado.disciplina) return;

  estado.conversas[estado.disciplina].forEach((m) => caixa.appendChild(el("div", "msg " + m.de, m.texto)));
  if (digitando) caixa.appendChild(el("div", "msg ia digitando", "digitando..."));
  caixa.scrollTop = caixa.scrollHeight;   // rola até a última mensagem
}

// Envia a mensagem do aluno e espera a resposta da IA
async function enviar(texto) {
  texto = texto.trim();
  const disciplina = estado.disciplina;
  if (!texto || !disciplina) return;

  estado.conversas[disciplina].push({ de: "eu", texto });
  desenharMensagens(true);

  const resposta = await responderIA(disciplina, texto);

  estado.conversas[disciplina].push({ de: "ia", texto: resposta });
  if (estado.disciplina === disciplina) desenharMensagens();
}

$("form-chat").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const texto = $("texto-chat").value;
  $("texto-chat").value = "";
  enviar(texto);
});

// Os botões de atalho enviam um texto pronto
document.querySelectorAll(".sugestoes button").forEach((botao) => {
  botao.addEventListener("click", () => enviar(botao.dataset.texto));
});

/* ---------------------------------------------------
   A "IA" DE MENTIRA
   Esta é a ÚNICA função que precisa mudar quando entrar
   uma IA de verdade: ela recebe a disciplina e a mensagem
   do aluno e devolve o texto da resposta.
   --------------------------------------------------- */
async function responderIA(disciplina, mensagem) {
  await new Promise((resolve) => setTimeout(resolve, 800));   // simula o tempo de "pensar"
  const t = mensagem.toLowerCase();

  // 1. Se a IA tinha passado um exercício, confere a resposta do aluno
  const pendente = estado.pendente[disciplina];
  if (pendente) {
    delete estado.pendente[disciplina];
    return t.includes(pendente.resposta.toLowerCase())
      ? `Isso mesmo! ${pendente.explicacao} Quer tentar outro exercício?`
      : `Quase lá! A resposta é ${pendente.resposta}. ${pendente.explicacao} Quer tentar outro?`;
  }

  // 2. Pedido de exercício: sorteia um da lista da disciplina
  if (/exerc|ativid|prati|outro|quero|\bsim\b/.test(t)) {
    const lista = EXERCICIOS[disciplina];
    const exercicio = lista[Math.floor(Math.random() * lista.length)];
    estado.pendente[disciplina] = exercicio;
    return `Vamos praticar! ${exercicio.pergunta}`;
  }

  // 3. Pedido de explicação
  if (/explic|conte[uú]do|resum|aprender/.test(t)) return RESUMOS[disciplina];

  // 4. Dúvida
  if (/d[uú]vida|n[aã]o entendi|como/.test(t)) {
    return "Claro! Me conte qual parte ficou confusa e eu explico passo a passo.";
  }

  // 5. Qualquer outra coisa
  return "Entendi! (Esta é uma resposta de exemplo; aqui a IA de verdade vai responder.) Você pode pedir uma explicação, um exercício ou contar sua dúvida.";
}

})();