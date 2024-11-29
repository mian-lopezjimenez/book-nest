import { json, type RequestHandler } from "@sveltejs/kit";
import { OPENAI_API_KEY } from "$env/static/private";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
  const { base64 } = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `In the given image there will be either one or many books displayed. What you need to do is give me back a JSON ans NOTHING ELSE. Please only give me back a valid json since this will be programmatically handled and it will crash if there is any oter text coming back with your response.
              What I need as information is the books that you can see on the image in this form:
              {
                bookTitle: "Harry Potter and the Deathly Hallows",
                author: "J.K. Rowling",
              }
              Please also make sure that you return an array, efen if there is only one book visible on the image.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${base64}`,
              detail: "low",
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message);

  const booksArrayString: string | undefined =
    response.choices[0].message.content?.replace(/```json|```/g, "").trim();

  const books = JSON.parse(booksArrayString ?? "");

  return json({
    books,
  });
};
