import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_ROL_KEY } from "$env/static/private";
import { type RequestHandler, json } from "@sveltejs/kit";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "$types/database.types";

export const DELETE: RequestHandler = async ({ request }) => {
  const { headers } = request;
  const supabaseAdmin = createClient<Database>(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROL_KEY
  );

  const authHeader = headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data: userData, error: verificationError } =
      await supabaseAdmin.auth.getUser(token);

    if (verificationError || !userData.user) {
      return json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = userData.user.id;

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (deleteError) {
      return json({ error: "Failed to delete user account" }, { status: 500 });
    }

    return json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (error) {
    return json({ error: "An unexpected error occurred" }, { status: 500 });
  }
};
