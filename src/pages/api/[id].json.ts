import type { APIRoute, GetStaticPaths } from "astro";

const usernames = ["张三", "李四", "王五"];

interface Props {
  username: string;
}

export const GET: APIRoute<Props> = async ({ params, request, props }) => {
  //! SSG （output: static）时，不能得到query string, 因为构建时不可能得知。
  console.log(`received a ${request.method} request to ${request.url}`);
  //   const id = params.id;
  return new Response(JSON.stringify({ name: props.username }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// ssr模式下需要开启预渲染
export const prerender = true;

//默认是SSG模式，需要构建时确定所有路由，[id] 中的所有可选值，以及其它的props
export const getStaticPaths: GetStaticPaths = () => {
  return usernames.map((username, index) => {
    return {
      params: {
        id: index.toString(),
      },
      props: {
        username: username,
      },
    };
  });
};
