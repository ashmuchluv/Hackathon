/* =====================================================
   LÓGICA DO SISTEMA
   Organização deste arquivo:
   1. Atalhos e estado
   2. Funções utilitárias
   3. Login
   4. Turmas e alunos (desenhar na tela)
   5. Importação de planilha CSV
   ===================================================== */

/* ---------- 1. ATALHOS E ESTADO ---------- */
const $ = (id) => document.getElementById(id);   // atalho para document.getElementById

// "estado" guarda o que está selecionado no momento
const estado = {
  turmas: carregarTurmas(),   // lista de turmas (vem do navegador ou dos dados de exemplo)
  turma: null,                // turma selecionada
  aluno: null                 // aluno selecionado
};

/* ---------- 2. FUNÇÕES UTILITÁRIAS ---------- */

// Cria um elemento HTML com classe e texto.
// Usar textContent (em vez de innerHTML) evita que texto de planilha quebre a página.
function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

// Troca de tela: esconde todas e mostra só a pedida
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach((t) => t.classList.remove("ativa"));
  $(id).classList.add("ativa");
}

// Média das notas de um aluno
function media(aluno) {
  const valores = Object.values(aluno.notas);
  if (valores.length === 0) return 0;
  return valores.reduce((soma, n) => soma + n, 0) / valores.length;
}

// Lê as turmas salvas no navegador; se não houver, usa os dados de exemplo
function carregarTurmas() {
  try {
    const salvo = localStorage.getItem("turmas");
    if (salvo) return JSON.parse(salvo);
  } catch (e) { /* ignora e usa o exemplo */ }
  return DADOS_EXEMPLO;
}

/* ---------- 3. LOGIN ---------- */
$("form-login").addEventListener("submit", (evento) => {
  evento.preventDefault();   // impede a página de recarregar

  const ok = $("usuario").value.trim() === PROFESSOR.usuario &&
             $("senha").value === PROFESSOR.senha;

  if (!ok) {
    $("erro-login").textContent = "Usuário ou senha incorretos.";
    return;
  }
  $("erro-login").textContent = "";
  mostrarTela("tela-turmas");
  desenharTurmas();
});

$("btn-sair").addEventListener("click", () => {
  $("form-login").reset();
  mostrarTela("tela-login");
});

/* ---------- 4. TURMAS E ALUNOS ---------- */

// Desenha os botões de turma na barra lateral
function desenharTurmas() {
  const nav = $("lista-turmas");
  nav.replaceChildren();   // limpa antes de desenhar

  estado.turmas.forEach((turma) => {
    const botao = el("button", "item-turma", turma.nome);
    if (turma === estado.turma) botao.classList.add("ativo");
    botao.addEventListener("click", () => selecionarTurma(turma));
    nav.appendChild(botao);
  });
}

function selecionarTurma(turma) {
  estado.turma = turma;
  estado.aluno = null;

  $("titulo-turma").textContent = turma.nome;
  $("resumo-turma").textContent = `${turma.alunos.length} alunos`;
  $("detalhe-aluno").replaceChildren(el("p", "vazio", "Escolha um aluno para ver as informações."));

  desenharTurmas();   // atualiza qual turma está destacada
  desenharAlunos();
}

// Lista de alunos da turma selecionada
function desenharAlunos() {
  const lista = $("lista-alunos");
  lista.replaceChildren();

  estado.turma.alunos.forEach((aluno) => {
    const item = el("li");
    const botao = el("button", "item-aluno");
    botao.append(el("span", "", aluno.nome), el("small", "", `Matrícula ${aluno.matricula}`));
    if (aluno === estado.aluno) botao.classList.add("ativo");
    botao.addEventListener("click", () => selecionarAluno(aluno));
    item.appendChild(botao);
    lista.appendChild(item);
  });
}

function selecionarAluno(aluno) {
  estado.aluno = aluno;
  desenharAlunos();   // atualiza o destaque na lista
  desenharDetalhe(aluno);
}

// Painel com as informações do aluno
function desenharDetalhe(aluno) {
  const painel = $("detalhe-aluno");
  painel.replaceChildren();

  const m = media(aluno);

  // Regra simples só para a demo: média < 6 ou frequência < 75% = atenção.
  // É aqui que, no futuro, entraria a análise da Inteligência Artificial.
  const emAtencao = m < 6 || aluno.frequencia < 75;

  const indicadores = el("div", "indicadores");
  indicadores.append(
    el("span", "chip", `Frequência ${aluno.frequencia}%`),
    el("span", "chip", `Média ${m.toFixed(1)}`),
    el("span", "chip " + (emAtencao ? "atencao" : "ok"),
       emAtencao ? "Atenção: possível dificuldade" : "Acompanhamento em dia")
  );

  painel.append(
    el("h3", "", aluno.nome),
    el("p", "matricula", `Matrícula ${aluno.matricula}`),
    indicadores
  );

  // Uma linha por disciplina, com barra proporcional à nota
  Object.entries(aluno.notas).forEach(([disciplina, nota]) => {
    const linha = el("div", "nota");
    const barra = el("div", "barra");
    const preenchimento = el("span", nota < 6 ? "baixa" : "");
    preenchimento.style.width = `${nota * 10}%`;
    barra.appendChild(preenchimento);
    linha.append(el("span", "", disciplina), barra, el("b", "", nota.toFixed(1)));
    painel.appendChild(linha);
  });
}

/* ---------- 5. IMPORTAÇÃO DE PLANILHA (CSV) ----------
   Formato esperado (veja modelo.csv):
   turma;matricula;nome;frequencia;Matemática;Português;...
   - As 4 primeiras colunas são fixas.
   - Da 5ª coluna em diante, cada coluna é uma disciplina (qualquer quantidade).
   - Funciona com ; (Excel em português) ou , como separador.
*/
function csvParaTurmas(texto) {
  const linhas = texto.trim().split(/\r?\n/).filter((l) => l.trim());
  const separador = linhas[0].includes(";") ? ";" : ",";
  const cabecalho = linhas[0].split(separador).map((c) => c.trim());
  const disciplinas = cabecalho.slice(4);

  const porTurma = {};   // agrupa os alunos pelo nome da turma

  linhas.slice(1).forEach((linha) => {
    const col = linha.split(separador).map((c) => c.trim());
    const [turma, matricula, nome, freq] = col;
    if (!turma || !nome) return;   // ignora linhas incompletas

    porTurma[turma] ??= { id: turma, nome: turma, alunos: [] };

    const notas = {};
    disciplinas.forEach((disciplina, i) => {
      const n = parseFloat((col[4 + i] || "").replace(",", "."));
      if (!isNaN(n)) notas[disciplina] = n;
    });

    porTurma[turma].alunos.push({
      matricula,
      nome,
      frequencia: parseFloat((freq || "").replace(",", ".")) || 0,
      notas
    });
  });

  return Object.values(porTurma);
}

$("arquivo-csv").addEventListener("change", async (evento) => {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  const turmas = csvParaTurmas(await arquivo.text());
  if (turmas.length === 0) {
    alert("Não encontrei alunos na planilha. Confira se segue o modelo.csv.");
    return;
  }

  estado.turmas = turmas;
  estado.turma = null;
  estado.aluno = null;
  try { localStorage.setItem("turmas", JSON.stringify(turmas)); } catch (e) { /* sem salvar */ }

  $("titulo-turma").textContent = "Selecione uma turma";
  $("resumo-turma").textContent = "";
  $("lista-alunos").replaceChildren();
  desenharTurmas();
  evento.target.value = "";   // permite importar o mesmo arquivo de novo
});