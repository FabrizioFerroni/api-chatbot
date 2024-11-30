import { configApp } from '@/config/app/config.app';
import { Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';
import { ModelsResponseDto } from '../dto/response/models.response.dto';
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from 'groq-sdk/resources/chat/completions';
import { NewChatDto } from '../dto/newchat.dto';

@Injectable()
export class IaService {
  private chatHistory: ChatCompletionMessageParam[] = [];

  private readonly logger = new Logger(IaService.name, {
    timestamp: true,
  });

  groq = new Groq({ apiKey: configApp().groqApiKey });

  /**
   * Retrieves a list of available AI models from the Groq API.
   *
   * @returns A Promise that resolves to an array of ModelsResponseDto objects,
   *          each representing an available AI model. If no models are found,
   *          an empty array is returned.
   *
   * @remarks
   * This function sends a request to the Groq API to retrieve a list of available
   * AI models. It then processes the response, maps the model data to ModelsResponseDto
   * objects, and returns the array of ModelsResponseDto objects.
   */
  async getModels() {
    this.logger.log('Getting models');
    const { data } = await this.groq.models.list();

    if (data.length === 0) {
      return [];
    }

    const response: ModelsResponseDto[] = [];

    data.forEach((model) => {
      const dto = new ModelsResponseDto();
      dto.owner = model.owned_by;
      dto.name = model.id;
      dto.type = model.object;
      response.push(dto);
    });

    return response;
  }

  /**
   * Processes a new chat message using the specified AI model and generates a response.
   *
   * @param dto - The NewChatDto containing the model and message to be processed.
   * @returns A Promise that resolves to the AI-generated response as a string.
   *
   * @remarks
   * This function takes a NewChatDto as input, which contains the AI model and the user's message.
   * It then pushes the user's message to the chat history, creates a ChatCompletionCreateParamsNonStreaming
   * body with the chat history and the specified model, and sends a request to the Groq API to generate
   * a response. The AI-generated response is then pushed to the chat history and returned as a Promise.
   */
  async chatCompletions(dto: NewChatDto) {
    const { model, message } = dto;

    this.chatHistory.push({
      role: 'user',
      content: message,
    });

    const body: ChatCompletionCreateParamsNonStreaming = {
      messages: this.chatHistory,
      model: model,
    };

    const chatCompletion = await this.groq.chat.completions.create(body);

    this.logger.log('Generatin chat');

    const aiResponse =
      chatCompletion.choices[0].message.content || 'No hubo respuesta';

    this.chatHistory.push({
      role: 'assistant',
      content: aiResponse,
    });

    return aiResponse;
  }
}
