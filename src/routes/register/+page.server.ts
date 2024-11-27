import { fail, redirect, type Actions } from "@sveltejs/kit";

import { Status } from "$types/enums";

interface ResponseObject {
  status: Status;
  errors: string[];
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData: FormData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;

    const responseObject: ResponseObject = {
      status: Status.OK,
      errors: [],
      name,
      email,
      password,
      passwordConfirmation,
    };

    if (!name) {
      responseObject.errors.push("Name is required");
    }

    if (name.length <= 2) {
      responseObject.errors.push("Name must be at least 3 characters long");
    }

    if (!email) {
      responseObject.errors.push("Email is required");
    }

    if (!password) {
      responseObject.errors.push("Password is required");
    }

    if (password !== passwordConfirmation) {
      responseObject.errors.push("Passwords do not match");
    }

    if (responseObject.errors.length > 0) {
      responseObject.status = Status.BAD_REQUEST;

      return responseObject;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.log(`There has been an error: ${error}`);
      responseObject.status = Status.SERVER_ERROR;
      return fail(400, responseObject as any);
    }

    const userId = data.user.id;

    await supabase.from("user_names").insert([
      {
        user_id: userId,
        name,
      },
    ]);

    redirect(303, "/private/dashboard");
  },
};
