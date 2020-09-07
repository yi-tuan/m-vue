// 匹配结束标签
const END_TAG_REG = /^<\s*\/\s*([a-z-_]+)\s*>/i
// 匹配开始标签
const START_TAG_REG = /^<\s*([a-z-_]+)\s*([^>]*)>/i
// 判断是否为自闭和标签
const CLOSE_TAG_REG = /\/\s*$/
// 匹配属性
const ATTR_REG = /([\w:]+)\s*(=\s*"([^"]+)")?/ig
// 判断是否为动态属性
const EXPRESS = /^:/
// 提取文本节点
const TEXT_REG = /^[^<>]+/

enum NodeType {
  /**
   * 开始标签标识
   */
  START = "start",
  /**
   * 属性
   */
  ATTR = "attr",
  CLOSE = "close",
  END = "end",
  TEXT = "text",
  FRAGMENT = "Fragment",
  EXPRESS = "express"
}

interface IAttrs {
  type: NodeType;
  name: string;
  value: string;
}

interface NodeItem {
  tag?: string;
  type: NodeType;
  value?: string;
  attrs?: IAttrs[];
}

export const tokenizer = (input: string): NodeItem[] => {
  const tokens: NodeItem[] = [];
  const stack: string[] = [];


  while (input.length) {

    if (START_TAG_REG.test(input)) {
      const match = input.match(START_TAG_REG);

      if (match) {
        const [str, tagName, attrsStr] = match;
        const attrs: IAttrs[] = [];
        input = input.slice(str.length);

        if (attrsStr) {
          let rst = attrsStr;

          while (ATTR_REG.exec(rst) !== null) {
            const [str, attrName, _, attrValue] = ATTR_REG.exec(rst) as RegExpExecArray;
            rst = rst.slice(str.length);

            // 判断是否为表达式属性
            if (EXPRESS.test(attrName)) {
              attrs.push({ type: NodeType.EXPRESS, name: attrName.slice(1), value: attrValue, })
              continue
            }
            // 普通属性
            attrs.push({ type: NodeType.ATTR, name: attrName, value: attrValue, })
          }
        }

        // 判断是否是自闭合标签 "class=\"sas\" test=\"sada\"/"
        if (!CLOSE_TAG_REG.test(attrsStr)) {
          stack.push(tagName)
          tokens.push({ type: NodeType.START, tag: tagName, attrs })
        } else {
          // 将最后一个 / 替换掉
          attrsStr.replace(CLOSE_TAG_REG, '')
          tokens.push({ type: NodeType.CLOSE, tag: tagName, attrs })
        }
      }
      
      continue;
    }


    if (TEXT_REG.test(input)) {
      const match = input.match(TEXT_REG);
      if (match) {
        const [str] = match;
        input = input.slice(str.length);
        tokens.push({
          type: NodeType.TEXT,
          value: str
        })
      }

      continue;
    }

    // 结束标签
    if (END_TAG_REG.test(input)) {
      const match = input.match(END_TAG_REG)
      if (match) {
        const [str, tagName] = match
        input = input.slice(str.length)
        const startTagName = stack.pop()
        // 判断是否和开始标签匹配
        if (startTagName !== tagName) {
          throw new Error(`标签不匹配: ${tagName}`)
        }
        tokens.push({ type: NodeType.END, tag: tagName, })
      }
      continue
    }

    throw new Error(`解析模板出错: ${input}`)
  }

  if (stack.length > 0) {
    throw new Error(`标签不匹配: ${stack.toString()}`)
  }

  return tokens;
}