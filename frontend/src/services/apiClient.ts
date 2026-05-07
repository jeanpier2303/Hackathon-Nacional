const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

const API_KEY =
  import.meta.env.VITE_API_KEY || '';

async function request(
  endpoint: string,
  options: RequestInit = {}
) {

  const url = `${API_BASE}${endpoint}`;

  console.log('📡 Llamando a:', url);

  const headers = {
    'Content-Type': 'application/json',

    ...(API_KEY && {
      'X-API-Key': API_KEY
    }),

    ...(options.headers || {})
  };

  try {

    const response = await fetch(
      url,
      {
        ...options,
        headers
      }
    );

    console.log(
      '📡 Status:',
      response.status
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(errorText);

      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      '❌ Error fetch:',
      error
    );

    throw error;
  }
}

export const api = {

  get: (endpoint: string) =>
    request(endpoint),

  post: (
    endpoint: string,
    data: any
  ) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  put: (
    endpoint: string,
    data: any
  ) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (endpoint: string) =>
    request(endpoint, {
      method: 'DELETE'
    })
};