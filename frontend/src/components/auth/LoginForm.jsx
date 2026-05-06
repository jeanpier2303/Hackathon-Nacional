import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const LoginForm = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acceso al Sistema</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Auditoría inteligente de contratos SECOP II</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="demo@secop.gov.co"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} />}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <Button type="submit" isLoading={loading} className="w-full mt-4">
          <LogIn size={18} className="mr-2" /> Ingresar
        </Button>
      </form>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">Credenciales de prueba: demo@secop.gov.co / cualquier contraseña</p>
    </Card>
  );
};

export default LoginForm;