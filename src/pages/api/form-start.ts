import type { APIRoute } from 'astro';
import { createSubmission } from '../../lib/nocodb';

/**
 * Endpoint POST /api/form-start
 * Tworzy nowy draft formularza i zwraca UUID
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.log('form-start: Starting...');

    // Astro 6: Import env z cloudflare:workers
    let env: any;
    try {
      const cf = await import('cloudflare:workers');
      env = cf.env;
      console.log('form-start: Using cloudflare:workers env');
    } catch (e) {
      // Lokalnie cloudflare:workers nie istnieje, użyj import.meta.env
      env = import.meta.env;
      console.log('form-start: Using import.meta.env (local)');
    }

    if (env) {
      console.log('form-start: env keys:', Object.keys(env));
      console.log('form-start: NOCODB_URL:', env.NOCODB_URL ? 'SET' : 'NOT SET');
      console.log('form-start: NOCODB_TOKEN:', env.NOCODB_TOKEN ? 'SET' : 'NOT SET');
      console.log('form-start: NOCODB_TABLE_ID:', env.NOCODB_FORM_SUBMISSIONS_TABLE_ID ? 'SET' : 'NOT SET');
    }

    // Generuj UUID
    console.log('form-start: Generating UUID...');
    const submission_uuid = crypto.randomUUID();
    console.log('form-start: UUID generated:', submission_uuid);

    // Utwórz draft w NocoDB (jeśli skonfigurowane)
    try {
      console.log('form-start: Calling createSubmission...');
      await createSubmission({
        submission_uuid,
        status: 'draft',
        raw_answers_json: JSON.stringify({}),
        created_at_client: new Date().toISOString(),
      }, env);
      console.log('form-start: createSubmission succeeded');
    } catch (nocoError) {
      // Jeśli NocoDB nie jest skonfigurowane, ignorujemy błąd
      console.warn('NocoDB not configured, continuing without persistence:', nocoError);
    }

    console.log('form-start: Returning success response');
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
