import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({ 
    base: "/path_holes_detector", 
    plugins: [react()],
    server:{port:3000},
    preview:{
        host:true,
        port: 3000
    }
}) 
