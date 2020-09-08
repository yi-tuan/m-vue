import { tokenizer } from './tokenizer';

describe('tokenizer', () => {
  test('Basic', () => {
    const result = tokenizer(`
    <div name="test">
    <div>111</div>
    <div :value="name">222</div>
    <div>333</div>
    <div onClick="click" />
    </div>
    `)
  });
})