require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())
 
const { PORT } = process.env
 
const funcoes = {
  ObservacaoCriada: async (observacao) => {
    // Adicionando verificação para "urgente"
    if (observacao.texto.toLowerCase().includes('urgente')) {
      observacao.status = 'urgente';
    } else if (observacao.texto.toLowerCase().includes('importante')) {
      observacao.status = 'importante';
    } else {
      observacao.status = 'comum';
    }
    try {
      await axios.post(
        'http://localhost:10000/eventos',
        {
          type: 'ObservacaoClassificada',
          dados: observacao
        }
      )
      console.log(`Observação classificada: ${observacao.status}`);
    } catch (error) {
      console.error("Erro ao enviar observação classificada", error);
    }
  }
}
 
app.post('/eventos', async (req, res) => {
  try {
    if (funcoes[req.body.type]) {
      await funcoes[req.body.type](req.body.dados);
    }
    res.status(200).send({ msg: 'Evento recebido e processado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Erro ao processar evento.' });
  }
})
 
app.listen(PORT, () => {
  console.log(`Serviço de Classificação rodando na porta ${PORT}`);
})