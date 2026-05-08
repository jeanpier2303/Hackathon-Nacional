
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, Plus, Trash2, MessageSquare, 
  Paperclip, FileText, X, ChevronLeft, Menu 
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  sendChatMessage,
  createChatSession,
  getChatSessions,
  getChatMessages,
  uploadPdf
} from '../services/api';




const ChatIA = () => {
  const [chats,setChats]=useState([]);
  const [activeChatId,setActiveChatId]=useState(null);
  const [messages,setMessages]=useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeChat=
  chats.find(
    c=>c.id===activeChatId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(()=>{

    cargarChats();

  },[]);

  const handleNewChat=async()=>{
    setLoading(false);
    try{

      const nuevaSesion=
        await createChatSession();

      setChats(prev => [
          {
            id:nuevaSesion.sesion_id,
            titulo:nuevaSesion.titulo
          },
          ...prev
        ]);

      setActiveChatId(
        nuevaSesion.sesion_id
      );

      setMessages([]);

      if(window.innerWidth<768){
        setSidebarOpen(false);
      }

    }catch(error){

      console.error(error);
    }
  };

  const handleDeleteChat=(chatId,e)=>{

  e.stopPropagation();

  const nuevosChats=
      chats.filter(
        c=>c.id!==chatId
      );

    setChats(nuevosChats);

    if(activeChatId===chatId){

      setMessages([]);

      if(nuevosChats.length>0){

        setActiveChatId(
          nuevosChats[0].id
        );

      }else{

        setActiveChatId(null);
      }
    }
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

  const cargarChats=async()=>{

  try{

    const data=
      await getChatSessions();

    setChats(data);

    if(data.length>0){

      setActiveChatId(
        data[0].id
      );
    }

    else{

      const nuevaSesion=
        await createChatSession();

      setChats([
        {
          id:nuevaSesion.sesion_id,
          titulo:nuevaSesion.titulo
        }
      ]);

      setActiveChatId(
        nuevaSesion.sesion_id
      );
    }

  }catch(error){

    console.error(error);
  }
};

const cargarMensajes=async(
      sesionId
    )=>{

      try{

        const data=
          await getChatMessages(
            sesionId
          );

        if(data.length===0){

          setMessages([
            {
              role:'assistant',
              content:
'Hola, soy GobIA Auditor. Estoy listo para ayudarte a analizar contratos públicos, revisar procesos SECOP II, detectar riesgos e irregularidades o analizar documentos PDF.\n\nPuedes escribir el ID de un contrato o hacer una pregunta para comenzar.'
            }
          ]);

          return;
        }

        setMessages(
              data.map(msg=>({
                ...msg,
                content:
                  msg.role==='assistant'
                    ? limpiarRespuesta(msg.content || '')
                    : msg.content
              }))
            );

      }catch(error){

        console.error(error);
      }
    };

  useEffect(()=>{

      if(activeChatId){

        cargarMensajes(
          activeChatId
        );
      }

    },[activeChatId]);


    const limpiarRespuesta=(texto)=>{

        return texto
          .replace(/\*\*/g,'')
          .replace(/###/g,'')
          .replace(/##/g,'')
          .replace(/#/g,'')
          .replace(/---/g,'')
          .replace(/•/g,'-')
          .trim();
      };

  const loadingRef = useRef(false);    
  const handleSend = async () => {

  if (!input.trim()) return;

  const texto = input;

  const userMsg = {
    role:'user',
    content:texto
  };

  setMessages(prev => [
    ...prev,
    userMsg
  ]);

  setInput('');
  setLoading(true);

  try {

    let rutaPdf = null;

    // SUBIR PDF SI EXISTE

    if(selectedFile){

      const upload =
        await uploadPdf(
          selectedFile
        );

      rutaPdf =
        upload.ruta_pdf;
    }

    // ENVIAR MENSAJE AL CHAT

    const data =
      await sendChatMessage({

        pregunta:texto,

        sesion_id:activeChatId,

        ruta_pdf:rutaPdf
      });

    const assistantMsg = {

      role:'assistant',

      content: limpiarRespuesta(
        data.respuesta
      )
    };

    setMessages(prev => [
      ...prev,
      assistantMsg
    ]);

    removeFile();

  } catch(error){

    console.error(error);

    setMessages(prev => [
      ...prev,
      {
        role:'assistant',
        content:'Ocurrió un error procesando el PDF Prueba mas tarde.'
      }
    ]);

  } finally {

    setLoading(false);
  }
};

  const getChatTitle=(chat)=>{

    return (
      chat.titulo ||
      'Nuevo chat'
    );
  };

  const renderMessageContent=(text)=>{

    const urlRegex=
      /(https?:\/\/[^\s]+)/g;

    const parts=
      text.split(urlRegex);

    return parts.map(
      (part,index)=>{

        if(part.match(urlRegex)){

          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-purple-600
                underline
                break-all
                hover:text-purple-800
              "
            >
              Abrir proceso SECOP
            </a>
          );
        }

        return (
          <span key={index}>
            {part}
          </span>
        );
      }
    );
  };


  return (
    <div className="h-[calc(100vh-8rem)] flex gap-3 sm:gap-4">
      {/* Sidebar historial - responsive */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 overflow-hidden rounded-2xl glass-card"
          >
            <div className="w-72 h-full flex flex-col">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Historial</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => { setLoading(false);setActiveChatId(chat.id); setSelectedFile(null); if (window.innerWidth < 768) setSidebarOpen(false); }}
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
                <Button onClick={handleNewChat} variant="primary" className="w-full gap-2 text-sm">
                  <Plus size={14} />
                  Nuevo chat
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mb-3 p-2 rounded-xl glass-card w-10 h-10 flex items-center justify-center"
          >
            <Menu size={18} />
          </button>
        )}

        <Card className="flex-1 flex flex-col overflow-hidden shadow-xl">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Sparkles className="text-purple-600" size={18} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">Asistente IA</h2>
                <p className="text-[10px] sm:text-xs text-gray-500">Centro de Inteligencia Anticorrupción</p>
              </div>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              {messages.filter(m=>m.role==='user').length} mensajes
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50/30 dark:bg-gray-900/20 custom-scrollbar">
            
              {messages.map((msg, idx) => (
                <motion.div
                  key={`${msg.role}-${idx}-${msg.content?.slice(0,20)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="whitespace-pre-wrap text-xs sm:text-sm">
                      {(msg.content || '').split('\n').map((line, i) => (
                        <p key={i} className="mb-1">
                          {renderMessageContent(line)}
                        </p>
                      ))}
                    </div>
                    <span className="text-[8px] sm:text-[10px] opacity-70 mt-1 block text-right">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                  <div className="flex gap-2 sm:gap-3 justify-start">
                    
                    <div className="
                      w-7 h-7 sm:w-8 sm:h-8
                      rounded-full
                      bg-gradient-to-br
                      from-purple-500
                      to-indigo-600
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    ">
                      <Bot size={14} className="text-white" />
                    </div>

                    <div className="
                      bg-white
                      dark:bg-gray-800
                      rounded-2xl
                      px-3
                      sm:px-4
                      py-3
                      rounded-bl-none
                      shadow-sm
                      border
                      border-gray-200
                      dark:border-gray-700
                    ">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>

                    </div>

                  </div>
                )}
              <div ref={messagesEndRef} />
           
          </div>

          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
            {selectedFile && (
              <div className="mb-2 sm:mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 max-w-[80%]">
                  <FileText size={14} className="text-purple-600 flex-shrink-0" />
                  <span className="text-xs truncate">{selectedFile.name}</span>
                  <span className="text-[10px] text-gray-500 hidden sm:inline">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button onClick={removeFile} className="p-1 rounded hover:bg-purple-200 dark:hover:bg-purple-800/50">
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
                className="flex-1 px-3 sm:px-4 py-2 rounded-full text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition flex items-center justify-center"
              >
                <Paperclip size={16} />
              </label>
              <Button onClick={handleSend} disabled={loading} className="rounded-full p-2 btn-primary">
                <Send size={16} />
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">Adjunta PDF de tus procesos</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatIA;