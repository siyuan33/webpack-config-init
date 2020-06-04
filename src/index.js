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
import { print } from './print.js';

console.log(data)


// 通过判断 module.hot 这个全局变量判断是否开启 HMR 
// 通过 accept 方法监听单个js 文件 可以使得 该js 实现HMR 更新 而不是整体页面更新
if (module.hot) {
  module.hot.accept("./print.js", function () {
    debugger
    print()
  })
}

const add = (x, y) => {
  console.log(x + y)
}
add(2, 1)