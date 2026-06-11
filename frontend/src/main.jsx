import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

const root = document.getElementById('root');

if (root) {
	ReactDOM.createRoot(root).render(<App />);
} else {
	console.error('Root element not found');
}
