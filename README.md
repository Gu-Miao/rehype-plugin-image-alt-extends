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

## Extended rules

There are four extended rules:

- **id rule**: `#id`
- **classname rule**: `.classname`
- **property rule**: `key=val`
- **size rule**: `500.5x300`

---

- All rules must be separated by spaces.

```md
![logo||#img 400x400](http://example.com/logo.png) <!-- Good -->
[logo||#img400x400](http://example.com/logo.png) <!-- Bad, 400x400 will be a part of id -->
```

- We use `trim()` and `split(/\s+/)` to split syntax slices. So you could have spaces in the beginning or ending and the count of spaces is not important:

```md
![logo||    #img   400x400   .bg-white ](http://example.com/logo.png)
```

- No fixed order, below two have same output.

```md
![logo||.bg-red #img 400x400](http://example.com/logo.png)
![logo||400x400 #img .bg-red](http://example.com/logo.png)
```

- Size rule support decimal:

```md
![logo||500.5x300.33](http://example.com/logo.png)
```

- If there is no content after the `||`, it will not be parsed as extended grammar.

```md
![logo||](http://example.com/logo.png)

<!-- output -->

<img src="http://example.com/logo.png" alt="logo||" />
```

- If there is an error in the extended syntax, then instead of continuing parsing, it returns original alt.

```md
![logo||#logo lazy_loading](http://example.com/logo.png)

<!-- output, lazy_loading is invalid syntax -->

<img src="http://example.com/logo.png" alt="logo||#logo lazy_loading" />
```

- id rule and size rule can only appear once, otherwise it won't parse:

```md
![logo||#logo #logo1](http://example.com/logo.png)

<!-- output, duplicate id rule -->

<img src="http://example.com/logo.png" alt="logo||#logo #logo1" />
```

```md
![logo||500x300 500x300](http://example.com/logo.png)

<!-- output, duplicate size rule -->

<img src="http://example.com/logo.png" alt="logo||500x300 500x300" />
```

## LICENCE

MIT
