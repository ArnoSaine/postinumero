import { useTranslation } from 'react-i18next';

export default function useT(...args) {
  const { t } = useTranslation(...args);
  return (...args) => t(...args);
}
