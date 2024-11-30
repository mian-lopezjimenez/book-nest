import { getContext, setContext } from "svelte";
import { goto } from "$app/navigation";

import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "$types/database.types";

interface Props {
  session: Session | null;
  supabase: SupabaseClient | null;
  user: User | null;
}

export class UserState {
  session = $state<Session | null>(null);
  supabase = $state<SupabaseClient<Database> | null>(null);
  user = $state<User | null>(null);
  books = $state<Book[]>([]);
  userName = $state<string | null>(null);

  constructor({ session, supabase, user }: Props) {
    this.updateState({ session, supabase, user });
  }

  getState() {
    return { session: this.session, supabase: this.supabase, user: this.user };
  }

  updateState({ session, supabase, user }: Props) {
    this.session = session;
    this.supabase = supabase;
    this.user = user;
    this.fetchUserData();
  }

  async fetchUserData() {
    if (!this.user || !this.supabase) return;

    const { id } = this.user;

    const [books, names] = await Promise.all([
      this.supabase.from("books").select("*").eq("user_id", id),
      this.supabase
        .from("user_names")
        .select("name")
        .eq("user_id", id)
        .single(),
    ]);

    if (books.error) {
      console.error(`Error fetching books: ${books.error.message}`);
      return;
    }

    if (names.error) {
      console.error(`Error fetching names: ${names.error.message}`);
      return;
    }

    if (!books.data || !names.data) {
      return;
    }

    this.books = books.data;
    this.userName = names.data.name;
  }

  getHighestRatedBooks() {
    return this.books
      .filter(({ rating }) => rating)
      .toSorted((a, b) => b.rating! - a.rating!)
      .slice(0, 10);
  }

  getUnreadBooks() {
    return this.books
      .filter(({ started_reading_on }) => !started_reading_on)
      .toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10);
  }

  getCurrentlyReadingBooks() {
    return this.books
      .filter(
        ({ finished_reading_on, started_reading_on }) =>
          !finished_reading_on && started_reading_on
      )
      .toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10);
  }

  getFavoriteGenre() {
    if (this.books.filter((book) => book.genre).length === 0) return "";

    const genreCounts: { [key: string]: number } = {};

    this.books.forEach(({ genre }) => {
      const genres = genre ? genre.split(",") : [];

      genres.forEach((genre) => {
        const trimmedGenre = genre.trim();

        if (trimmedGenre) {
          genreCounts[trimmedGenre] = (genreCounts[trimmedGenre] || 0) + 1;
        }
      });
    });

    const mostCommonGenre = Object.keys(genreCounts).reduce((a, b) => {
      return genreCounts[a] > genreCounts[b] ? a : b;
    });

    return mostCommonGenre || "";
  }

  getBooksFromFavoriteGenre() {
    const mostCommonGenre = this.getFavoriteGenre();

    return this.books
      .filter((book) => book.genre?.includes(mostCommonGenre))
      .toSorted((a, z) => {
        const ratingA = a.rating || 0;
        const ratingZ = z.rating || 0;
        return ratingZ - ratingA;
      });
  }

  async updateBook({
    id,
    updateObject,
  }: {
    id: number;
    updateObject: UpdatableBookFields;
  }) {
    if (!this.supabase) return;

    const { status, error } = await this.supabase
      .from("books")
      .update(updateObject)
      .eq("id", id);

    if (status === 204 && !error) {
      this.books = this.books.map((book) => {
        if (book.id === id) {
          return { ...book, ...updateObject };
        }

        return book;
      });
    }
  }

  async uploadBookCover({ bookId, file }: { bookId: number; file: File }) {
    if (!this.supabase) return;

    if (!this.user) return;

    const filePath = `${this.user.id}/${new Date().getTime()}-${file.name}`;

    const { error } = await this.supabase.storage
      .from("book-covers")
      .upload(filePath, file);

    if (error) {
      console.error(`Error uploading book cover: ${error.message}`);
      return;
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from("book-covers").getPublicUrl(filePath);

    await this.updateBook({
      id: bookId,
      updateObject: { cover_image: publicUrl },
    });

    return publicUrl;
  }

  async deleteBookFromLibrary(bookId: number) {
    if (!this.supabase) return;

    const { status, error } = await this.supabase
      .from("books")
      .delete()
      .eq("id", bookId);

    if (status === 204 && !error) {
      this.books = this.books.filter((book) => book.id !== bookId);
    }

    goto("/private/dashboard");
  }

  async addBookToLibrary(booksToAdd: OpenAIBook[]) {
    const { user, supabase } = this;

    if (!supabase || !user) return;

    const processedBooks = booksToAdd.map((book) => {
      const { author, bookTitle } = book;

      return {
        title: bookTitle,
        author,
        user_id: user.id,
      };
    });

    const { error: insertError } = await supabase
      .from("books")
      .insert(processedBooks);

    if (insertError) {
      throw new Error(insertError.message);
    }

    const { data: newBooks, error: fetchError } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    this.books = newBooks;
  }

  async updateAccountData({
    email,
    userName,
  }: {
    email: string;
    userName: string;
  }) {
    if (!this.session) return;

    try {
      const response = await fetch("/api/update-account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.session.access_token}`,
        },
        body: JSON.stringify({ email, userName }),
      });

      if (response.ok) {
        this.userName = userName;

        if (this.user) {
          this.user.email = email;
        }
      }
    } catch (error) {
      console.log("Failed to update account.");
    }
  }

  async deleteAccount() {
    if (!this.session) return;

    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.session.access_token}`,
        },
      });

      if (response.ok) {
        await this.logout();
        goto("/");
      }
    } catch (error) {
      console.log("Failed to delete account.");
    }
  }

  async logout() {
    await this.supabase?.auth.signOut();
    goto("/login");
  }
}

const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: Props) {
  return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
  return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}
