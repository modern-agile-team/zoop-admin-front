import { http, HttpResponse } from 'msw';

const BASE_URL = import.meta.env.VITE_API_URL;

export const handlers = [
  http.get('/user', () => {
    return HttpResponse.json({ name: 'John Maverick' });
  }),

  http.put(`${BASE_URL}/admin/quizzes`, async () => {
    return HttpResponse.json(
      { error: 'Server Error' },
      {
        status: 500,
      }
    );
  }),

  http.get(`${BASE_URL}/admin/quizzes/:id`, async () => {
    return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
  }),

  http.get(`${BASE_URL}/admin/sound-effects`, async () => {
    return HttpResponse.json({
      data: [
        {
          id: 'sfx_01',
          name: '효과음 1',
          originalFileName: 'effect1.mp3',
          soundEffectUrl:
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          createdAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'sfx_02',
          name: '효과음 2',
          originalFileName: 'effect2.mp3',
          soundEffectUrl:
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          createdAt: '2023-02-01T00:00:00Z',
        },
      ],
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
    });
  }),
];
