import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">Página no encontrada</p>
      <Link to="/" className="mt-6">
        <Button variant="primary"><Home size={18} className="mr-2" /> Volver al inicio</Button>
      </Link>
    </div>
  );
};

export default NotFound;