import { Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import { useState } from 'react';

import type { Quiz } from '../mock/quizzes';
import { QUIZZES_MOCK_DATA } from '../mock/quizzes';
export default function QuizzesTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(QUIZZES_MOCK_DATA);

  const addQuizTableHandler = () => {
    const newData: Quiz = {
      id: '',
      question: '',
      answer: '',
      imageUrl: '',
      type: 'multipleChoice',
      createdAt: '',
      updatedAt: '',
    };
    setQuizzes((prev) => {
      return [...prev, newData];
    });
  };

  return (
    <>
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
          <Table<Quiz> dataSource={quizzes}>
            <Column
              title="타입"
              dataIndex="type"
              key="type"
              render={(type) => (
                <Space wrap>
                  <Select
                    defaultValue={type}
                    style={{ width: 120 }}
                    onChange={addQuizTableHandler}
                    options={[
                      { value: 'multipleChoice', label: '다중선택' },
                      { value: 'shortAnswer', label: '짧은 글' },
                      { value: 'selectPicture', label: '그림맞추기' },
                      {
                        value: 'correctWords',
                        label: '단어맞추기',
                        disabled: true,
                      },
                    ]}
                  />
                </Space>
              )}
            />
            <Column title="질문" dataIndex="question" key="question" />
            <Column title="정답" dataIndex="answer" key="answer" />
            <Column
              title="이미지"
              dataIndex="imageUrl"
              key="imageUrl"
              render={(image) => {
                if (!image) return null;
                return (
                  <>
                    <img src={image} alt="image" width={50} height={50} />
                  </>
                );
              }}
            />
            <ColumnGroup title="시점">
              <Column title="createdAt" dataIndex="createdAt" key="createdAt" />
              <Column title="updatedAt" dataIndex="updatedAt" key="updatedAt" />
            </ColumnGroup>
          </Table>
        </section>
        <button
          onClick={addQuizTableHandler}
          className="bg-primary-600 px-2 py-1 mt-3 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
        >
          +
        </button>
      </main>
    </>
  );
}
