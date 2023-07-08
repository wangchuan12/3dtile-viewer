import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from 'node:fs';
// const fs = require('fs')
// const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  plugins : [vue()],
  resolve: {
    alias: {
      // 替换 node 中与浏览器不兼容的模块
      'buffer': 'buffer',
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'util': 'util',
      'path': 'path-browserify'
    },
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'ssl/server.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'ssl/server.crt'))
  //   }
  // },
});
