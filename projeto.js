const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();

// Middleware para permitir acesso apenas entre 08:00 e 17:00
app.use((req, res, next) => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 8 || hour >= 17) {
    res.status(403).send('Acesso não permitido fora do horário de expediente (08:00 - 17:00).');
  } else {
    next();
  }
});

// Middleware para fazer o parsing do corpo das requisições
app.use(bodyParser.json());

// Array simulando um banco de dados
let laboratorios = [
  { nome: 'Laboratório 1', capacidade: 20, descricao: 'Laboratório para análises químicas.' },
  { nome: 'Laboratório 2', capacidade: 15, descricao: 'Laboratório para experimentos biológicos.' },
  { nome: 'Laboratório 3', capacidade: 25, descricao: 'Laboratório de física experimental.' },
  { nome: 'Laboratório 4', capacidade: 18, descricao: 'Laboratório de informática.' },
  { nome: 'Laboratório 5', capacidade: 22, descricao: 'Laboratório de engenharia elétrica.' },
  { nome: 'Laboratório 6', capacidade: 30, descricao: 'Laboratório de robótica.' }
];

// Rota GET para obter todos os laboratórios
app.get('/laboratorio/todos', (req, res) => {
  res.json(laboratorios);
});

// Rota POST para cadastrar um novo laboratório
app.post('/laboratorio/novo', (req, res) => {
  const novoLaboratorio = req.body;
  laboratorios.push(novoLaboratorio);
  res.status(201).send('Laboratório cadastrado com sucesso.');
});

// Rota GET para gerar o relatório em PDF
app.get('/laboratorio/relatorio', (req, res) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('relatorio_laboratorios.pdf'));

  doc.fontSize(16).text('Relatório de Laboratórios', { align: 'center' }).moveDown();

  laboratorios.forEach(laboratorio => {
    doc.fontSize(12).text(`Nome: ${laboratorio.nome}`);
    doc.fontSize(12).text(`Capacidade: ${laboratorio.capacidade}`);
    doc.fontSize(12).text(`Descrição: ${laboratorio.descricao}`).moveDown();
  });

  doc.end();

  res.download('relatorio_laboratorios.pdf', 'relatorio_laboratorios.pdf', (err) => {
    if (err) {
      console.error('Erro ao fazer o download do relatório:', err);
    } else {
      console.log('Relatório gerado com sucesso.');
      fs.unlinkSync('relatorio_laboratorios.pdf');
    }
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
