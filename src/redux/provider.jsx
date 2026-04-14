'use client';

import { Provider } from 'react-redux';
import { makeStore } from './store';
import { useRef } from 'react';

export default function ReduxProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
