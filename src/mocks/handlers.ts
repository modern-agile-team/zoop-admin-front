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

    return HttpResponse.json(
      {
        id,
        createdAt: '2023-10-22T10:00:00.000Z',
        updatedAt: '2023-10-22T11:30:00.000Z',
        type: 'multipleChoice',
        question: 'React에서 상태를 관리하는 훅의 이름은 무엇일까요?',
        answer: 'useState',
        imageUrl: 'https://via.placeholder.com/150',
      },
      { status: 200 }
    );
  }),
];
