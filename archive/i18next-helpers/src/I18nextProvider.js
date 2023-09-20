import { I18nextProvider as Provider } from 'react-i18next';
import useI18n from './useI18n';

export default function I18nextProvider({ children, ...options }) {
  return <Provider i18n={useI18n(options)}>{children}</Provider>;
}
