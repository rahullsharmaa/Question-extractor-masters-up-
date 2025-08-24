export interface Exam {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  exam_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id?: string;
  question_type: string;
  question_statement: string;
  options?: string[];
  answer?: string;
  solution?: string;
  course_id: string;
  year?: number;
  slot?: string;
  part?: string;
  correct_marks?: number;
  incorrect_marks?: number;
  skipped_marks?: number;
  partial_marks?: number;
  time_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionTypeConfig {
  correctMarks: number;
  incorrectMarks: number;
  skippedMarks: number;
  partialMarks: number;
  timeMinutes: number;
}

export interface QuestionTypeSettings {
  [key: string]: QuestionTypeConfig;
}

export type QuestionType = 'MCQ' | 'MSQ' | 'NAT' | 'Subjective';