Ogólny styl
Mobile‑first: szerokość formularza max 480–640 px, wycentrowana kolumna, dużo oddechu między elementami; użytkownik nie powinien musieć zoomować ani przewijać w bok.
​

Neutralna kolorystyka (np. biały / bardzo jasny szary) z jednym kolorem akcentu (np. róż Medi3) na przyciski, pasek postępu i zaznaczone odpowiedzi – UX będzie spokojny, a jednocześnie spójny z marką.

Krok po kroku – layout wizarda
Sugestia dla pojedynczego kroku (widok React):

Nagłówek kroku u góry, krótki, jednozdaniowy.
​

Pasek postępu (np. 6 „kropek” lub cienki progress bar z procentem).

Sekcja pytania:

tytuł jako <h2>,

krótki opis (maks 1–2 zdania).

Maksymalnie 3–5 pól na krok, pogrupowane tematycznie: „Dane kontaktowe”, „Informacje o ciąży”, „Preferencje udziału” itd.

Na dole:

przycisk „Wstecz” jako słabszy styl (link / ghost),

przycisk „Dalej” jako primary, pełna szerokość na mobile.
​

Dyskretny tekst o RODO / bezpieczeństwie danych w stopce (np. „Twoje dane są przetwarzane przez Fundację Medi3 zgodnie z RODO”).
​

Schematyczny JSX:

tsx
<div className="step">
  <header className="step-header">
    <p className="step-counter">Krok {currentIndex + 1} z {totalSteps}</p>
    <h2>{title}</h2>
    {description && <p className="step-description">{description}</p>}
    <div className="step-progress">
      <div className="step-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  </header>

  <main className="step-body">
    {/* pola formularza */}
  </main>

  <footer className="step-footer">
    {canGoBack && <button onClick={onBack} className="btn-secondary">Wstecz</button>}
    <button onClick={onNext} className="btn-primary">
      {isLastStep ? 'Wyślij zgłoszenie' : 'Dalej'}
    </button>
  </footer>
</div>
Pytania i odpowiedzi – mikro‑UX
Zacznij od prostych, „lekkich” pytań: płeć, czy ciąża, podstawowe dane – dopiero potem wchodź w bardziej szczegółowe rzeczy typu hospitalizacja czy dane osoby upoważnionej.
​
​

Radio/checkboxy rób jako duże „kafle”, łatwe do kliknięcia kciukiem, z jasnym stanem zaznaczenia; tekst odpowiedzi może mieć 2 linie, ale pilnuj dobrego kontrastu.
​

Pola tekstowe z wyraźnymi labelami nad polem, nie wewnątrz jako placeholder (żeby po wypełnieniu nadal było widać, co to za pole).
​

Inline validation: błędy pokazuj dopiero przy próbie przejścia dalej lub po blur, z czerwonym, prostym komunikatem przy polu.
​

Przykładowy kafel odpowiedzi:

tsx
<button
  type="button"
  className={clsx('choice-tile', value === selected && 'choice-tile--active')}
  onClick={() => onChange(value)}
>
  <span className="choice-label">{label}</span>
  {hint && <span className="choice-hint">{hint}</span>}
</button>
Styl wizualny – konkretne elementy
Pasek postępu: cienki bar + numer kroku; procent możesz liczyć wg liczby kroków widocznych dla danej ścieżki.

Sekcje „ważne” (np. opis programu, informacje o opłatach dla osoby towarzyszącej) można włożyć w delikatny box z ikoną „i” po lewej.
​

Na podsumowaniu: podziel dane na bloki („Dane osobowe”, „Usługi”, „Informacje o ciąży”, „Preferencje”), każdy w osobnej karcie z opcją „Edytuj” -> skok do danego kroku.
​

CSS‑owo:

użyj prostego utility‑first (Tailwind, UnoCSS) albo własnej małej warstwy btn, field, tile, żeby deweloper nie tonął w stylach; formularze bardzo korzystają na spójnych komponentach.
​

czcionka bezszeryfowa, 16–18 px na mobile, min. 44 px wysokości dla tap‑targetów (guidelines mobilne).
​

Zachowanie przy błędach i przerwaniach
Przy problemie z API (NocoDB / backend) nie gub odpowiedzi – pokaż komunikat na górze („Coś poszło nie tak, spróbuj ponownie za chwilę, Twoje odpowiedzi są zachowane w tej przeglądarce”).
​

Możesz lokalnie trzymać answers w localStorage powiązanym z submission_uuid, żeby po odświeżeniu strona wczytała ostatni stan i porównała go z draftem z backendu.
​

Co możesz konkretnie zlecić grafikowi / devowi
Zaprojektować jeden uniwersalny layout kroku (jak wyżej) + wariant podsumowania – reszta powstanie z konfiguracji.
​

Zdefiniować bibliotekę komponentów:

FormLayout

ProgressBar

StepHeader

ChoiceTile (radio/checkbox)

TextField, TextareaField, DateField

ErrorMessage, InfoBox

ButtonPrimary, ButtonSecondary

Przygotować „styl Medi3”: kolory, font, promień zaokrągleń, spacing – i zaaplikować je do tych komponentów, bez mieszania logiki.
​

Jeżeli chcesz, możesz mi podesłać teraz zrzut / link do obecnego frontu, a podpowiem Ci bardzo konkretnie: co bym zmienił w layoutach 2–3 kroków (np. IKP, usługi, ciąża), żeby to wyglądało bardziej „produkcyjnie”.