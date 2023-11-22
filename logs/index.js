require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
 
const app = express();
app.use(express.json());
 
const logFilePath = './event-log.json';
 
const eventos = [];
 
app.post('/eventos', async (req, res) => {
  const evento = req.body;
  eventos.push(evento);
  console.log(evento);
  try {
    const logs = JSON.parse(await fs.readFile(logFilePath));
    logs.push(evento);
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
    res.status(201).send({ msg: 'Evento registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar evento', error);
    res.status(500).send({ msg: 'Erro ao processar evento.' });
  }
});
 
app.get('/logs', async (req, res) => {
  try {
    const logs = await fs.readFile(logFilePath, 'utf8');
    res.status(200).send(JSON.parse(logs));
  } catch (error) {
    console.error('Erro ao recuperar logs', error);
    res.status(500).send({ msg: 'Erro ao recuperar logs.' });
  }
});
 
app.listen(process.env.PORT, () => {
  console.log(`Logs service rodando na porta ${process.env.PORT}`);
});