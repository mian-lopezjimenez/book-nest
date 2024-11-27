import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "$types/database.types";

const getBooks = async (
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: Book[] | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(`Error fetching books: ${error.message}`);
  }

  return { data, error };
};

export { getBooks };
