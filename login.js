/* =====================================================
   LOGIN ÚNICO (aluno ou professor)
   Este arquivo só cuida da tela de login: confere os dados
   e entrega a pessoa para a área certa.
     - Professor → window.entrarProfessor()  (definida no professor.js)
     - Aluno     → window.entrarAluno(aluno) (definida no aluno.js)
   ===================================================== */
(() => {

const $ = (id) => document.getElementById(id);

let tipo = "aluno";   // quem está tentando entrar: "aluno" ou "professor"

function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach((t) => t.classList.remove("ativa"));
  $(id).classList.add("ativa");
}

// Troca entre Aluno e Professor: muda o destaque, o texto do campo e a dica
function escolherTipo(novo) {
  tipo = novo;

  document.querySelectorAll(".seletor .opcao").forEach((b) => {
    b.classList.toggle("ativo", b.dataset.tipo === tipo);
  });
  document.querySelectorAll(".dica[data-para]").forEach((p) => {
    p.hidden = p.dataset.para !== tipo;   // mostra só a dica do tipo escolhido
  });

  $("usuario").placeholder = tipo === "aluno" ? "RA (Registro Acadêmico)" : "Usuário";
  $("usuario").inputMode = tipo === "aluno" ? "numeric" : "text";
  $("form-login").reset();
  $("erro-login").textContent = "";
  $("usuario").focus();
}

document.querySelectorAll(".seletor .opcao").forEach((botao) => {
  botao.addEventListener("click", () => escolherTipo(botao.dataset.tipo));
});

// Confere usuário/RA e senha, e abre a área correspondente
$("form-login").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const usuario = $("usuario").value.trim();
  const senha = $("senha").value;

  if (tipo === "professor") {
    if (usuario === PROFESSOR.usuario && senha === PROFESSOR.senha) {
      limparLogin();
      window.entrarProfessor();
      return;
    }
  } else {
    const aluno = ALUNOS.find((a) => a.ra === usuario && a.senha === senha);
    if (aluno) {
      limparLogin();
      window.entrarAluno(aluno);
      return;
    }
  }

  $("erro-login").textContent = tipo === "aluno" ? "RA ou senha incorretos." : "Usuário ou senha incorretos.";
});

function limparLogin() {
  $("form-login").reset();
  $("erro-login").textContent = "";
}

// Os botões "Sair" das duas áreas chamam esta função
window.voltarAoLogin = function () {
  limparLogin();
  mostrarTela("tela-login");
};

})();
