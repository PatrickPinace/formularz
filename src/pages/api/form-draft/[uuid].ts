import type { APIRoute } from 'astro';
import { getSubmissionByUuid } from '../../../lib/nocodb';
import { mapNocoRecordToAnswers } from '../../../lib/mapping';

/**
 * Endpoint GET /api/form-draft/:uuid
 * Pobiera draft formularza po UUID
 */
export const GET: APIRoute = async ({ params, locals }) => {
  try {
    // Astro 6: Import env z cloudflare:workers
    let env: any;
    try {
      const cf = await import('cloudflare:workers');
      env = cf.env;
    } catch (e) {
      env = import.meta.env;
    }

    const { uuid } = params;

    if (!uuid) {
      return new Response(
        JSON.stringify({ error: 'Missing UUID' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Pobierz z NocoDB
    let record;
    try {
      record = await getSubmissionByUuid(uuid, env);
    } catch (nocoError) {
      console.warn('NocoDB not configured or failed to fetch:', nocoError);
      return new Response(
        JSON.stringify({ error: 'Draft not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!record) {
      return new Response(
        JSON.stringify({ error: 'Draft not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Mapuj z powrotem do Answers
    const answers = mapNocoRecordToAnswers(record);

    return new Response(
      JSON.stringify({
        ok: true,
        submission_uuid: uuid,
        answers,
        status: record.status,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Failed to load draft:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load draft' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
