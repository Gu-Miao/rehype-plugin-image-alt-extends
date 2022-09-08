import { visit } from 'unist-util-visit'
import hast from 'hast'

import { Processor, Transformer } from 'unified'
import { Node } from 'unist'

export const regexp = /(.*)\|\|(#\S+\s)?((\.\S+\s)*)((\S+=\S+\s)*)(\d+(\.\d+)?)x(\d+(\.\d+)?)$/
type Matched = [string, string, string, string, string, string, string, string, string, string]

function imageAltExtendsPlugin(this: Processor): Transformer {
  function visitor(el: hast.Element) {
    if (el.tagName !== 'img' || !el.properties) return

    const altStr = el.properties.alt as string
    if (!altStr || !regexp.test(altStr)) return

    const [, alt, idStr, classStr, , propsStr, , width, , height] = altStr.match(regexp) as Matched
    const props: Record<string, any> = {}

    if (propsStr) {
      const propsArr = propsStr.split(' ')
      propsArr.forEach(str => {
        const [key, val] = str.split('=')
        props[key] = val
      })
    }
    if (idStr) {
      props.id = idStr.replace(/#/, '').trim()
    }
    if (classStr) {
      props.class = classStr.replace(/\./g, '').trim()
    }
    el.properties = {
      ...el.properties,
      ...props,
      alt,
      width,
      height
    }
  }

  function transformer(htmlAST: Node): Node {
    visit(htmlAST, 'element', visitor)
    return htmlAST
  }

  return transformer
}

export default imageAltExtendsPlugin
module.exports = imageAltExtendsPlugin
