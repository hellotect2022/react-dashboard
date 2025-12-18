import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스 허용 (내부망 접속 가능)
    port: 5173,      // 원하는 포트 번호 (기본값은 5173)
  }
})
