export interface Question {
  hindiText: string;
  englishText: string;
  kannadaText: string;
  tamilText: string;
  audio: string;
}

export interface Message {
  id: string;
  question: Question;
  answer: string;
  isLoading: boolean;
  vote: 1 | 0 | -1;
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

export interface Conversation {
  conversation_id: string;
  conversation_title: string;
  conversation_location: string;
  conversation_language: string;
  created_at: string;
  // Add other properties as needed
}

