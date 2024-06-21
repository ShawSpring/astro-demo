import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

//* https://expressive-code.com/installation/
// 增强code block， 比如:指定行、字符串高亮, title
import expressiveCode from "astro-expressive-code";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    icon({
      iconDir: "src/assets/icons",
    }),
    react(),
    tailwind({}),
    expressiveCode({
      themes: ["dracula", "github-light-default"],
      shiki: {},
    }),
    mdx(),
  ],
  markdown: {
    // 将ascii标点符号，智能转换为对应排版的符号,默认为true
    smartypants: false,
    remarkPlugins: [remarkToc],
    rehypePlugins: [
      rehypeSlug,
      [
        /*  
    md/mdx 中的headings 自动添加anchor后，
    <h2 id='title'> <a href='#title' class='heading-link' aria-hidden='true' tabindex='-1'><span class='icon icon-link'></span></a> title </h2>
    然后在自己处理a标签的样式。模式是 
    html: scroll-behavior: smooth;
    */

        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: {
            ariaHidden: "true",
            tabIndex: -1,
            class: "heading-link",
          },
        },
      ],
    ],
    //* 使用了astro-expressive-code，代码高亮不再是内置的shiki，需要到expressiveCode内去配置代码高亮
    // shikiConfig: {
    //   themes: {
    //     light: "github-light",
    //     dark: "github-dark",
    //   },
    // },
  },
});
