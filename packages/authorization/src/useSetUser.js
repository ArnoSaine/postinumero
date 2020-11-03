import { useCallback } from 'react';
import Ajv from 'ajv';
import { use } from './Context';

const validate = new Ajv().compile({
  oneOf: [
    {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    { type: 'null' },
  ],
});

export default process.env.NODE_ENV === 'development'
  ? () => {
      const setUser = use()[1];
      return useCallback(
        (user) => {
          if (!validate(user)) {
            console.error(
              'User should be null or object with property `roles: string[]`',
              validate.errors
            );
          }
          setUser(user);
        },
        [setUser]
      );
    }
  : () => use()[1];
