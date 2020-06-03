/* index.js  : webpack 入口文件

1 运行指令：
  开发环境 webpack ./src/index.js -o ./build/built.js --mode=development
  
  生产环境 webpack ./src/index.js -o ./build/built.js --mode=production

2 结论 webpack 能处理 json 和 js 文件
  支持 es6 module
  对css 等资源是无法处理的需要 loader 处理

*/
import data from './data.json';
import "./index.css"
import "./index.scss"

console.log(data)

const add = (x, y) => {
  console.log(x + y)
}
add(2, 1)
