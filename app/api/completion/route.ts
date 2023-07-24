import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { log } from 'console';
 
// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
let previous_promt:ChatCompletionRequestMessage[] = [{
    role:"system", content:"You are an almost evil AI. Answer the questions but in the most annoying way possible."
}];
 let p2 = "";
export async function POST(req: Request) {
    const { prompt } = await req.json();

    previous_promt = [...previous_promt, {
        role: "user", content: prompt
    }]

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    temperature: 0.5,
    messages:previous_promt
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}