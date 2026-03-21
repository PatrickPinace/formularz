import type { APIRoute } from 'astro';
import { createSubmission } from '../../lib/nocodb';

/**
 * Endpoint POST /api/form-start
 * Tworzy nowy draft formularza i zwraca UUID
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Astro 6: Import env z cloudflare:workers
    let env: any;
    try {
      const cf = await import('cloudflare:workers');
      env = cf.env;
    } catch (e) {
      env = import.meta.env;
    }

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return new Response(
      JSON.stringify({
        error: 'Failed to initialize form',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
