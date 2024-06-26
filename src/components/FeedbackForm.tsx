import { type FormEvent, useState } from "react";

import { feedbackSchema, type Feedback } from "@/pages/api/feedback";
type State = {
  errors?: Partial<Feedback>;
  message?: string | null;
};

export default function Form() {
  // const [responseMessage, setResponseMessage] = useState("");
  const [state, setState] = useState<State>({});

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setState({});
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
        //! 不要手动设定为multipart/form-data, 因为还有boundary
        // 自动设置的content-type是：multipart/form-data; boundary=----WebKitFormBoundarylmszs4X2AABB25RL
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   }
      });
      const data = await response.json();
      if (data.message) {
        setState({ message: data.message });
      } else {
        setState({ errors: data.errors });
      }
    } catch (err) {
      //! fetch 只有网络 权限错误才会抛出错误(promise reject), HTTP错误需要检查response.status或response.ok
      alert(err);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1  w-96 border border-black [&_input]:ring-1"
    >
      <div className="relative pb-8">
        <label htmlFor="name" className="flex justify-between">
          Name
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            minLength={6}
            maxLength={20}
            onChange={() => setState({})}
            required
          />
        </label>
        {state.errors?.name && (
          <p className="text-red-600 absolute bottom-0 h-fit m-0 p-0">
            {state.errors.name}
          </p>
        )}
      </div>

      <div className="relative  pb-8">
        <label htmlFor="email" className="flex justify-between" >
          Email
          <input
            type="email"
            id="email"
            name="email"
            onChange={() => setState({})}
            autoComplete="email"
            required
          />
        </label>
        {state.errors?.email && (
          <p className="text-red-600 absolute bottom-0 h-fit m-0 p-0">
            {state.errors.email}
          </p>
        )}
      </div>
      <div className="relative  pb-8">
        <label htmlFor="message" className="flex justify-between">
          Message
          <textarea
            id="message"
            name="message"
            onChange={() => setState({})}
            autoComplete="off"
            required
          />
        </label>
        {state.errors?.message && (
          <p className="text-red-600 absolute bottom-0 h-fit m-0 p-0">
            {state.errors.message}
          </p>
        )}
      </div>
      <button className="hover:ring-1">Send</button>
      {state.message && <p className="text-green-600">{state.message}</p>}
    </form>
  );
}
