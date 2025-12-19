import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
    }
  },
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스 허용 (내부망 접속 가능)
    port: 5173,      // 원하는 포트 번호 (기본값은 5173)
  }
})
