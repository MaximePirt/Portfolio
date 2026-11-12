import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr/translation.json'
import en from './locales/en/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false
  }
})

/**
 * @brief Keeps the document in the current language: `lang` attribute (screen readers,
 * translation tools), tab title and meta description (link previews, search engines).
 */
function applyDocumentLanguage() {
  document.documentElement.lang = i18n.language
  document.title = i18n.t('meta.title')
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('meta.description'))
}

applyDocumentLanguage()
i18n.on('languageChanged', applyDocumentLanguage)

export default i18n
