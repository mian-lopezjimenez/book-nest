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
