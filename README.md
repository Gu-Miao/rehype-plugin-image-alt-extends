# rehype-plugin-image-alt-extends

A rehype plugin for adding properties of image in alt.

![npm](https://img.shields.io/npm/v/rehype-plugin-image-alt-extends?logo=npm&style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/rehype-plugin-image-alt-extends?logo=typescript&style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/rehype-plugin-image-alt-extends?logo=npm&style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/Gu-Miao/rehype-plugin-image-alt-extends?logo=codecov&style=flat-square)
![GitHub](https://img.shields.io/github/license/Gu-Miao/rehype-plugin-image-alt-extends?logo=github&style=flat-square)

## Install

```
npm install rehype-plugin-image-alt-extends
```

## Usage

Add `id`, `class`, `width`, `height` and properties for image element.

```js
import fs from 'fs'
import imageAltExtendsplugin from 'rehype-plugin-image-alt-extends'
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'

async function process(markdown: string) {
  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(remark2rehype)
      .use(imageAltExtendsplugin)
      .use(html)
      .process(markdown, (err, file) => {
        if (err) {
          return reject(err)
        }
        return resolve(file.toString())
      })
  })
}

async function run() {
  const input = '![logo||#img .banner .logo loading=lazy 400.5x300.5](http://example.com/logo.png)'
  const output = await process(input)
  console.log(output) // <p><img src="http://example.com/logo.png" alt="logo" loading="lazy" id="img" class="banner logo" width="400.5" height="300.5"></p>
}
```

## Match

```js
const regexp = /(.*)\|\|(#\S+\s)?((\.\S+\s)*)((\S+=\S+\s)*)(\d+(\.\d+)?)x(\d+(\.\d+)?)$/
```

`alt`, `id`, `class`, and other properties are optional. `width` and `height` are required.

## LICENCE

MIT
