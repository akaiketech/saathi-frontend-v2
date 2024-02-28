export interface Question {
  hindiText: string;
  englishText: string;
  audio: string;
}

export interface Message {
  question: Question;
  answer: string;
  isLoading: boolean;
}

