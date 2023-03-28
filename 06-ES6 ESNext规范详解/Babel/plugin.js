const template = require('babel-template');
const temp = template('var b = 1');

module.exports = function ({
  types: t
}) {
  // 插件内容
  return {
    visitor: {
      // 接收两个参数path, state
      VariableDeclaration(path, state) {
        // 找到AST节点
        const node = path.node;
        // 判断节点类型 是否是变量节点, 申明方式是const
        if (t.isVariableDeclaration(node, {
          kind: 'const'
        })) {
          // 将const 声明编译为let
          node.kind = 'let';
          // var b = 1 的AST节点
          const insertNode = temp();
          // 插入一行代码var b = 1
          path.insertBefore(insertNode);
        }
      }
    }
  }
}