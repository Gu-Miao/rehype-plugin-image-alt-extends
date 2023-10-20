import imageAltExtendsPlugin from '.'
import { unified } from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'

async function process(rawMarkdown: string): Promise<string> {
  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(remark2rehype)
      .use(imageAltExtendsPlugin)
      .use(html)
      .process(rawMarkdown, (err, file) => {
        if (err || !file) {
          reject(err)
        }
        resolve(file!.toString())
      })
  })
}

test('alt+id+class+props+size', async () => {
  const content =
    '![logo||   #img .banner .logo loading=lazy 400.5x300.5](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  console.log(html)
  const img = document.querySelector('#img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo')
  expect(img.classList.contains('banner')).toBe(true)
  expect(img.classList.contains('logo')).toBe(true)
  expect(img.getAttribute('loading')).toBe('lazy')
  expect(img.getAttribute('width')).toBe('400.5')
  expect(img.getAttribute('height')).toBe('300.5')
})

test('alt+size', async () => {
  const content = '![logo|| 500x300  ](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  const img = document.querySelector('img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo')
  expect(img.width).toBe(500)
  expect(img.height).toBe(300)
})

test('alt+props+id', async () => {
  const content = '![logo||   #img width=auto loading=lazy](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  console.log(html)
  const img = document.querySelector('#img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo')
  expect(img.getAttribute('loading')).toBe('lazy')
  expect(img.getAttribute('width')).toBe('auto')
})

test('alt only', async () => {
  const content = '![logo](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  const img = document.querySelector('img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo')
  expect(img.width).toBe(0)
  expect(img.height).toBe(0)
})

test('empty rule', async () => {
  const content = '![logo||](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  const img = document.querySelector('img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo||')
})

test('duplicate id', async () => {
  const content = '![logo||#e33  500x600  #55   ](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  const img = document.querySelector('img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo||#e33  500x600  #55   ')
})

test('duplicate size', async () => {
  const content = '![logo||#e33 500x600 .logo loading=lazy   777x333](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  const img = document.querySelector('img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo||#e33 500x600 .logo loading=lazy   777x333')
})

test('invalid syntax', async () => {
  const content = '![logo||#logo   .bg-white loadinglazy 500x300](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  const img = document.querySelector('img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('logo||#logo   .bg-white loadinglazy 500x300')
})

test('empty alt', async () => {
  const content = '![](http://example.com/logo.png)'
  const html = await process(content)
  document.body.innerHTML = html
  const img = document.querySelector('img') as HTMLImageElement
  expect(img.src).toBe('http://example.com/logo.png')
  expect(img.alt).toBe('')
})
