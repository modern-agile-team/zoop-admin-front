import { queryOptions } from '@tanstack/react-query';

import { listNicknameSourcesControllerListNicknameSources } from '@/lib/admins/_generated/quizzesGameIoBackend';

export const nicknameQueries = {
  getList: (
    params: Parameters<
      typeof listNicknameSourcesControllerListNicknameSources
    >[0]
  ) =>
    queryOptions({
      queryKey: ['nicknames', 'list', params],
      queryFn: () => listNicknameSourcesControllerListNicknameSources(params),
    }),
};
