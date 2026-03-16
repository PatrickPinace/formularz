import type { APIRoute } from 'astro';
import { updateSubmission } from '../../lib/nocodb';
import { mapAnswersToNocoRecord } from '../../lib/mapping';

/**
 * Endpoint POST /api/form-save
 * Zapisuje draft formularza (autosave)
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const { submission_uuid, answers, current_step } = payload;

    if (!submission_uuid) {
      return new Response(
        JSON.stringify({ error: 'Missing submission_uuid' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Mapuj do formatu NocoDB
    const record = mapAnswersToNocoRecord({
      ...answers,
      submission_uuid,
      current_step,
      status: 'draft',
    });

    // Zapisz do NocoDB
    try {
      await updateSubmission(submission_uuid, record);
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
    console.error('Failed to save draft:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save draft' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
