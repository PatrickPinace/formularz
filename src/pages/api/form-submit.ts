import type { APIRoute } from 'astro';
import { updateSubmission } from '../../lib/nocodb';
import { mapAnswersToNocoRecord } from '../../lib/mapping';
import { validateFullForm } from '../../lib/validation';

/**
 * Endpoint POST /api/form-submit
 * Finalizuje i wysyła formularz
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Pobierz env z Cloudflare runtime
    const env = locals?.runtime?.env;

    const payload = await request.json();
    const { submission_uuid, answers } = payload;

    if (!submission_uuid) {
      return new Response(
        JSON.stringify({ error: 'Missing submission_uuid' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Walidacja pełnego formularza
    const errors = validateFullForm(answers);
    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          errors,
        }),
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
      status: 'submitted',
      submitted_at_client: new Date().toISOString(),
    });

    // Zapisz do NocoDB
    try {
      await updateSubmission(submission_uuid, record, env);
    } catch (nocoError) {
      console.error('Failed to save submission to NocoDB:', nocoError);
      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        submission_uuid,
        message: 'Form submitted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Failed to submit form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit form' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
