import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Image, Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';

import type { QuizDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';
import { quizQueries } from '@/shared/service/query/quiz';

import { TABLE } from '../constants';

export default function QuizzesTable() {
  const { data: quizzes } = useSuspenseQuery(quizQueries.getList);
  const navigate = useNavigate();

  return (
    <>
      <header className="p-6 border-b border-contents-200 flex justify-between items-center">
        <div>
          <h1 className="text-title-2 font-bold">퀴즈 목록</h1>
          <p className="text-contents-600 mt-1">
            셀을 클릭하면 상세 정보 확인이 가능합니다.
          </p>
        </div>
      </header>

      <main className="p-6">
        <section>
          <Table<QuizDto>
            dataSource={quizzes.data}
            pagination={{
              pageSize: TABLE.PAGE_SIZE,
            }}
            bordered
            scroll={{
              y: 120 * 3,
            }}
            onRow={(record) => {
              return {
                onClick: () =>
                  navigate({
                    to: '/contents/quizzes/$id',
                    params: { id: record.id },
                  }),
              };
            }}
          >
            <Column title="카테고리" dataIndex="type" key="type" />
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
                    <Image src={image} alt="image" width={50} height={50} />
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
      </main>
    </>
  );
}
