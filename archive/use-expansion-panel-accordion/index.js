import { useState } from 'react';

export default function useExpansionPanelAccordion() {
  const [expanded, setExpanded] = useState();
  return (panel) => ({
    expanded: expanded === panel,
    onChange(event, expanded) {
      setExpanded(expanded ? panel : undefined);
    },
  });
}
