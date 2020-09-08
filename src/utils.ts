// 匹配结束标签
export const END_TAG_REG = /^<\s*\/\s*([a-z-_]+)\s*>/i
// 匹配开始标签
export const START_TAG_REG = /^<\s*([a-z-_]+)\s*([^>]*)>/i
// 判断是否为自闭和标签
export const CLOSE_TAG_REG = /\/\s*$/
// 匹配属性
export const ATTR_REG = /([\w:]+)\s*(=\s*"([^"]+)")?/ig
// 判断是否为动态属性
export const EXPRESS = /^:/
// 提取文本节点
export const TEXT_REG = /^[^<>]+/

//是否是空白字符
export function isBlank(ch: string): boolean {
  return ch == ' ' || ch == '\t' || ch == '\n';
}