import 'react-i18next';
import en from '../public/locales/en/common.json';
import nl from '../public/locales/nl/common.json';
import fr from '../public/locales/fr/common.json';
import tr from '../public/locales/tr/common.json';
import ie from '../public/locales/ie/common.json';
import de from '../public/locales/de/common.json';
import it from '../public/locales/it/common.json';
import pt from '../public/locales/pt/common.json';
import gr from '../public/locales/gr/common.json';
import es from '../public/locales/es/common.json';

declare module 'react-i18next' {
    interface Resources {
       en: typeof en;
       nl: typeof nl;
       fr: typeof fr;
       tr: typeof tr;
       ie: typeof ie;
       de: typeof de;
       it: typeof it;
       pt: typeof pt;
       gr: typeof gr;
       es: typeof es;
    }
}