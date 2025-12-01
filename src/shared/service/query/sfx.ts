import { mutationOptions, queryOptions } from '@tanstack/react-query';

import {
  createSoundEffectControllerCreateSoundEffectAdmin,
  listSoundEffectsControllerListSoundEffectsAdmin,
} from '@/lib/admins/_generated/quizzesGameIoBackend';
import type { ListSoundEffectsControllerListSoundEffectsAdminParams } from '@/lib/admins/_generated/quizzesGameIoBackend.schemas';

export const sfxQueries = {
  getList: (params: ListSoundEffectsControllerListSoundEffectsAdminParams) =>
    queryOptions({
      queryKey: ['admin', 'sfx', 'list', params] as const,
      queryFn: () => listSoundEffectsControllerListSoundEffectsAdmin(params),
    }),
  upload: mutationOptions({
    mutationFn: createSoundEffectControllerCreateSoundEffectAdmin,
  }),
};
