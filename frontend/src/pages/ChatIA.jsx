import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, MoreVertical, Plus, 
  Paperclip, FileText, Trash2, Menu, X, History 
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { sendChatMessage } from '../services/api';

// Función para extraer texto de PDF usando pdf.js
async function extractTextFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

// Generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Formatear fecha relativa
function formatRelativeDate(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'justo ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours} h`;
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  return new Date(timestamp).toLocaleDateString('es-CO');
}

const ChatIA = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractingFile, setExtractingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar conversaciones desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chat_conversations');
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      if (parsed.length > 0 && !currentConversationId) {
        setCurrentConversationId(parsed[0].id);
      } else if (parsed.length === 0) {
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // Guardar conversaciones en localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, currentConversationId]);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const createNewChat = () => {
    const newId = generateId();
    const newConversation = {
      id: newId,
      title: 'Nueva conversación',
      timestamp: Date.now(),
      messages: [
        { 
          role: 'assistant', 
          content: 'Hola, soy GobIA Auditor, tu asistente inteligente para análisis de contratos públicos. ¿En qué puedo ayudarte hoy?',
          timestamp: Date.now()
        }
      ]
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setSelectedFile(null);
    if (isMobile) setShowHistory(false);
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    const newConversations = conversations.filter(c => c.id !== id);
    setConversations(newConversations);
    if (currentConversationId === id) {
      if (newConversations.length > 0) {
        setCurrentConversationId(newConversations[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const updateConversationTitle = (id, firstUserMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === id && conv.title === 'Nueva conversación') {
        const newTitle = firstUserMessage.length > 30 
          ? firstUserMessage.substring(0, 30) + '...' 
          : firstUserMessage;
        return { ...conv, title: newTitle };
      }
      return conv;
    }));
  };

  const addMessage = (conversationId, message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, { ...message, timestamp: Date.now() }],
          timestamp: Date.now()
        };
      }
      return conv;
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo no puede superar los 10MB');
      return;
    }
    
    setSelectedFile(file);
    // Limpiar input para permitir subir el mismo archivo nuevamente
    e.target.value = '';
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSend = async () => {
    const messageContent = input.trim();
    if (!messageContent && !selectedFile) return;
    
    let fullMessage = messageContent;
    let extractedText = '';
    
    // Extraer texto del PDF si existe
    if (selectedFile) {
      setExtractingFile(true);
      try {
        extractedText = await extractTextFromPDF(selectedFile);
        fullMessage = messageContent 
          ? `${messageContent}\n\n[Contenido del archivo ${selectedFile.name}]:\n${extractedText.substring(0, 3000)}${extractedText.length > 3000 ? '...' : ''}`
          : `[Contenido del archivo ${selectedFile.name}]:\n${extractedText.substring(0, 3000)}${extractedText.length > 3000 ? '...' : ''}`;
      } catch (error) {
        console.error('Error extrayendo PDF:', error);
        fullMessage = messageContent 
          ? `${messageContent}\n\n[Error al procesar el archivo ${selectedFile.name}]`
          : `[Error al procesar el archivo ${selectedFile.name}]`;
      } finally {
        setExtractingFile(false);
      }
    }
    
    if (!fullMessage) return;
    
    // Añadir mensaje del usuario
    const userMessage = { 
      role: 'user', 
      content: messageContent || `[Archivo: ${selectedFile?.name}]`,
      hasAttachment: !!selectedFile,
      attachmentName: selectedFile?.name
    };
    addMessage(currentConversationId, userMessage);
    
    // Actualizar título si es primera interacción
    if (messages.length === 1) {
      updateConversationTitle(currentConversationId, messageContent || selectedFile?.name || 'Archivo adjunto');
    }
    
    setInput('');
    setSelectedFile(null);
    setLoading(true);
    
    try {
      // Buscar ID de contrato dentro del mensaje
      const contratoMatch = fullMessage.match(/CO1\.PCCNTR\.\d+/i);
      const contratoId = contratoMatch ? contratoMatch[0] : null;
      
      const data = await sendChatMessage({
        pregunta: fullMessage,
        contrato_id: contratoId
      });
      
      addMessage(currentConversationId, {
        role: 'assistant',
        content: data.respuesta || data.reply || 'Lo siento, no pude procesar tu consulta.'
      });
    } catch {
      addMessage(currentConversationId, {
        role: 'assistant',
        content: 'Lo siento, no pude procesar tu consulta. Por favor intenta de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4">
      {/* Botón toggle para historial en móvil */}
      <div className="md:hidden flex justify-start mb-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
        >
          {showHistory ? <X size={16} /> : <History size={16} />}
          {showHistory ? 'Cerrar historial' : 'Historial de chats'}
        </button>
      </div>

      {/* Sidebar de historial */}
      <AnimatePresence mode="wait">
        {(showHistory || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300, opacity: 0 } : { opacity: 0, x: -20 }}
            animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1, x: 0 }}
            exit={isMobile ? { x: -300, opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`${isMobile ? 'fixed inset-0 z-50 w-72 bg-gray-900/95 backdrop-blur-md' : 'w-72'} rounded-xl flex-shrink-0 overflow-hidden`}
          >
            <div className="h-full flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <History size={18} />
                  Conversaciones
                </h3>
                <Button onClick={createNewChat} variant="primary" className="px-3 py-1.5 text-sm">
                  <Plus size={14} className="mr-1" />
                  Nuevo
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setCurrentConversationId(conv.id);
                      setSelectedFile(null);
                      if (isMobile) setShowHistory(false);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-all group ${
                      currentConversationId === conv.id
                        ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-l-4 border-purple-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                          {conv.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatRelativeDate(conv.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay para móvil cuando el historial está abierto */}
      {isMobile && showHistory && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowHistory(false)} />
      )}

      {/* Área principal de chat */}
      <Card className="flex-1 flex flex-col overflow-hidden p-0 shadow-xl">
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700'
              }`}>
                {msg.hasAttachment && (
                  <div className="flex items-center gap-1 text-xs mb-1 opacity-80">
                    <FileText size={12} />
                    <span>{msg.attachmentName}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                <span className="text-[10px] opacity-70 mt-1 block text-right">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {(loading || extractingFile) && (
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
                {extractingFile && <p className="text-xs text-gray-500 mt-1">Procesando PDF...</p>}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          {/* Indicador de archivo seleccionado */}
          {selectedFile && (
            <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <FileText size={16} className="text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{selectedFile.name}</span>
              </div>
              <button onClick={removeSelectedFile} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <X size={14} />
              </button>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && !extractingFile && handleSend()}
              placeholder="Consulta sobre contratos, riesgos o normativa..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition"
              disabled={loading || extractingFile}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Adjuntar PDF"
            >
              <Paperclip size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <Button onClick={handleSend} disabled={loading || extractingFile} className="rounded-full p-2 btn-primary">
              <Send size={18} />
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-2 text-center">
            Sube archivos PDF para analizar documentos de contratos
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatIA;