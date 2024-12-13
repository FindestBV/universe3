import 'react-i18next';
import en from '../public/locales/en/common.json';
import nl from '../public/locales/nl/common.json';
import fr from '../public/locales/fr/common.json';
import tr from '../public/locales/tr/common.json';
import ie from '../public/locales/ie/common.json';

declare module 'react-i18next' {
    interface Resources {
       en: typeof en;
       nl: typeof nl;
       fr: typeof fr;
       tr: typeof tr;
       ie: typeof ie;
    }
}