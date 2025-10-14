type Quiz = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: 'multipleChoice' | 'shortAnswer';
  question: string;
  answer: string;
  imageUrl: string | null;
};

const QUIZZES_MOCK_DATA: Quiz[] = [
  {
    id: 'quiz-001',
    createdAt: '2025-10-12T07:06:18.021Z',
    updatedAt: '2025-10-12T07:06:18.021Z',
    type: 'multipleChoice',
    question: '대한민국의 수도는 어디인가요?',
    answer: '서울',
    imageUrl: null,
  },
  {
    id: 'quiz-002',
    createdAt: '2025-10-11T11:20:45.110Z',
    updatedAt: '2025-10-11T11:20:45.110Z',
    type: 'shortAnswer',
    question: '세상에서 가장 높은 산의 이름은 무엇인가요?',
    answer: '에베레스트 산',
    imageUrl: null,
  },
  {
    id: 'quiz-003',
    createdAt: '2025-10-10T02:55:00.987Z',
    updatedAt: '2025-10-10T02:55:00.987Z',
    type: 'multipleChoice',
    question: 'React를 개발한 회사는 어디인가요?',
    answer: 'Facebook (Meta)',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  },
];

export default function QuizListPage() {
  return (
    <div className="bg-contents-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-bg-100 rounded-lg shadow-lg overflow-hidden">
        <header className="p-6 border-b border-contents-200 flex justify-between items-center">
          <div>
            <h1 className="text-title-2 font-bold">퀴즈 목록 (인라인 편집)</h1>
            <p className="text-contents-600 mt-1">
              셀을 더블클릭하여 내용을 수정하세요.
            </p>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
            변경 사항 저장
          </button>
        </header>

        <main className="p-6">
          <section>
            <div className="border border-bg-500 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_1fr_auto] font-semibold bg-bg-300 text-left">
                <div className="p-3 border-b border-bg-500">ID</div>
                <div className="p-3 border-b border-bg-500">질문</div>
                <div className="p-3 border-b border-bg-500">정답</div>
                <div className="p-3 border-b border-bg-500">이미지</div>
              </div>

              <div>
                {QUIZZES_MOCK_DATA.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className={`grid grid-cols-[auto_1fr_1fr_auto] items-center ${
                      index < QUIZZES_MOCK_DATA.length - 1
                        ? 'border-b border-bg-400'
                        : ''
                    }`}
                  >
                    <div className="p-3 text-sm text-contents-700 font-mono">
                      {quiz.id}
                    </div>
                    <div className="p-0">{quiz.question}</div>
                    <div className="p-0 font-semibold">{quiz.answer}</div>
                    <div className="p-3">
                      {quiz.imageUrl ? (
                        <img
                          src={quiz.imageUrl}
                          alt={quiz.question}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-contents-500 text-sm">없음</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <button className="bg-primary-600 px-2 py-1 mt-3 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
            +
          </button>
        </main>
      </div>
    </div>
  );
}
