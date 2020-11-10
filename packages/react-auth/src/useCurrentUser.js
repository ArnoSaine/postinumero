import { useCallback, useContext } from 'react';
import Ajv from 'ajv';
import Context from './Context';

const validate = new Ajv().compile({
  oneOf: [
    {
      type: 'object',
      properties: {
        rights: {
          type: 'array',
          items: { type: 'string' },
        },
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
      const [currentUser, setCurrentUser] = useContext(Context);
      return [
        currentUser,
        useCallback(
          (currentUser) => {
            if (!validate(currentUser)) {
              console.error(
                'User should be null or an object with optional properties `roles: string[]` and `rights: string[]`.',
                validate.errors
              );
            }
            setCurrentUser(currentUser);
          },
          [setCurrentUser]
        ),
      ];
    }
  : () => useContext(Context);
