import type { APIRoute } from 'astro';
import { createSubmission } from '../../lib/nocodb';

/**
 * Endpoint POST /api/form-start
 * Tworzy nowy draft formularza i zwraca UUID
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Pobierz env z Cloudflare runtime
    const env = locals?.runtime?.env;

    // Generuj UUID
    const submission_uuid = crypto.randomUUID();

    // Utwórz draft w NocoDB (jeśli skonfigurowane)
    try {
      await createSubmission({
        submission_uuid,
        status: 'draft',
        raw_answers_json: JSON.stringify({}),
        created_at_client: new Date().toISOString(),
      }, env);
    } catch (nocoError) {
      // Jeśli NocoDB nie jest skonfigurowane, ignorujemy błąd
      console.warn('NocoDB not configured, continuing without persistence:', nocoError);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        submission_uuid,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Failed to start form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to initialize form' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
