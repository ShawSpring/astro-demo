import { type APIRoute } from "astro";
import { z } from "astro:content";
export const prerender = false;

export const feedbackSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(6).max(20),
  email: z.string({ required_error: "Email is required" }).email(),
  message: z.string().max(100),
});
export type Feedback = z.infer<typeof feedbackSchema>;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const feedbackObj = Object.fromEntries(data) as Feedback;
  // const name = data.get("name");
  // const email = data.get("email");
  // const message = data.get("message");
  const res = feedbackSchema.safeParse(feedbackObj);
  if (res.success) {
    console.log(res.data);
    return new Response(
      JSON.stringify({
        message: "Thanks for your feedback!",
      }),
      {
        status: 200,
      }
    );
  } else {
    // console.log(res.error.flatten().fieldErrors); // 一个field做键的对象
    return new Response(
      JSON.stringify({
        errors: res.error.flatten().fieldErrors,
      }),
      { status: 400 } // bad request
    );
  }
};
