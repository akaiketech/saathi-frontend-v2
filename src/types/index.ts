export interface Question {
  hindiText: string;
  englishText: string;
  kannadaText: string;
  tamilText: string;
  audio: string;
}

export interface Message {
  question: Question;
  answer: string;
  isLoading: boolean;
}

export type QueryReqBody = {
  conversation_id: string;
  query_id: string;
  english_query: string;
  conversation_location: string;
  conversation_language: string;
  user_audio?: string;
  language_query?: string;
};
