import { START_TAG_REG, END_TAG_REG, ATTR_REG, CLOSE_TAG_REG, TEXT_REG, isBlank, EXPRESS } from './utils';

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
  TEXT_NODE = "text",
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
  let col: number = 0;
  let row: number = 0;

  while (input.length) {
    if (isBlank(input[0])) {
      input = input.slice(1);

      // reset
      if (input[0] === '\n') {
        col = 0;
        row += 1;
      }
      col++;
      continue;
    }

    if (START_TAG_REG.test(input)) {
      const match = input.match(START_TAG_REG);

      if (match) {
        const [str, tagName, attrsStr] = match;
        const attrs: IAttrs[] = [];
        input = input.slice(str.length);

        if (attrsStr) {
          let matchAttr: RegExpExecArray | null;

          while ((matchAttr = ATTR_REG.exec(attrsStr)) != null) {
            const [attrStr, attrName, _, attrValue] = matchAttr;

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
        if (CLOSE_TAG_REG.test(attrsStr)) {
          tokens.push({ type: NodeType.CLOSE, tag: tagName, attrs })
        } else {
          stack.push(tagName)
          tokens.push({ type: NodeType.START, tag: tagName, attrs })
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
          type: NodeType.TEXT_NODE,
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