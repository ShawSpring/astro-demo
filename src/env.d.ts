/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

//* App 定义在 astro/client 中
declare namespace App {
  // eslint-disable-next-line  @typescript-eslint/no-empty-interface
  interface Locals {
    title?: string;
  }
}
