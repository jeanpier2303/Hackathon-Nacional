import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, Plus, Trash2, MessageSquare, 
  Paperclip, FileText, X, ChevronLeft, Menu 
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { sendChatMessage } from '../services/api';

// Helper para generar ID único
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Cargar historial desde localStorage
const loadChatHistory = () => {
  const stored = localStorage.getItem('gobia_chat_history');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch { return []; }
  }
  return [];
};

// Guardar historial
const saveChatHistory = (chats) => {
  localStorage.setItem('gobia_chat_history', JSON.stringify(chats));
};

// Crear nuevo chat
const createNewChat = () => ({
  id: generateId(),
  title: `Conversación ${new Date().toLocaleString()}`,
  messages: [{
    role: 'assistant',
    content: 'Hola, soy GobIA Auditor, tu asistente inteligente para análisis de contratos públicos. ¿En qué puedo ayudarte hoy?'
  }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const ChatIA = () => {
  const [chats, setChats] = useState(() => {
    const saved = loadChatHistory();
    return saved.length ? saved : [createNewChat()];
  });
  const [activeChatId, setActiveChatId] = useState(() => chats[0]?.id || null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // Guardar cambios en localStorage cada vez que cambian los chats
  useEffect(() => {
    saveChatHistory(chats);
  }, [chats]);

  // Responsive: cerrar sidebar automáticamente en móvil al iniciar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateCurrentChat = (updatedMessages) => {
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() }
        : chat
    ));
  };

  const handleNewChat = () => {
    const newChat = createNewChat();
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSelectedFile(null);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    if (chats.length === 1) {
      // No borrar el último, mejor limpiar mensajes
      const resetChat = { ...chats[0], messages: [chats[0].messages[0]], updatedAt: new Date().toISOString() };
      setChats([resetChat]);
      if (activeChatId === chatId) setActiveChatId(resetChat.id);
    } else {
      const newChats = chats.filter(c => c.id !== chatId);
      setChats(newChats);
      if (activeChatId === chatId) setActiveChatId(newChats[0]?.id);
    }
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Solo se permiten archivos PDF');
      e.target.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMessageText = input.trim() || '';
    let fullUserContent = userMessageText;

    if (selectedFile) {
      fullUserContent += `\n\n[Archivo adjunto: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)]`;
    }

    const userMsg = { role: 'user', content: fullUserContent };
    const updatedMessages = [...activeChat.messages, userMsg];
    updateCurrentChat(updatedMessages);

    setInput('');
    const currentFile = selectedFile;
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    try {
      const contratoMatch = userMessageText.match(/CO1\.PCCNTR\.\d+/i);
      const contratoId = contratoMatch ? contratoMatch[0] : null;

      const data = await sendChatMessage({
        pregunta: userMessageText,
        contrato_id: contratoId
      });

      const assistantMsg = { role: 'assistant', content: data.respuesta };
      const finalMessages = [...updatedMessages, assistantMsg];
      updateCurrentChat(finalMessages);

    } catch (error) {
      console.error(error);
      const errorMsg = { role: 'assistant', content: 'Lo siento, no pude procesar tu consulta. Por favor intenta de nuevo.' };
      updateCurrentChat([...updatedMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Formatear título del chat
  const getChatTitle = (chat) => {
    if (chat.title && !chat.title.startsWith('Conversación')) return chat.title;
    const firstUserMsg = chat.messages.find(m => m.role === 'user')?.content;
    if (firstUserMsg) {
      const short = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '…' : firstUserMsg;
      return short;
    }
    return new Date(chat.createdAt).toLocaleString();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-2 sm:gap-4">
      {/* Sidebar de historial */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl glass-card"
          >
            <div className="w-64 sm:w-72 h-full flex flex-col">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">Historial</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => { setActiveChatId(chat.id); setSelectedFile(null); if (window.innerWidth < 768) setSidebarOpen(false); }}
                    className={`group p-2 sm:p-3 rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                      activeChatId === chat.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <MessageSquare size={14} className="text-purple-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{getChatTitle(chat)}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                    >
                      <Trash2 size={12} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={handleNewChat} variant="primary" className="w-full gap-2 text-sm sm:text-base py-1.5 sm:py-2">
                  <Plus size={14} /> Nuevo chat
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel principal del chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mb-2 sm:mb-3 p-1.5 sm:p-2 rounded-xl glass-card w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
          >
            <Menu size={18} />
          </button>
        )}

        <Card className="flex-1 flex flex-col overflow-hidden shadow-xl">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Sparkles className="text-purple-600" size={16} className="sm:size-20" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">Asistente IA</h2>
                <p className="text-[10px] sm:text-xs text-gray-500">Centro de Inteligencia Anticorrupción</p>
              </div>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              {activeChat?.messages.filter(m => m.role === 'user').length} mensajes
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50/30 dark:bg-gray-900/20 custom-scrollbar">
            <AnimatePresence initial={false}>
              {activeChat?.messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <Bot size={14} className="sm:size-16 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm text-xs sm:text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={line.startsWith('[Archivo adjunto:') ? 'text-[10px] sm:text-xs italic opacity-80 mt-1' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                    <span className="text-[9px] sm:text-[10px] opacity-70 mt-1 block text-right">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="sm:size-16 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 sm:gap-3 justify-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse">
                    <Bot size={14} className="sm:size-16 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-bl-none shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
            {selectedFile && (
              <div className="mb-2 sm:mb-3 p-1.5 sm:p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FileText size={12} className="sm:size-14 text-purple-600" />
                  <span className="text-[10px] sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-[9px] sm:text-xs text-gray-500">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button onClick={removeFile} className="p-0.5 sm:p-1 rounded hover:bg-purple-200 dark:hover:bg-purple-800/50">
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Consulta sobre contratos, riesgos o normativa..."
                className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition text-xs sm:text-sm"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                id="pdf-upload-chat"
              />
              <label
                htmlFor="pdf-upload-chat"
                className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition flex items-center justify-center"
              >
                <Paperclip size={14} className="sm:size-16" />
              </label>
              <Button onClick={handleSend} disabled={loading} className="rounded-full p-1.5 sm:p-2 btn-primary">
                <Send size={14} className="sm:size-16" />
              </Button>
            </div>
            <p className="text-[9px] sm:text-xs text-gray-400 text-center mt-2">Adjunta PDF (solo visual, no se envía al backend)</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatIA;