import { fail, redirect, type Actions } from "@sveltejs/kit";

import { createClient } from "@supabase/supabase-js";

import { Status } from "$types/enums";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";

interface ResponseObject {
  status: Status;
  errors: string[];
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

    redirect(303, "/private/dashboard");
  },
};
