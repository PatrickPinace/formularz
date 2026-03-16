Tak — da się to zrobić w Astro, z Reactem do warstwy interaktywnej i endpointami Astro jako własnym backendem pośredniczącym między formularzem a NocoDB.
​

Poniżej masz gotowy, dość dokładny opis projektu dla dewelopera, razem z rekomendowaną architekturą, sposobem budowy i przykładami kodu.
​

Cel projektu
Celem jest stworzenie publicznego formularza wieloetapowego dla Medi3, który zachowuje logikę drzewa z PDF, ale prezentuje ją użytkownikowi jako prosty wizard krok po kroku zamiast jednego dużego schematu.
​
Formularz ma obsługiwać co najmniej ścieżkę usług ogólnych oraz ścieżkę dla kobiet w ciąży zapisujących się do położnej / szkoły rodzenia, wraz z pytaniami o IKP, dane osobowe, wybór położnej, adres pobytu po porodzie, termin porodu, preferencje uczestnictwa, komunikatory, źródło pozyskania i uwagi.
​
Treści pytań i etykiety odpowiedzi mają być możliwie łatwe do edycji, a zapis danych ma trafiać do NocoDB przez API.
​
​

Architektura
Astro pozwala tworzyć własne endpointy, a w trybie SSR / server mode działają one jako żywe endpointy serwerowe wywoływane na żądanie; Astro ma też oficjalną integrację React do renderowania i hydracji komponentów po stronie klienta.
​
​
NocoDB udostępnia REST API do pracy z danymi i metadanymi, więc dobrze nadaje się tu jako warstwa danych, panel administracyjny i źródło treści formularza.
​

Rekomendowana architektura:

Frontend: Astro + React wizard.

Backend aplikacyjny: endpointy Astro w src/pages/api/*.

Backend danych: NocoDB.

Automatyzacje: webhooki / n8n po zapisie zgłoszenia.

Podział odpowiedzialności:

Warstwa	Co robi
Astro pages	Render stron publicznych formularza
React wizard	Obsługa kroków, stanu formularza, walidacji UI, przejść
Astro API routes	start, save, submit, pobranie configu, mapowanie do NocoDB
NocoDB	Przechowywanie zgłoszeń, treści formularza, wersji i statusów
n8n / webhook	Dalsza obsługa po wysłaniu formularza
Moja rekomendacja projektowa:

Nie łączyć przeglądarki bezpośrednio z NocoDB.

Frontend ma rozmawiać tylko z własnym API Astro.

Astro API ma rozmawiać z NocoDB.

Logika przejść ma być w aplikacji.

Treści mają być edytowalne poza kodem.

Jak formularz ma działać
Z PDF wynika główny flow: ekran informacyjny z RODO, wybór płci, rozgałęzienie ciąża / inne usługi, dane wspólne, potem ścieżka usług albo ścieżka ciążowa, następnie preferencje kontaktu i podsumowanie.
​
W ścieżce usług formularz ma pokazywać różne zestawy usług bezpłatnych i płatnych dla kobiet i mężczyzn, a w ścieżce ciążowej dodatkowo pytania o wybór położnej, adres pobytu z dzieckiem, termin porodu, prowadzenie ciąży, hospitalizację, ciążę mnogą, osobę upoważnioną i preferencje uczestnictwa.
​
Pola typu „Inne” mają odsłaniać dodatkowe pole tekstowe, a użytkownik ma widzieć tylko te pytania, które wynikają z wcześniejszych odpowiedzi.
​

Wymagania UX:

1 ekran = 1 decyzja albo mała grupa pól.

Pasek postępu.

Przyciski Wstecz / Dalej.

Podsumowanie przed wysłaniem.

Czytelny mobile-first layout.

Możliwość autosave draftu.

Wznowienie formularza po odświeżeniu.

Proponowane kroki:

intro — informacje organizacyjne i RODO.
​

gender — kobieta / mężczyzna.
​

pregnancy_entry — tylko dla kobiet: ciąża i położna czy inne usługi.
​

identity_common — IKP, imię i nazwisko, e-mail, telefon, PESEL lub data urodzenia, adres.
​

services_female albo services_male — usługi bezpłatne i płatne.
​

pregnancy_details — dane ciążowe i wybór położnej.
​

contact_preferences — preferencje uczestnictwa, komunikatory, źródło kontaktu, uwagi.
​

summary — podsumowanie i submit.
​

Najważniejsze reguły:

mężczyzna -> pomija pytanie o ciążę.

kobieta + inne_usługi -> ścieżka usług dla kobiet.

kobieta + ciąża_i_położna -> ścieżka ciążowa.

Każde inne -> dodatkowe pole tekstowe.

adres po porodzie taki sam = nie -> pokaż pole adresu po porodzie.

Dane i edycja treści
Najlepiej rozdzielić projekt na trzy obszary danych: odpowiedzi użytkowników, treści formularza oraz wersje konfiguracji.
​
Taki podział ułatwi edycję copy bez przepisywania komponentów, a jednocześnie pozwoli utrzymać stabilną logikę przejść zgodną z diagramem.
​

Proponowane tabele w NocoDB:

form_submissions

form_content

form_versions

Tabela form_submissions ma przechowywać rekord końcowy i draft użytkownika.
Minimalne pola:

submission_uuid

status (draft, submitted, reviewed, archived)

flow_type

gender

pregnancy_path

ikp_status

full_name

email

phone

pesel_or_birthdate

address_main

pola usług

pola ścieżki ciążowej

pola preferencji i kontaktu

raw_answers_json

current_step

created_at_client

submitted_at_client

Tabela form_content ma przechowywać edytowalne treści.
Proponowane pola:

key

locale

type

label

value_text

value_json

sort_order

is_active

version

Przykładowe rekordy form_content:

step.gender.title

field.gender.label

field.gender.options

field.ikp_status.label

field.ikp_status.options

step.pregnancy_details.description

Tabela form_versions ma przechowywać wersje publikacji formularza.
Proponowane pola:

version_code

is_active

published_at

notes

Ważna zasada dla dewelopera:

label może być edytowalny.

helpText może być edytowalny.

kolejność opcji może być edytowalna.

value, step_id, field_id i warunki przejścia nie powinny być swobodnie zmieniane przez edycję copy.

Najlepszy kompromis:

logika przejść w pliku flow.ts,

treści i etykiety w form_content,

zapis odpowiedzi w form_submissions.

Spec techniczny
Astro ma recipe dla formularzy z API routes: formularz po stronie klienta przechwytuje submit przez JavaScript, tworzy FormData i wysyła je do endpointu POST, a endpoint przetwarza dane po stronie serwera.
​
To dokładnie pasuje do tego projektu, tylko zamiast prostego HTML form warto zbudować własny wizard React, który komunikuje się z endpointami Astro.
​
​

Struktura projektu
text
src/
  pages/
    formularz.astro
    api/
      form-config.ts
      form-start.ts
      form-save.ts
      form-submit.ts
      form-draft/[uuid].ts
  components/
    form/
      FormWizard.tsx
      StepRenderer.tsx
      ProgressBar.tsx
      Navigation.tsx
      fields/
        RadioField.tsx
        CheckboxField.tsx
        TextField.tsx
        TextareaField.tsx
        DateField.tsx
  lib/
    flow.ts
    content.ts
    validation.ts
    visibility.ts
    mapping.ts
    nocodb.ts
    types.ts
astro.config.mjs
js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node(),
  integrations: [react()],
});
Typy formularza
ts
export type FieldType =
  | 'radio'
  | 'checkbox'
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'date';

export type Option = {
  value: string;
  labelKey: string;
};

export type VisibleIf = {
  field: string;
  equals?: string;
  includes?: string;
};

export type Field = {
  id: string;
  type: FieldType;
  labelKey: string;
  helpKey?: string;
  required?: boolean;
  options?: Option[];
  visibleIf?: VisibleIf[];
};

export type Rule = {
  when: Record<string, unknown>;
  goTo: string;
};

export type Step = {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  type: 'info' | 'question' | 'group' | 'summary';
  fields?: Field[];
  next?: string | Rule[];
};
flow.ts
ts
export const steps: Step[] = [
  {
    id: 'intro',
    type: 'info',
    titleKey: 'step.intro.title',
    descriptionKey: 'step.intro.description',
    next: 'gender',
  },
  {
    id: 'gender',
    type: 'question',
    titleKey: 'step.gender.title',
    fields: [
      {
        id: 'gender',
        type: 'radio',
        labelKey: 'field.gender.label',
        required: true,
        options: [
          { value: 'kobieta', labelKey: 'field.gender.option.kobieta' },
          { value: 'mężczyzna', labelKey: 'field.gender.option.mężczyzna' },
        ],
      },
    ],
    next: [
      { when: { gender: 'kobieta' }, goTo: 'pregnancy_entry' },
      { when: { gender: 'mężczyzna' }, goTo: 'identity_common' },
    ],
  },
  {
    id: 'pregnancy_entry',
    type: 'question',
    titleKey: 'step.pregnancy_entry.title',
    fields: [
      {
        id: 'pregnancy_path',
        type: 'radio',
        labelKey: 'field.pregnancy_path.label',
        required: true,
        options: [
          { value: 'ciąża_i_położna', labelKey: 'field.pregnancy_path.option.yes' },
          { value: 'inne_usługi', labelKey: 'field.pregnancy_path.option.no' },
        ],
      },
    ],
    next: 'identity_common',
  },
];
content loader
ts
export type ContentMap = Record<string, string | Array<{ value: string; label: string }>>;

export async function getFormContent(): Promise<ContentMap> {
  const res = await fetch(`${import.meta.env.NOCODB_PROXY_BASE}/api/form-config`);
  if (!res.ok) throw new Error('Cannot load form content');
  return res.json();
}
FormWizard.tsx
tsx
import { useMemo, useState } from 'react';

type Answers = Record<string, any>;

export default function FormWizard({ steps, content }: { steps: Step[]; content: any }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [stepId, setStepId] = useState('intro');

  const step = useMemo(() => steps.find(s => s.id === stepId)!, [steps, stepId]);

  function updateField(id: string, value: any) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  function resolveNext(): string | null {
    if (!step.next) return null;
    if (typeof step.next === 'string') return step.next;

    for (const rule of step.next) {
      const ok = Object.entries(rule.when).every(([k, v]) => answers[k] === v);
      if (ok) return rule.goTo;
    }
    return null;
  }

  function handleNext() {
    const next = resolveNext();
    if (next) setStepId(next);
  }

  return (
    <div>
      <h1>{String(content[step.titleKey] ?? step.titleKey)}</h1>
      {step.fields?.map(field => (
        <div key={field.id}>
          <label>{String(content[field.labelKey] ?? field.labelKey)}</label>
        </div>
      ))}
      <button type="button" onClick={handleNext}>Dalej</button>
    </div>
  );
}
Endpoint form-submit.ts
ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.json();

  // 1. validate payload
  // 2. map payload to NocoDB record
  // 3. save to NocoDB
  // 4. return uuid / status

  return new Response(
    JSON.stringify({ ok: true, submissionUuid: payload.submission_uuid }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
Klient NocoDB
ts
const NOCODB_URL = import.meta.env.NOCODB_URL;
const NOCODB_TOKEN = import.meta.env.NOCODB_TOKEN;
const TABLE_ID = import.meta.env.NOCODB_FORM_SUBMISSIONS_TABLE_ID;

export async function createSubmission(record: Record<string, any>) {
  const res = await fetch(`${NOCODB_URL}/api/v2/tables/${TABLE_ID}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xc-token': NOCODB_TOKEN,
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NocoDB create failed: ${text}`);
  }

  return res.json();
}
Mapping do rekordu
ts
export function mapAnswersToNocoRecord(a: Record<string, any>) {
  return {
    submission_uuid: a.submission_uuid,
    status: a.status ?? 'submitted',
    flow_type: a.pregnancy_path === 'ciąża_i_położna' ? 'pregnancy_midwife' : 'general_services',
    gender: a.gender ?? null,
    pregnancy_path: a.pregnancy_path ?? null,
    ikp_status: a.ikp_status ?? null,
    full_name: a.full_name ?? null,
    email: a.email ?? null,
    phone: a.phone ?? null,
    pesel_or_birthdate: a.pesel_or_birthdate ?? null,
    address_main: a.address_main ?? null,
    raw_answers_json: JSON.stringify(a),
    current_step: a.current_step ?? null,
    submitted_at_client: a.submitted_at_client ?? null,
  };
}
Endpointy aplikacji
Astro endpointy mogą obsługiwać różne metody HTTP, a w SSR mają dostęp do pełnego obiektu Request, więc nadają się do GET i POST dla konfiguracji, draftów i submitu.
​
Deweloper powinien przygotować następujące endpointy:

Endpoint	Metoda	Cel
/api/form-config	GET	Zwraca aktywne treści i opcje formularza
/api/form-start	POST	Tworzy submission_uuid i inicjuje draft
/api/form-save	POST	Zapisuje draft po kroku
/api/form-submit	POST	Waliduje i zapisuje finalny rekord
/api/form-draft/:uuid	GET	Odtwarza draft po wejściu ponownie
Walidacja
Walidację podzieliłbym na dwie warstwy:

frontend: required, format e-mail, format telefonu, podstawowe błędy UX,

backend: pełna walidacja biznesowa zależna od ścieżki.

Przykłady reguł backendowych:

gender jest wymagane zawsze.

pregnancy_path wymagane tylko dla kobieta.

due_date wymagane tylko dla ciąża_i_położna.

postpartum_address wymagane, gdy postpartum_same_address = nie.

pole *_other wymagane, gdy wybrano inne.

Sugestie implementacyjne
Najlepiej, żeby deweloper zrobił formularz jako config-driven engine, a nie ręcznie kodowane ekrany.
To oznacza:

renderer czyta steps,

renderer czyta content,

funkcja resolveNext() liczy następny krok,

funkcja isVisible() ocenia, czy pokazać dane pole,

funkcja validateStep() waliduje tylko aktywny krok.

Przykład isVisible:

ts
export function isVisible(field: Field, answers: Record<string, any>) {
  if (!field.visibleIf?.length) return true;

  return field.visibleIf.every(rule => {
    if (rule.equals !== undefined) return answers[rule.field] === rule.equals;
    if (rule.includes !== undefined) return Array.isArray(answers[rule.field]) && answers[rule.field].includes(rule.includes);
    return true;
  });
}
Przykład validateStep:

ts
export function validateStep(step: Step, answers: Record<string, any>) {
  const errors: Record<string, string> = {};

  for (const field of step.fields ?? []) {
    if (!isVisible(field, answers)) continue;

    const value = answers[field.id];
    if (field.required && (value === undefined || value === null || value === '')) {
      errors[field.id] = 'Pole wymagane';
    }
  }

  return errors;
}
Kryteria odbioru
Formularz działa jako wizard.

Logika jest zgodna z PDF.

Użytkownik widzi tylko właściwe pytania.

Copy można zmieniać bez edycji komponentów.

Tokeny i komunikacja z NocoDB nie są wystawione do klienta.

Można zapisać draft i wznowić formularz.

Dane kończą jako rekord w NocoDB.

Deweloper zostawia prostą instrukcję, jak dodać nowe pole, odpowiedź i krok.

Jeśli chcesz, mogę w następnym kroku przygotować Ci jeszcze bardziej „gotowy do przeklejenia” dokument w formacie:

Opis projektu

Zakres MVP

Zadania backend

Zadania frontend

Schemat tabel NocoDB

Lista endpointów

Definition of Done