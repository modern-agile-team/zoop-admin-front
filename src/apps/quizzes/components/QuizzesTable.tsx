import { Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';

import type { Quiz } from '../mock/quizzes';
import { QUIZZES_MOCK_DATA } from '../mock/quizzes';
export default function QuizzesTable() {
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
          <Table<Quiz> dataSource={QUIZZES_MOCK_DATA}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="질문" dataIndex="question" key="question" />
            <Column title="정답" dataIndex="answer" key="answer" />
            <Column
              title="이미지"
              dataIndex="imageUrl"
              key="imageUrl"
              render={(image) => {
                if (image === null) return null;
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
        <button className="bg-primary-600 px-2 py-1 mt-3 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
          +
        </button>
      </main>
    </>
  );
}
