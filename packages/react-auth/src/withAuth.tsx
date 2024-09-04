import { forwardRef, useState } from 'react';
import { Provider } from './Context.js';

export default function withAuth(Component: any) {
  return forwardRef<any, any>(
    (props, ref) =>
      (
        <Provider value={useState()}>
          <Component {...props} ref={ref} />
        </Provider>
      ) as JSX.Element,
  );
}
