import { Injectable } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class AiService {
  private hf = new HfInference(process.env.HF_TOKEN);

  async generatePlan(story: string) {
    const prompt = `
Return ONLY valid JSON.
Do not use markdown.
Do not use bullet points.
Do not add explanation.
Do not wrap the JSON in backticks.

User idea:
${story}

Return this exact JSON structure:
{
  "projectName": "string",
  "estimatedBudget": "string",
  "difficulty": "string",
  "items": [
    {
      "name": "string",
      "quantity": 1,
      "searchKeyword": "string",
      "reason": "string"
    }
  ]
}
`;

    const response = await this.hf.chatCompletion({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || '';

    console.log('RAW LLM RESPONSE:', content);

    const jsonText = this.extractJson(content);

    return JSON.parse(jsonText);
  }

  private extractJson(text: string) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in LLM response');
    }

    return text.slice(firstBrace, lastBrace + 1);
  }
}