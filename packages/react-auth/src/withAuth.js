import { useState, forwardRef } from 'react';
import { Provider } from './Context';

export default function withAuth(Component) {
  return forwardRef((props, ref) => (
    <Provider value={useState()}>
      <Component {...props} ref={ref} />
    </Provider>
  ));
}
