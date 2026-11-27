export type KnowledgeTopic = string;
export type KnowledgeEntry = {
  id: string;
  topic: string;
  question: string;
  answer: string;
  keywords?: string[];
  link?: { label: string; href: string };
};
export type KnowledgeTopicRow = { id: string; slug: string; name: string; description: string; sort: number };
export type IntakeQuestion = { key: string; text: string; required: boolean };
export type IntakeForm = { reference: string; service_key: string | null; questions: IntakeQuestion[] };