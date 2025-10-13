import { defineConfig } from 'orval';

export default defineConfig({
  backend: {
    input: {
      target: 'src/lib/apis/spec.json',
      converterOptions: true,
      filters: {
        tags: ['auth', 'quiz'],
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
});
