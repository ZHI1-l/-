import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // 加载环境变量，'' 表示加载所有变量（包括不带 VITE_ 前缀的）
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      // 将构建时的环境变量注入到客户端代码中
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});