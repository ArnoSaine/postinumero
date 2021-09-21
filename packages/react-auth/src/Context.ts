import { createContext } from 'react';

const Context = createContext<any>(undefined);

export default Context;
export const { Consumer, Provider } = Context;
