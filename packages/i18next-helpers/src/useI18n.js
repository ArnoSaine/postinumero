import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useI18n(options) {
  const { i18n } = useTranslation();
  return useMemo(() => i18n.cloneInstance(options), [
    i18n,
    ...Object.values(options),
  ]);
}
