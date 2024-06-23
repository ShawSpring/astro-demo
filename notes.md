# astro 笔记

## output 三种模式

astro.config.mjs 中，可以指定[output](https://docs.astro.build/zh-cn/reference/configuration-reference/#output)
有三种模式：static、server、hybrid

1. static 都是预渲染
2. hybrid 默认预渲染，任何单独的页面或端点都可以选择退出预渲染，改用按需渲染。
3. server 默认按需渲染，任何单独的页面或端点都可以选择启用预渲染。

### export const prerender

静态模式下的动态页面， 需要 getStaticPaths 指定所有可用的路由，如路由/[slug],就要指定所有 slug 的取值范围，和关联的 props.
而到了 hybrid 和 server 模式下，默认是*按需渲染*， 还使用 getStaticPaths 则需要手动指明该页面是*预渲染*。

```ts
/*  SSR 模式下， getStaticPaths被忽略， 需要下面这句来指明 该页面构建时预渲染 */
export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => {
    return {
      params: { slug: post.slug },
      props: { post },
    };
  });
}
```

### [SSR 适配器](https://docs.astro.build/zh-cn/guides/server-side-rendering/#%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E9%80%82%E9%85%8D%E5%99%A8)

要在 server 或 hybrid 模式下部署项目，你需要添加一个适配器。这是因为这两种模式都需要一个服务器 运行时：在服务器上运行代码以在请求时生成页面的环境。每个适配器都允许 Astro 输出一个在特定运行时（如 Vercel、Netlify 或 Cloudflare）上运行你的项目的脚本。

[部署指南](https://docs.astro.build/zh-cn/guides/deploy/#%E9%83%A8%E7%BD%B2%E6%8C%87%E5%8D%97)

---

## astro 组件注意事项

Astro 组件是由两个主要部分所组成的——组件 script 和组件模板。使用代码围栏（---）来识别 Astro 组件中的组件脚本。

### [组件中 Astro 对象](https://docs.astro.build/zh-cn/reference/api-reference/)

[Astro.props](https://docs.astro.build/zh-cn/reference/api-reference/#astroprops)
类似于 React 中的 props, 调用组件时传入的属性。

```ts
---
import Heading from '../components/Heading.astro';
---
<Heading title="我的第一篇文章" date="09 Aug 2022" />
```

[Astro.request](https://docs.astro.build/zh-cn/reference/api-reference/#astrorequest)
Astro.request 是一个标准的 请求 对象。它可以用来获取请求的 url、headers、method，甚至是请求的主体。

```ts
---
const cookie = Astro.request.headers.get("cookie");
---
<p>Received a {Astro.request.method} request</p>;
```

[Astro.url](https://docs.astro.build/zh-cn/reference/api-reference/#astrourl)
相当于 new URL(Astro.request.url)，是一个 URL 对象，可以更方便的访问 url 中的各个部分。

```ts
const pathname = Astro.url.pathname;
...
{
      allPosts.map((post) => (
        <li class:list={[pathname === `/${post.collection}/${post.slug}` && 'active']}>
          {/* <a href={post.url}>{post.frontmatter.title}</a> */}
          <a href={`/${post.collection}/${post.slug}`}>{post.data.title}</a>
        </li>
      ))
    }
```

### 组件脚本像一个 async 函数

除了 import / export 外，组件脚本就像是一个 async 函数。可以顶层使用 `await` 和 `return`

```ts
---
import { getProduct } from '../api';

const product = await getProduct(Astro.params.id);

// 没有找到任何记录
if(!product) {
  return new Response(null, {
    status: 404,
    statusText: 'Not found'
  });
}
---
//  html here
```

### 不可在 UI 框架组件中使用.astro 组件

**总之**: astro 中能使用 UI 框架组件，当 UI 框架中不能使用 astro 组件，除非是 slot 这种静态内容。

[doc ref](https://docs.astro.build/zh-cn/guides/framework-components/#%E6%88%91%E5%8F%AF%E4%BB%A5%E5%9C%A8%E6%88%91%E7%9A%84%E6%A1%86%E6%9E%B6%E7%BB%84%E4%BB%B6%E4%B8%AD%E4%BD%BF%E7%94%A8-astro-%E7%BB%84%E4%BB%B6%E5%90%97)
任何 UI 框架组件(react vue solid 等)都会成为一个“孤岛”。react 组件内只能使用 react 中合法的代码。
[source: PackageManagers](src/components/PackageManagers.astro)

```ts
<Tabs
  tabs={tabContents.map(({ label, code }) => ({
    label,
    content: <Code code={code} lang="sh" />,
  }))}
/>
```

上述代码出错，因为`Code`是 astro 组件，是构建阶段就确定的静态 HTML 模板，在 react 中客户端动态渲染当然不行。

### 不可 client: 激活 astro 组件

astro 组件是纯 HTML 的模板组件，没有客户端运行时。只能使用 \<script\> 标签，向浏览器发送在全局范围内执行的原生 JavaScript。

---

## 客户端脚本

"---" frontmatter 中的代码为服务端代码，`<script>` 中的是客户端代码。

### [客户端脚本处理](https://docs.astro.build/zh-cn/guides/client-side-scripts/#%E8%84%9A%E6%9C%AC%E5%A4%84%E7%90%86)

脚本是打包在一起的，每页只包含一次。包含多个组件，组件中的`<script>`会只剩一个。

会处理！会打包！支持 TypeScript！也可以导入本地脚本和 Node 模块。
处理过的脚本会被注入到你的页面的` <head>`，同时添加 `type="module"`
`type="module"` 的脚本会等 html 处理完后才执行，因此无需监听 “load” 事件。

is:inline 即 astro 不处理脚本。直接在 html 保持原样。

> 目前我没看到这样使用的场景， 先不考虑这个。
> 在 `<script>` 标签添加 type="module" 或 define:vars 等除 src 之外的任何属性，都会使 Astro 将该标签视为具有 is:inline 指令。

### 将变量传给客户端脚本

> 注意，对象需要 JSON.stringify 序列化
> 两种方法:

1.  [define:vars](https://docs.astro.build/zh-cn/reference/directives-reference/#definevars)
2.  dataset 在 html 的自定义属性中加载信息。

> define:vars 在 style中好像只能够作为css变量，var(--xxx) 这样使用。以下代码无效。
```html
<style define:vars={{defaultTabName}}>
  div[data-tab-name=defaultTabName] { 
    display: block;
  }
</style>
```

### astro:page-load

有视图过渡时，使用 astro:page-load 代替 DOMContentLoaded。

```ts
// document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('astro:page-load', () => {
}）

```

### [ViewTransition 生命周期](https://docs.astro.build/zh-cn/guides/view-transitions/#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%BA%8B%E4%BB%B6)

<ul>
<li><a href="#astrobefore-preparation"><code dir="auto">astro:before-preparation</code></a></li>
<li><a href="#astroafter-preparation"><code dir="auto">astro:after-preparation</code></a></li>
<li><a href="#astrobefore-swap"><code dir="auto">astro:before-swap</code></a></li>
<li><a href="#astroafter-swap"><code dir="auto">astro:after-swap</code></a></li>
<li><a href="#astropage-load"><code dir="auto">astro:page-load</code></a></li>
</ul>
---

## zod

astro 中使用 zod 来进行数据校验。不用在安装 zod.

[source: define schema](src/pages/api/feedback.ts)

```ts
import { type APIRoute } from "astro";
import { z } from "astro/zod";
export const feedbackSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(6).max(20),
  email: z.string({ required_error: "Email is required" }).email(),
  message: z.string().max(100),
});
export type Feedback = z.infer<typeof feedbackSchema>;
```

[souce: use in Form](src/components/FeedbackForm.tsx)

```ts
import { feedbackSchema, type Feedback } from "@/pages/api/feedback";
type State = {
  errors?: Partial<Feedback>;
  message?: string | null;
};
export default function Form() {
  const [state, setState] = useState<State>({});
  ...

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
```

---

## 代码块增强 [expressive code](https://expressive-code.com/)

比原生的 md/mdx 的代码块功能更强大，比如 指定行高亮等。

## [preFetch](https://docs.astro.build/zh-cn/guides/prefetch/)

可以通过 data-astro-prefetch 来控制是否预先加载。默认是 hover 触发 prefetch, 原理是监听 mouse 事件，
创建`<link rel="prefetch" href =''>`

```html
<a href="/about" data-astro-prefetch="false">About</a>
```

实现原理参考包[astro-hover-prefetch](https://code.juliancataldo.com/components/#astro-hover-prefetch)

## middleware

好像 koa, 洋葱模型，`async(ctx, next) => await next()` 这种形式。

```ts
//* context.locals 就像koa中的ctx.state,用于在请求处理过程中被传递, 并且可以在astro中通过Astro.locals访问
export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.locals.title) context.locals.title = "Astro";
  // return next();
  console.time("onRequest: " + context.url.pathname);
  await next();
  console.timeEnd("onRequest: " + context.url.pathname);
});
```

[链式调用](https://docs.astro.build/zh-cn/guides/middleware/#%E4%B8%AD%E9%97%B4%E4%BB%B6%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8)

```ts
import { sequence } from "astro:middleware";
async function validation(_, next) {
    console.log("验证请求");
    const response = await next();
    console.log("验证响应");
    return response;
}
...
export const onRequest = sequence(validation, auth, greeting);
```
