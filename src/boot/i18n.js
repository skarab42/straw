import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import { Quasar } from 'quasar'

export default async ({ app, Vue }) => {
  Vue.use(VueI18n)

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: Quasar.lang.getLocale(),
    fallbackLocale: 'en-us',
    messages
  })
}
