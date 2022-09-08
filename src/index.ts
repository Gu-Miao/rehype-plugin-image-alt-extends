import { visit } from 'unist-util-visit'
import hast from 'hast'

import { Processor, Transformer } from 'unified'
import { Node } from 'unist'

const idRegExp = /^#\S+$/
const classNameRegExp = /^\.\S+$/
const propertyRegExp = /^(\S+)=(\S+)$/
const sizeRegExp = /^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/

function imageAltExtendsPlugin(this: Processor): Transformer {
  function visitor(el: hast.Element) {
    if (el.tagName !== 'img' || !el.properties) return

    const alt = el.properties.alt as string | undefined
    if (!alt) return

    const altSlice = alt.split('||')
    if (altSlice.length === 1) return

    const [lastSlice] = altSlice.splice(altSlice.length - 1, 1)

    let isValid = true
    let id: string | undefined
    const classNames: string[] = []
    const props: Record<string, any> = {}
    let width: string | undefined
    let height: string | undefined

    const syntaxSlices = lastSlice.trim().split(/\s+/)
    if (syntaxSlices.length === 1 && syntaxSlices[0] === '') return
    syntaxSlices.every(syntax => {
      if (idRegExp.test(syntax)) {
        if (id) {
          isValid = false
          return
        }
        id = syntax.replace('#', '')
      } else if (classNameRegExp.test(syntax)) {
        classNames.push(syntax.replace('.', ''))
      } else if (propertyRegExp.test(syntax)) {
        const [, key, value] = syntax.match(propertyRegExp) as [string, string, string]
        props[key] = value
      } else if (sizeRegExp.test(syntax)) {
        if (width || height) {
          isValid = false
          return
        }
        const [, w, h] = syntax.match(sizeRegExp) as [string, string, string]
        width = w
        height = h
      } else {
        isValid = false
      }

      return true
    })

    if (!isValid) return

    el.properties = {
      ...el.properties,
      ...props,
      width,
      height,
      alt: altSlice.join('||')
    }
    if (id) el.properties.id = id
    if (classNames.length) el.properties.class = classNames.join(' ')
  }

  function transformer(htmlAST: Node): Node {
    visit(htmlAST, 'element', visitor)
    return htmlAST
  }

  return transformer
}

export default imageAltExtendsPlugin
module.exports = imageAltExtendsPlugin
