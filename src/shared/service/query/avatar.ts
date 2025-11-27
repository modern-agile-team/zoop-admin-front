import { mutationOptions, queryOptions } from '@tanstack/react-query';

import {
  createAvatarControllerCreateAvatarAdmin,
  getAvatarControllerGetAvatar,
  listAvatarsControllerListAvatars,
  updateAvatarControllerUpdateAvatar,
} from '@/lib/admins/_generated/quizzesGameIoBackend';
import type { UpdateAvatarAdminDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';

export const avatarQueries = {
  getList: (params: Parameters<typeof listAvatarsControllerListAvatars>[0]) =>
    queryOptions({
      queryKey: ['admin', 'avatars', 'list', params] as const,
      queryFn: () => listAvatarsControllerListAvatars(params),
    }),
  getSingle: (avatarId?: string) =>
    queryOptions({
      queryKey: ['admin', 'avatar', avatarId] as const,
      queryFn: () => getAvatarControllerGetAvatar(avatarId!),
      enabled: !!avatarId,
    }),
  uploadAvatar: mutationOptions({
    mutationFn: createAvatarControllerCreateAvatarAdmin,
  }),
  updateAvatar: mutationOptions({
    mutationFn: ({
      avatarId,
      updateAvatarAdminDto,
    }: {
      avatarId: string;
      updateAvatarAdminDto: UpdateAvatarAdminDto;
    }) => updateAvatarControllerUpdateAvatar(avatarId, updateAvatarAdminDto),
  }),
};
