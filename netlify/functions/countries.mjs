const API_URL = 'https://api.restcountries.com/countries/v5';
const ALLOWED_QUERY_PARAMS = ['q', 'region', 'offset'];

export default async function countries(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Método no permitido.' }), {
      status: 405,
      headers: {
        Allow: 'GET',
        'Content-Type': 'application/json',
      },
    });
  }

  const apiKey = process.env.RESTCOUNTRIES_API_KEY;
  if (!apiKey) {
    console.error('RESTCOUNTRIES_API_KEY is not configured for the Netlify Function.');
    return new Response(JSON.stringify({ error: 'La API de países no está configurada.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const requestUrl = new URL(request.url);
  const apiUrl = new URL(API_URL);
  for (const name of ALLOWED_QUERY_PARAMS) {
    for (const value of requestUrl.searchParams.getAll(name)) {
      apiUrl.searchParams.append(name, value);
    }
  }

  try {
    const apiResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return new Response(await apiResponse.text(), {
      status: apiResponse.status,
      headers: {
        'Content-Type': apiResponse.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Rest Countries request failed:', error);
    return new Response(JSON.stringify({ error: 'No se pudo contactar la API de países.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  path: '/api/countries/v5',
};
