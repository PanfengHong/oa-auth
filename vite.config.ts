import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

const libConfig = (name: string) =>
  defineConfig({
    plugins: [
      react(),
      dts({ rollupTypes: true, tsconfigPath: './tsconfig.build.json' }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name,
        formats: ['es'],
        fileName: 'index',
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react-router',
          'react-router-dom',
          'antd',
          'zustand',
        ],
      },
    },
  })

export default libConfig('MyOaAuth')