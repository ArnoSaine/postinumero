import { createContext, useContext } from 'react';

const Context = createContext();

export default Context;
export const { Consumer, Provider } = Context;
export const use = () => useContext(Context);
