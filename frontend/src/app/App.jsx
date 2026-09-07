import { BrowserRouter } from 'react-router-dom';
import Providers from './providers';
import AppRoutes from './routes';

/**
 * Root App component.
 * BrowserRouter → Providers → Routes
 */
export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
}
