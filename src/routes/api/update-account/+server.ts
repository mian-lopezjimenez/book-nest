import { json, type RequestHandler } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_ROL_KEY } from "$env/static/private";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "$types/database.types";

export const PATCH: RequestHandler = async ({ request }) => {
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
    const { userName, email } = await request.json();

    const [emailUpdate, userNameUpdate] = await Promise.all([
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        email,
      }),
      await supabaseAdmin
        .from("user_names")
        .update({ name: userName })
        .eq("user_id", userId),
    ]);

    if (emailUpdate.error) {
      return json({ error: "Failed to update email" }, { status: 500 });
    }

    if (userNameUpdate.error) {
      return json({ error: "Failed to update name" }, { status: 500 });
    }

    return json({ message: "Account updated successfully" }, { status: 200 });
  } catch (error) {
    return json({ error: "An unexpected error occurred" }, { status: 500 });
  }
};
