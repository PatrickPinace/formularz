import type { FormSubmission } from './types';

/**
 * Klient NocoDB API
 */

// Konfiguracja z zmiennych środowiskowych
// Przyjmuje env object z Cloudflare runtime lub import.meta.env jako fallback
const getNocoDBConfig = (env?: any) => {
  // Na Cloudflare Pages używamy env z runtime, lokalnie import.meta.env
  const source = env || import.meta.env;

  const url = source.NOCODB_URL;
  const token = source.NOCODB_TOKEN;
  const tableId = source.NOCODB_FORM_SUBMISSIONS_TABLE_ID;

  if (!url || !token || !tableId) {
    console.warn('NocoDB configuration is incomplete. Check environment variables.');
    console.warn('Available env keys:', Object.keys(source || {}));
  }

  return { url, token, tableId };
};

/**
 * Tworzy nowy rekord w tabeli form_submissions
 */
export async function createSubmission(record: FormSubmission, env?: any): Promise<any> {
  const { url, token, tableId } = getNocoDBConfig(env);

  if (!url || !token || !tableId) {
    throw new Error('NocoDB is not configured. Missing environment variables.');
  }

  const res = await fetch(`${url}/api/v2/tables/${tableId}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xc-token': token,
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NocoDB create failed: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Aktualizuje istniejący rekord (draft) lub tworzy nowy jeśli nie istnieje (upsert)
 */
export async function updateSubmission(uuid: string, record: Partial<FormSubmission>, env?: any): Promise<any> {
  const { url, token, tableId } = getNocoDBConfig(env);

  if (!url || !token || !tableId) {
    throw new Error('NocoDB is not configured. Missing environment variables.');
  }

  console.log('updateSubmission: Looking for submission with UUID:', uuid);

  // Najpierw znajdź rekord po UUID
  const findRes = await fetch(
    `${url}/api/v2/tables/${tableId}/records?where=(submission_uuid,eq,${uuid})`,
    {
      headers: {
        'xc-token': token,
      },
    }
  );

  if (!findRes.ok) {
    console.error('updateSubmission: Failed to search for submission:', findRes.status);
    throw new Error('Failed to find submission');
  }

  const data = await findRes.json();

  // Jeśli rekord nie istnieje, utwórz nowy (upsert)
  if (!data.list || data.list.length === 0) {
    console.log('updateSubmission: Submission not found, creating new one (upsert)');
    return await createSubmission({ submission_uuid: uuid, ...record } as FormSubmission, env);
  }

  const recordId = data.list[0].Id;
  console.log('updateSubmission: Found submission, updating record ID:', recordId);

  // Teraz aktualizuj rekord
  const updateRes = await fetch(`${url}/api/v2/tables/${tableId}/records`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'xc-token': token,
    },
    body: JSON.stringify({ Id: recordId, ...record }),
  });

  if (!updateRes.ok) {
    const text = await updateRes.text();
    console.error('updateSubmission: Update failed:', updateRes.status, text);
    throw new Error(`NocoDB update failed: ${updateRes.status} ${text}`);
  }

  console.log('updateSubmission: Successfully updated');
  return updateRes.json();
}

/**
 * Pobiera draft po UUID
 */
export async function getSubmissionByUuid(uuid: string, env?: any): Promise<any | null> {
  const { url, token, tableId } = getNocoDBConfig(env);

  if (!url || !token || !tableId) {
    throw new Error('NocoDB is not configured. Missing environment variables.');
  }

  const res = await fetch(
    `${url}/api/v2/tables/${tableId}/records?where=(submission_uuid,eq,${uuid})`,
    {
      headers: {
        'xc-token': token,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch submission');
  }

  const data = await res.json();
  if (!data.list || data.list.length === 0) {
    return null;
  }

  return data.list[0];
}

/**
 * Pobiera treści formularza z tabeli form_content
 */
export async function getFormContentFromNocoDB(env?: any): Promise<any[]> {
  const { url, token } = getNocoDBConfig(env);
  const source = env || import.meta.env;
  const contentTableId = source.NOCODB_FORM_CONTENT_TABLE_ID;

  if (!url || !token || !contentTableId) {
    console.warn('Form content table not configured');
    return [];
  }

  const res = await fetch(
    `${url}/api/v2/tables/${contentTableId}/records?where=(is_active,eq,true)&sort=sort_order`,
    {
      headers: {
        'xc-token': token,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch form content');
  }

  const data = await res.json();
  return data.list || [];
}
