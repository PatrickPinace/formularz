import type { APIRoute } from 'astro';
import { getFormContent } from '../../lib/content';

/**
 * Endpoint GET /api/form-config
 * Zwraca konfigurację formularza i treści (content map)
 */
export const GET: APIRoute = async () => {
  try {
    const content = await getFormContent();

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to load form config:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load form configuration' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
