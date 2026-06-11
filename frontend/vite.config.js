import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@helpers': path.resolve(__dirname, 'src/app/styles/helpers'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@app': path.resolve(__dirname, 'src/app'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@i': path.resolve(__dirname, 'icons'),
		},
	},
});
