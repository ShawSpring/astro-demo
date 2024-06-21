---
title: 我的第二篇博客文章
author: Astro 学习者
description: "学习了一些 Astro 后，我根本停不下来！"
image:
  url: "https://docs.astro.build/assets/arc.webp"
  alt: "Thumbnail of Astro arcs."
pubDate: 2022-07-08
tags: ["astro", "blogging", "learning in public", "successes"]
---

## markdown 配置

注意，不是传统的 plugin({options})，这是[plugin,{options}]

```json title="astro.config.mjs"
  markdown: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
        },
      ],
    ],
    theme: "dracula",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
```

在学习 Astro 大约一周后，我决定尝试些新的东西。我编写并导入了一个小组件！

## 下一步计划

我将完成 Astro 教程，然后继续编写更多内容。关注我以获取更多信息。

## code

```ts
import type { GetStaticPaths } from "astro";
import Layout from "../../layouts/Layout.astro";
import { posts, users } from "../../utils/fetchPosts";
export const getStaticPaths = (() => {
  return posts.map((post) => {
    return {
      params: {
        id: post.id,
      },
      props: {
        post,
        user: users.find((u) => u.id === post.userId),
      },
    };
  });
}) satisfies GetStaticPaths;
const { post, user } = Astro.props;
```

### title

1. lorem
2. sfs
3. 2882
4. apple
5. hello
6. banana
7. orange
8. peach
9. watermelon
10. strawberry
11. mango
12. pear
13. pineapple
14. dragonfruit
15. papaya
16. lemon
17. plum
18. tangerine

### animals

1. dog
2. cat
3. monkey
4. bird
5. snake
6. turtle
7. fish
8. cow
9. goat
10. chicken
11. pig
12. horse
13. rabbit
14. dragon
15. squirrel
16. parrot
17. ape
18. bear
19. lion
20. tiger
21. fox
22. wolf
23. pigeon
24. duck
25. goose
26. swan
27. kangaroo

### more

1. sjfsd
2. 33
3. sjdfs
4. 2990
5. sdjs
6. saj
7. 2010
8. sifsd
9. 9329
10. sjfs
11. 3883
12. wollf
13. helelos,spring
14. may i help you
15. You might as well do something else.
16. You're welcome.
17. thank you
18. Not at all
19. I'm sure.
20. It's okay.
21. I'm sorry.
22. I understand.
23. I'm glad you're here.
24. I'm happy to help.
25. I'm frustrated.
26. I'm terribly sorry.
27. I will be appreciated.
28. It's not until you do something else that you understand.
29. Don't worry.
30. Just do it.
31. I'm going to do it.
32. I'm about to sleep.
33. Hurry up.
34. I'm on my way.
35. I'm on my way home.
