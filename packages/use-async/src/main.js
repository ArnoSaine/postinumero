import { useEffect } from 'react';
import stringify from 'fast-json-stable-stringify';
import memoize from 'memoizee';
import useForceUpdate from 'use-force-update';

function value() {
  let value;
  return (nextValue) => (nextValue ? (value = nextValue) : value);
}

export default function create(func, config) {
  const memoizeConfig = {
    length: false,
    normalizer: stringify,
    ...config,
  };

  const memoizedSuspender = memoize(value, memoizeConfig);
  const memoizedValue = memoize(value, memoizeConfig);
  const memoizedUpdaters = memoize(() => new Set(), memoizeConfig);

  async function asyncCallSafe(...args) {
    try {
      return [null, await func(...args)];
    } catch (error) {
      return [error];
    }
  }

  async function asyncCall(...args) {
    memoizedValue(...args)(await asyncCallSafe(...args));
  }

  function call(...args) {
    return memoizedSuspender(...args)(asyncCall(...args));
  }

  function useCallSafe(...args) {
    const forceUpdate = useForceUpdate();
    useEffect(() => {
      const updaters = memoizedUpdaters(...args);
      updaters.add(forceUpdate);
      return () => {
        updaters.delete(forceUpdate);
        if (!updaters.size) {
          memoizedUpdaters.delete(...args);
          memoizedSuspender.delete(...args);
          memoizedValue.delete(...args);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    let value = memoizedValue(...args)();
    if (value) {
      return value;
    }
    // Throw memoized suspender or create one and throw it.
    throw memoizedSuspender(...args)() ?? call(...args);
  }

  function useCall(...args) {
    const [error, data] = useCallSafe(...args);
    if (error) {
      throw error;
    }
    return data;
  }

  async function recall(...args) {
    const updaters = memoizedUpdaters(...args);
    if (updaters.size) {
      await call(...args);
      updaters.forEach((updater) => updater());
    }
  }

  return [useCall, recall, useCallSafe];
}
