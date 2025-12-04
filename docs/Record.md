问题：引用的库中是 vue2 + webpack 构建的项目，而我用的 react + vite，导致库中在顶层调用 window.crypto 的时候会在 vite 环境下报错
解决：将 web-control 库中的 js 代码提取出来通过 script 标签全局引入
