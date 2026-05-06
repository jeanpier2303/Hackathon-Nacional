import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Mic, MoreVertical } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { sendChatMessage } from '../services/api';

const ChatIA = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hola, soy GobIA Auditor, tu asistente inteligente para análisis de contratos públicos. ¿En qué puedo ayudarte hoy?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      // Buscar ID de contrato dentro del mensaje
      const contratoMatch = input.match(/CO1\.PCCNTR\.\d+/i);

      const contratoId = contratoMatch
        ? contratoMatch[0]
        : null;

      const data = await sendChatMessage({
        pregunta: input,
        contrato_id: contratoId
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.respuesta
        }
      ]);
      
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, no pude procesar tu consulta. Por favor intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex flex-col flex-1 overflow-hidden p-0 shadow-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Sparkles className="text-purple-600" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">Asistente IA</h2>
              <p className="text-xs text-gray-500">Centro de Inteligencia Anticorrupción</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
            <MoreVertical size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-gray-900/20">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700'
              }`}>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                <span className="text-[10px] opacity-70 mt-1 block text-right">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Consulta sobre contratos, riesgos o normativa..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition"
            />
            <Button onClick={handleSend} disabled={loading} className="rounded-full p-2 btn-primary">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChatIA;