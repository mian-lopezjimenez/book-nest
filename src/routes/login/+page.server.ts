import { fail, redirect, type Actions } from "@sveltejs/kit";

import { Status } from "$types/enums";
import { PUBLIC_FRONTEND_URL } from "$env/static/public";

interface ResponseObject {
  email: string;
  errors: string[];
  name?: never;
  password: string;
  passwordConfirmation?: never;
  status: Status;
}

export const actions: Actions = {
  signInWithPassword: async ({ request, locals: { supabase } }) => {
    const formData: FormData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const responseObject: ResponseObject = {
      status: Status.OK,
      errors: [],
      email,
      password,
    };

    if (!email) {
      responseObject.errors.push("Email is required");
    }

    if (!password) {
      responseObject.errors.push("Password is required");
    }

    if (responseObject.errors.length > 0) {
      responseObject.status = Status.BAD_REQUEST;

      return responseObject;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.log(`There has been an error: ${error}`);
      responseObject.status = Status.SERVER_ERROR;
      return fail(400, responseObject as any);
    }

    redirect(303, "/private/dashboard");
  },
  googleLogin: async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${PUBLIC_FRONTEND_URL}/auth/callback`,
      },
    });

    if (error) {
      return fail(400, { message: "Something when wrong with Google login" });
    }

    redirect(303, data.url);
  },
};
