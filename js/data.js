/* =====================================================
   DADOS DE EXEMPLO
   Este arquivo é a "base de dados" provisória. Cada turma tem
   uma lista de alunos, e cada aluno tem matrícula, frequência (%)
   e um objeto "notas" com UMA entrada por disciplina.

   Para adicionar disciplinas, basta escrever mais uma linha em
   "notas" — a tela se ajusta sozinha.
   Depois você pode trocar tudo isso pela importação de planilha
   (botão "Importar planilha (CSV)") ou por um servidor/banco real.
   ===================================================== */

// Login do professor (apenas para demonstração!)
const PROFESSOR = { usuario: "professor", senha: "1234" };

const DADOS_EXEMPLO = [
  {
    id: "7A", nome: "7º Ano A",
    alunos: [
      { matricula: "2026001", nome: "Ana Beatriz Souza",  frequencia: 96, notas: { "Matemática": 8.5, "Português": 9.0, "Ciências": 7.5, "História": 8.0 } },
      { matricula: "2026002", nome: "Bruno Henrique Lima", frequencia: 71, notas: { "Matemática": 4.5, "Português": 5.0, "Ciências": 6.0, "História": 5.5 } },
      { matricula: "2026003", nome: "Carla Mendes",        frequencia: 88, notas: { "Matemática": 6.5, "Português": 7.0, "Ciências": 8.0, "História": 7.5 } },
      { matricula: "2026004", nome: "Diego Ferreira",      frequencia: 93, notas: { "Matemática": 9.5, "Português": 8.0, "Ciências": 9.0, "História": 8.5 } }
    ]
  },
  {
    id: "7B", nome: "7º Ano B",
    alunos: [
      { matricula: "2026011", nome: "Eduarda Rocha",   frequencia: 90, notas: { "Matemática": 7.0, "Português": 6.5, "Ciências": 7.5, "História": 7.0 } },
      { matricula: "2026012", nome: "Felipe Andrade",  frequencia: 65, notas: { "Matemática": 3.5, "Português": 4.5, "Ciências": 5.0, "História": 6.0 } },
      { matricula: "2026013", nome: "Gabriela Nunes",  frequencia: 98, notas: { "Matemática": 9.0, "Português": 9.5, "Ciências": 9.0, "História": 9.5 } }
    ]
  },
  {
    id: "8A", nome: "8º Ano A",
    alunos: [
      { matricula: "2026021", nome: "Heitor Barbosa",  frequencia: 84, notas: { "Matemática": 5.5, "Português": 6.0, "Ciências": 6.5, "História": 7.0 } },
      { matricula: "2026022", nome: "Isabela Martins", frequencia: 92, notas: { "Matemática": 8.0, "Português": 8.5, "Ciências": 8.0, "História": 9.0 } },
      { matricula: "2026023", nome: "João Pedro Alves", frequencia: 77, notas: { "Matemática": 6.0, "Português": 4.0, "Ciências": 5.5, "História": 6.0 } }
    ]
  }
];