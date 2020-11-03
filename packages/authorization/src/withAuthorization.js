import { useState, forwardRef } from 'react';
import { Provider } from './Context';

export default (Component) =>
  forwardRef((props, ref) => (
    <Provider value={useState()}>
      <Component {...props} ref={ref} />
    </Provider>
  ));
