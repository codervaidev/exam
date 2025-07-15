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


export type User = {
  id: string;
  name: string;
  phone: string;
  district: string;
  thana: string;
  institute: string;
  role: string;
  level: string;
};


export type Session = {
  id: string;
  user_id: string;
  expires_at: Date;
};