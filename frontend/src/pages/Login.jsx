import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import Input from '../components/common/Input';
import { Card } from '../components/common/Card';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  Sparkles,
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1F3A] to-[#07111F] relative overflow-hidden">

      {/* EFECTOS DE FONDO */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#0B1F3A]/80" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10 px-4"
      >
        <Card className="p-8 backdrop-blur-2xl bg-white/10 dark:bg-black/40 border border-white/20 shadow-2xl rounded-2xl">

          {/* LOGO */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24">
                <img
                  src="../../src/assets/logo_blanco.png"
                  alt="Logo"
                  className="h-17 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-gray-200 text-sm mt-2">
              Plataforma de Inteligencia Anticorrupción
            </p>

            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-white">
              <Shield size={14} />
              <span>Acceso Seguro</span>
              <Sparkles size={14} />
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* CORREO */}
            <div>
              <label className="block mb-2 text-sm font-semibold tracking-wide text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                Correo electrónico
              </label>

              <Input
                type="email"
                placeholder="usuario@entidad.gov.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
                className="input-glow"
              />
            </div>

            {/* CONTRASEÑA */}
            <div className="relative">
              <label className="block mb-2 text-sm font-semibold tracking-wide text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                Contraseña
              </label>

              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
                className="input-glow pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-300 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-500/10 p-2 rounded-lg text-center"
              >
                {error}
              </motion.p>
            )}

            {/* BOTÓN */}
            <Button
              type="submit"
              isLoading={loading}
              className="w-full btn-primary"
            >
              <LogIn size={18} className="mr-2" />
              Ingresar al Sistema
            </Button>

          </form>

          <p className="text-xs text-center text-gray-400 mt-6 border-t border-gray-700/50 pt-4">
          </p>

        </Card>
      </motion.div>
    </div>
  );
};

export default Login;