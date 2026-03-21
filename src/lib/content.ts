import type { ContentMap } from './types';

/**
 * Pobiera treści formularza z API
 * W produkcji to będzie pobierać z NocoDB przez endpoint /api/form-config
 */
export async function getFormContent(): Promise<ContentMap> {
  // Tymczasowo zwracamy mock data - później to będzie fetch do API
  // const res = await fetch('/api/form-config');
  // if (!res.ok) throw new Error('Cannot load form content');
  // return res.json();

  return getMockContent();
}

/**
 * Mock data - treści formularza po polsku
 * W produkcji będzie to w NocoDB w tabeli form_content
 */
function getMockContent(): ContentMap {
  return {
    // Krok intro
    'step.intro.title': 'Witamy w Medi3',
    'step.intro.description': 'Formularz rejestracyjny do Poradni Medi3. Prosimy o wypełnienie wszystkich wymaganych pól. Twoje dane są chronione zgodnie z RODO.',

    // Krok gender
    'step.gender.title': 'Wybierz płeć',
    'field.gender.label': 'Płeć',
    'field.gender.option.kobieta': 'Kobieta',
    'field.gender.option.mężczyzna': 'Mężczyzna',

    // Krok pregnancy_entry
    'step.pregnancy_entry.title': 'Ścieżka rejestracji',
    'step.pregnancy_entry.description': 'Czy chcesz zapisać się do położnej w ramach ciąży i szkoły rodzenia?',
    'field.pregnancy_path.label': 'Ciąża i położna',
    'field.pregnancy_path.option.yes': 'Tak, jestem w ciąży i chcę się zapisać do położnej',
    'field.pregnancy_path.option.no': 'Nie, interesuję się innymi usługami',

    // Krok identity_common
    'step.identity_common.title': 'Dane osobowe',
    'step.identity_common.description': 'Podaj swoje podstawowe dane kontaktowe',
    'field.ikp_status.label': 'Status IKP (Indywidualna Karta Pacjenta)',
    'field.ikp_status.help': 'IKP to twoja elektroniczna karta pacjenta w NFZ',
    'field.ikp_status.option.mam_ikp': 'Mam IKP',
    'field.ikp_status.option.nie_mam_ikp': 'Nie mam IKP',
    'field.ikp_status.option.nie_wiem': 'Nie wiem',
    'field.full_name.label': 'Imię i nazwisko',
    'field.full_name.placeholder': 'np. Anna Kowalska',
    'field.email.label': 'Adres email',
    'field.email.placeholder': 'np. anna@example.com',
    'field.phone.label': 'Numer telefonu',
    'field.phone.placeholder': 'np. 123 456 789',
    'field.pesel_or_birthdate.label': 'PESEL lub data urodzenia',
    'field.pesel_or_birthdate.help': 'Podaj PESEL (11 cyfr) lub datę urodzenia w formacie DD-MM-RRRR',
    'field.pesel_or_birthdate.placeholder': 'np. 12345678901 lub 01-01-1990',
    'field.address_main_street.label': 'Ulica i numer domu/mieszkania',
    'field.address_main_street.help': 'np. ul. Kwiatowa 12/5',
    'field.address_main_street.placeholder': 'ul. Kwiatowa 12/5',
    'field.address_main_postal_code.label': 'Kod pocztowy',
    'field.address_main_postal_code.help': 'np. 00-001',
    'field.address_main_postal_code.placeholder': '00-001',
    'field.address_main_city.label': 'Miasto',
    'field.address_main_city.help': 'np. Warszawa',
    'field.address_main_city.placeholder': 'Warszawa',

    // Usługi - mężczyźni
    'step.services_male.title': 'Wybierz interesujące Cię usługi',
    'step.services_male.description': 'Zaznacz usługi, z których chciałbyś skorzystać',
    'field.services_male_free.label': 'Usługi bezpłatne (NFZ)',
    'field.services_male_free.help': 'Możesz wybrać więcej niż jedną opcję',
    'field.services_male_free.option.porada_lekarza': 'Porada lekarza rodzinnego',
    'field.services_male_free.option.porada_poloznej': 'Porada położnej',
    'field.services_male_free.option.porada_psychologa': 'Porada psychologa',
    'field.services_male_free.option.badania_lab': 'Badania laboratoryjne',
    'field.services_male_free.option.inne': 'Inne',
    'field.services_male_free_other.label': 'Opisz inne usługi bezpłatne',
    'field.services_male_free_other.placeholder': 'Wpisz jakie usługi...',
    'field.services_male_paid.label': 'Usługi płatne',
    'field.services_male_paid.help': 'Możesz wybrać więcej niż jedną opcję',
    'field.services_male_paid.option.usg': 'USG',
    'field.services_male_paid.option.szczepienia': 'Szczepienia',
    'field.services_male_paid.option.masaz': 'Masaż',
    'field.services_male_paid.option.inne': 'Inne',
    'field.services_male_paid_other.label': 'Opisz inne usługi płatne',
    'field.services_male_paid_other.placeholder': 'Wpisz jakie usługi...',

    // Usługi - kobiety
    'step.services_female.title': 'Wybierz interesujące Cię usługi',
    'step.services_female.description': 'Zaznacz usługi, z których chciałabyś skorzystać',
    'field.services_female_free.label': 'Usługi bezpłatne (NFZ)',
    'field.services_female_free.help': 'Możesz wybrać więcej niż jedną opcję',
    'field.services_female_free.option.porada_lekarza': 'Porada lekarza rodzinnego',
    'field.services_female_free.option.porada_poloznej': 'Porada położnej',
    'field.services_female_free.option.porada_psychologa': 'Porada psychologa',
    'field.services_female_free.option.badania_lab': 'Badania laboratoryjne',
    'field.services_female_free.option.antykoncepcja': 'Antykoncepcja',
    'field.services_female_free.option.cytologia': 'Cytologia',
    'field.services_female_free.option.inne': 'Inne',
    'field.services_female_free_other.label': 'Opisz inne usługi bezpłatne',
    'field.services_female_free_other.placeholder': 'Wpisz jakie usługi...',
    'field.services_female_paid.label': 'Usługi płatne',
    'field.services_female_paid.help': 'Możesz wybrać więcej niż jedną opcję',
    'field.services_female_paid.option.usg': 'USG',
    'field.services_female_paid.option.szczepienia': 'Szczepienia',
    'field.services_female_paid.option.masaz': 'Masaż',
    'field.services_female_paid.option.fizjoterapia': 'Fizjoterapia',
    'field.services_female_paid.option.inne': 'Inne',
    'field.services_female_paid_other.label': 'Opisz inne usługi płatne',
    'field.services_female_paid_other.placeholder': 'Wpisz jakie usługi...',

    // Szczegóły ciąży
    'step.pregnancy_details.title': 'Szczegóły ciąży',
    'step.pregnancy_details.description': 'Podaj informacje o swojej ciąży i preferencjach',
    'field.midwife_choice.label': 'Wybór położnej',
    'field.midwife_choice.help': 'Jeśli nie wiesz jeszcze, możesz wybrać później',
    'field.midwife_choice.option.polozna_a': 'Położna Anna Nowak',
    'field.midwife_choice.option.polozna_b': 'Położna Maria Wiśniewska',
    'field.midwife_choice.option.polozna_c': 'Położna Ewa Kowalczyk',
    'field.midwife_choice.option.nie_wiem': 'Nie wiem jeszcze / pomoc w wyborze',
    'field.due_date.label': 'Przewidywany termin porodu',
    'field.due_date.help': 'W formacie DD-MM-RRRR',
    'field.pregnancy_care.label': 'Prowadzenie ciąży',
    'field.pregnancy_care.option.nfz': 'NFZ',
    'field.pregnancy_care.option.prywatnie': 'Prywatnie',
    'field.pregnancy_care.option.mieszane': 'Mieszane (NFZ + prywatnie)',
    'field.hospitalization.label': 'Czy byłaś hospitalizowana w ciąży?',
    'field.hospitalization.option.tak': 'Tak',
    'field.hospitalization.option.nie': 'Nie',
    'field.multiple_pregnancy.label': 'Czy jest to ciąża mnoga?',
    'field.multiple_pregnancy.option.tak': 'Tak',
    'field.multiple_pregnancy.option.nie': 'Nie',
    'field.postpartum_same_address.label': 'Czy po porodzie będziesz mieszkać pod tym samym adresem?',
    'field.postpartum_same_address.help': 'Chodzi o adres, pod którym będziesz przebywać z dzieckiem po porodzie',
    'field.postpartum_same_address.option.tak': 'Tak',
    'field.postpartum_same_address.option.nie': 'Nie',
    'field.postpartum_address_street.label': 'Ulica i numer domu/mieszkania',
    'field.postpartum_address_street.help': 'np. ul. Słoneczna 8/2',
    'field.postpartum_address_street.placeholder': 'ul. Słoneczna 8/2',
    'field.postpartum_address_postal_code.label': 'Kod pocztowy',
    'field.postpartum_address_postal_code.help': 'np. 00-001',
    'field.postpartum_address_postal_code.placeholder': '00-001',
    'field.postpartum_address_city.label': 'Miasto',
    'field.postpartum_address_city.help': 'np. Kraków',
    'field.postpartum_address_city.placeholder': 'Kraków',
    'field.authorized_person.label': 'Osoba upoważniona do odbioru wyników/informacji',
    'field.authorized_person.help': 'Opcjonalnie - imię, nazwisko i stopień pokrewieństwa',
    'field.authorized_person.placeholder': 'np. Jan Kowalski (mąż)',
    'field.birth_school.label': 'Czy planujesz uczestnictwo w szkole rodzenia?',
    'field.birth_school.option.tak': 'Tak',
    'field.birth_school.option.nie': 'Nie',
    'field.birth_school.option.nie_wiem': 'Nie wiem jeszcze',

    // Preferencje kontaktu
    'step.contact_preferences.title': 'Preferencje kontaktu',
    'step.contact_preferences.description': 'Jak chciałbyś/chciałabyś z nami komunikować się?',
    'field.participation_preference.label': 'Preferowana forma uczestnictwa',
    'field.participation_preference.help': 'Dotyczy wizyt i zajęć grupowych',
    'field.participation_preference.option.stacjonarne': 'Stacjonarne (osobiście)',
    'field.participation_preference.option.online': 'Online (przez internet)',
    'field.participation_preference.option.hybrydowo': 'Hybrydowo (w zależności od sytuacji)',
    'field.messengers.label': 'Preferowane komunikatory',
    'field.messengers.help': 'Możesz wybrać więcej niż jeden',
    'field.messengers.option.whatsapp': 'WhatsApp',
    'field.messengers.option.messenger': 'Messenger',
    'field.messengers.option.telegram': 'Telegram',
    'field.messengers.option.signal': 'Signal',
    'field.messengers.option.sms': 'SMS',
    'field.messengers.option.email': 'Email',
    'field.how_found.label': 'Skąd dowiedziałeś/dowiedziałaś się o Medi3?',
    'field.how_found.option.internet': 'Wyszukiwarka internetowa',
    'field.how_found.option.social_media': 'Media społecznościowe',
    'field.how_found.option.znajomi': 'Znajomi / Rekomendacja',
    'field.how_found.option.lekarz': 'Lekarz / Personel medyczny',
    'field.how_found.option.plakat': 'Plakat / Ulotka',
    'field.how_found.option.inne': 'Inne',
    'field.how_found_other.label': 'Podaj źródło',
    'field.how_found_other.placeholder': 'Skąd się dowiedziałeś...',
    'field.additional_notes.label': 'Dodatkowe uwagi',
    'field.additional_notes.help': 'Wszystko, co chciałbyś/chciałabyś nam przekazać',
    'field.additional_notes.placeholder': 'Twoje uwagi...',

    // Podsumowanie
    'step.summary.title': 'Podsumowanie',
    'step.summary.description': 'Sprawdź swoje dane przed wysłaniem formularza',
  };
}
