type ButtonVariant = "primary" | "secondary" | "danger" | "menu";

interface Book {
  author: string | null;
  cover_image: string | null;
  created_at: string;
  description: string | null;
  finished_reading_on: string | null;
  genre: string | null;
  id: number;
  rating: number | null;
  started_reading_on: string | null;
  title: string;
  user_id: string;
}

interface OpenAIBook {
  bookTitle: string;
  author: string;
}

type UpdatableBookFields = Partial<Omit<Book, "id" | "user_id" | "created_at">>;
