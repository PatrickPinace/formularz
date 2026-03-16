import type { FormSubmission } from './types';

/**
 * Klient NocoDB API
 */

// Konfiguracja z zmiennych środowiskowych
const getNocoDBConfig = () => {
  const url = import.meta.env.NOCODB_URL;
  const token = import.meta.env.NOCODB_TOKEN;
  const tableId = import.meta.env.NOCODB_FORM_SUBMISSIONS_TABLE_ID;

  if (!url || !token || !tableId) {
    console.warn('NocoDB configuration is incomplete. Check environment variables.');
  }

  return { url, token, tableId };
};

/**
 * Tworzy nowy rekord w tabeli form_submissions
 */
export async function createSubmission(record: FormSubmission): Promise<any> {
  const { url, token, tableId } = getNocoDBConfig();

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
 * Aktualizuje istniejący rekord (draft)
 */
export async function updateSubmission(uuid: string, record: Partial<FormSubmission>): Promise<any> {
  const { url, token, tableId } = getNocoDBConfig();

  if (!url || !token || !tableId) {
    throw new Error('NocoDB is not configured. Missing environment variables.');
  }

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
    throw new Error('Failed to find submission');
  }

  const data = await findRes.json();
  if (!data.list || data.list.length === 0) {
    throw new Error('Submission not found');
  }

  const recordId = data.list[0].Id;

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
    throw new Error(`NocoDB update failed: ${updateRes.status} ${text}`);
  }

  return updateRes.json();
}

/**
 * Pobiera draft po UUID
 */
export async function getSubmissionByUuid(uuid: string): Promise<any | null> {
  const { url, token, tableId } = getNocoDBConfig();

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
export async function getFormContentFromNocoDB(): Promise<any[]> {
  const { url, token } = getNocoDBConfig();
  const contentTableId = import.meta.env.NOCODB_FORM_CONTENT_TABLE_ID;

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
