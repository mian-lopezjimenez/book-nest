import { fail, redirect, type Actions } from "@sveltejs/kit";

import { Status } from "$types/enums";

interface ResponseObject {
  email: string;
  errors: string[];
  name?: never;
  password: string;
  passwordConfirmation?: never;
  status: Status;
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
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
};
