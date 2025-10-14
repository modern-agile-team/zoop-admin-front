import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'src/lib/apis/spec.json',
      converterOptions: true,
      filters: {
        tags: ['auth'],
      },
    },
    output: {
      target: 'src/lib/apis/_generated',
      mode: 'split',
      override: {
        mutator: {
          path: 'src/shared/service/api/client/index.ts',
          name: 'orvalInstance',
        },
        enumGenerationType: 'const',
      },
    },
  },
  admin: {
    input: {
      target: 'src/lib/admins/spec.json',
      converterOptions: true,
    },
    output: {
      target: 'src/lib/admins/_generated',
      mode: 'split',
      override: {
        mutator: {
          path: 'src/shared/service/api/client/index.ts',
          name: 'orvalInstance',
        },
        enumGenerationType: 'const',
      },
    },
  },
});
