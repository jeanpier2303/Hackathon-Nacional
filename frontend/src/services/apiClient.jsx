const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log('📡 Llamando a:', url);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-Key': API_KEY }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, { ...options, headers });
    console.log('📡 Respuesta status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error respuesta:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
    }
    
    const json = await response.json();
    console.log('✅ Datos recibidos (primeros 100 bytes):', JSON.stringify(json).substring(0, 200));
    return json;
  } catch (error) {
    console.error('❌ Error en fetch:', error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};