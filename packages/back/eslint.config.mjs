import { sharedConfig } from '../../eslint.config.mjs';
import globals from 'globals';

export default [
  ...sharedConfig,

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
