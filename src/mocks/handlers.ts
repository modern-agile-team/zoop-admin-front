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

  http.get(`${BASE_URL}/admin/quizzes/:id`, async ({ params }) => {
    const { id } = params;

    return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
  }),
];
