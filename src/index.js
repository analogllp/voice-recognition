import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const { PORT, OPENAI_API_KEY } = process.env;

const port = PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/get-response', async function(req, res) {
  const { text = '' } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Informe o texto' });
  }

  const config = new Configuration({ apiKey: OPENAI_API_KEY });
  const openAi = new OpenAIApi(config);

  const completion = await openAi.createCompletion({
    model: 'text-davinci-003',
    prompt: `Retorne uma lista de palavras chaves separadas por vírgula com base no texto: ${text}`,
    temperature: 0.5,
    max_tokens: 60
  });
  const [choice] = completion.data ? completion.data.choices : [];
  const keywords = choice ? choice.text : '';

  return res.json({ keywords });
});

app.listen(port, () => {
  console.log(`Server is running...`);
});
