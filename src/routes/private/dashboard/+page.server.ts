// import type { PageServerLoad } from "./$types";
// import * as db from "$db";

// type LoadData = {
//   books: Book[];
// };

// export const load: PageServerLoad = async ({
//   locals: { supabase, session },
// }): Promise<LoadData> => {
//   const { user } = session ?? { user: null };
//   let books: Book[] = [];

//   if (!user || !supabase) {
//     return { books };
//   }

//   const { data, error } = await db.getBooks(supabase, user.id);

//   if (error) {
//     console.error(`Error fetching books: ${error.message}`);
//     return { books };
//   }

//   if (data) {
//     books = data;
//   }

//   return { books };
// };
