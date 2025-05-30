export type Question = {
  id: string;
  question: string;
  explain?: string;
  options: {
    id: string;
    option_text: string;
    correct?: boolean;
  }[];
};

export type Submission = {
  id: string;
  user_id: string;
  exam_id: string;
  status: string;
  questions: string[];
  created_at: string;
  updated_at: string;
};
