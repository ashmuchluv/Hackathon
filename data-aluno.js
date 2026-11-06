/* =====================================================
   DADOS DE EXEMPLO DA ÁREA DO ALUNO
   Provisório, igual ao data.js do professor. Depois será
   trocado pela base de dados real.
   ===================================================== */

// Nota mínima para estar "bom" na disciplina
const MEDIA_MINIMA = 6;

/* Alunos. O "ra" é o Registro Acadêmico (login).
   Cada disciplina tem uma LISTA de notas (uma por bimestre);
   a média é calculada pelo código. */
const ALUNOS = [
  { ra: "2026001", senha: "1234", nome: "Ana Beatriz Souza", turma: "7º Ano A", frequencia: 96,
    notas: { "Matemática": [8, 9, 8.5], "Português": [9, 9, 9], "Ciências": [7, 8, 7.5], "História": [8, 8, 8] } },
  { ra: "2026002", senha: "1234", nome: "Bruno Henrique Lima", turma: "7º Ano A", frequencia: 71,
    notas: { "Matemática": [4, 5, 4.5], "Português": [5, 5.5, 4.5], "Ciências": [6, 6, 6], "História": [5, 6, 5.5] } },
  { ra: "2026012", senha: "1234", nome: "Felipe Andrade", turma: "7º Ano B", frequencia: 65,
    notas: { "Matemática": [3, 4, 3.5], "Português": [4, 5, 4.5], "Ciências": [5, 5, 5], "História": [6, 6, 6] } }
];

/* Avisos dos professores. A página lê primeiro do navegador
   (localStorage, chave "avisos"); se não houver nada, usa estes.
   Assim, quando o painel do professor passar a salvar nessa
   mesma chave, os avisos aparecem aqui sozinhos. */
const AVISOS_EXEMPLO = [
  { titulo: "Prova de Matemática", professor: "Prof. Carlos", data: "05/11/2026",
    texto: "A prova será na próxima quinta-feira e vai cobrir frações e porcentagem. Levem calculadora." },
  { titulo: "Entrega do trabalho de História", professor: "Profa. Marina", data: "10/11/2026",
    texto: "O trabalho sobre a Independência do Brasil deve ser entregue até sexta, em grupos de 4 alunos." },
  { titulo: "Reunião de pais", professor: "Coordenação", data: "14/11/2026",
    texto: "Haverá reunião de pais e mestres no sábado, às 9h, no auditório da escola." }
];

/* =====================================================
   CONTEÚDO DO CHAT DE EXEMPLO (a IA de mentira)
   ===================================================== */

// Resumo que a "IA" devolve quando o aluno pede uma explicação
const RESUMOS = {
  "Matemática": "Em frações, para somar é preciso ter o mesmo denominador. Exemplo: 1/2 + 1/4 → transformamos 1/2 em 2/4 e somamos: 2/4 + 1/4 = 3/4. Porcentagem é uma fração de 100: 50% é metade.",
  "Português": "Os substantivos nomeiam seres e coisas; os verbos indicam ações; os advérbios modificam verbos (como 'rapidamente'). Para a leitura, procure sempre a ideia principal de cada parágrafo.",
  "Ciências": "Na fotossíntese, as plantas usam luz do sol, água e gás carbônico para produzir seu alimento e liberar oxigênio. Isso acontece nos cloroplastos, dentro das células.",
  "História": "O Brasil se tornou independente de Portugal em 1822, com D. Pedro I. A República foi proclamada em 1889 por Marechal Deodoro da Fonseca, pondo fim ao Império."
};

// Exercícios: a "IA" sorteia um e confere a resposta digitada
const EXERCICIOS = {
  "Matemática": [
    { pergunta: "Quanto é 3/4 + 1/8?", resposta: "7/8", explicacao: "3/4 vira 6/8, e 6/8 + 1/8 = 7/8." },
    { pergunta: "Quanto é 25% de 80?", resposta: "20", explicacao: "25% é um quarto, e 80 ÷ 4 = 20." }
  ],
  "Português": [
    { pergunta: "Qual é a classe gramatical da palavra 'rapidamente'?", resposta: "advérbio", explicacao: "Ela indica o modo como algo acontece." },
    { pergunta: "Qual é o plural de 'cidadão'?", resposta: "cidadãos", explicacao: "Palavras terminadas em -ão podem fazer plural em -ões, -ães ou -ãos; aqui é -ãos." }
  ],
  "Ciências": [
    { pergunta: "Qual gás as plantas absorvem na fotossíntese?", resposta: "carbônico", explicacao: "É o gás carbônico (CO₂), usado para produzir o alimento da planta." },
    { pergunta: "Em qual parte da célula vegetal acontece a fotossíntese?", resposta: "cloroplasto", explicacao: "Os cloroplastos têm clorofila, que captura a luz do sol." }
  ],
  "História": [
    { pergunta: "Em que ano o Brasil declarou a Independência?", resposta: "1822", explicacao: "Foi em 7 de setembro de 1822, às margens do rio Ipiranga." },
    { pergunta: "Quem proclamou a República do Brasil em 1889?", resposta: "deodoro", explicacao: "Marechal Deodoro da Fonseca liderou a proclamação em 15 de novembro de 1889." }
  ]
};