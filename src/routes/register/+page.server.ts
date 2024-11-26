import { type Actions } from "@sveltejs/kit";

import { Status } from "$types/enums";

interface ResponseObject {
  status: Status;
  errors: string[];
}

export const actions: Actions = {
  default: async ({ request }) => {
    const data: FormData = await request.formData();

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const passwordConfirmation = data.get("passwordConfirmation") as string;

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

    return responseObject;
  },
};
