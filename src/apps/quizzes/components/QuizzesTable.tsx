import { useSuspenseQuery } from '@tanstack/react-query';
import type { TableProps } from 'antd';
import { Form, Table } from 'antd';
import { useEffect, useState } from 'react';

import type { QuizDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';
import { quizQueries } from '@/shared/service/query/quiz';

import EditableCell from './EditTableCell';
import ImageDrawer from './ImageDrawer';

export interface DrawerStateType {
  open: boolean;
  quizId: string | null;
}

export default function QuizzesTable() {
  const [quizzes, setQuizzes] = useState<QuizDto[] | undefined>([]);
  const [editingCell, setEditingCell] = useState<{
    key: string;
    dataIndex: keyof QuizDto;
  } | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [drawerState, setDrawerState] = useState<DrawerStateType>({
    open: false,
    quizId: null,
  });

  const { data } = useSuspenseQuery(quizQueries.getList);

  useEffect(() => {
    setQuizzes(data?.data);
  }, [data]);

  const save = (key: string, dataIndex: keyof QuizDto, value: unknown) => {
    setQuizzes((prev) =>
      prev?.map((item) =>
        item.id === key
          ? { ...item, [dataIndex]: value, updatedAt: new Date().toISOString() }
          : item
      )
    );
    setEditingCell(null);
  };

  const addQuizTableHandler = () => {
    const newId = `new_${Date.now()}`;
    const newData: QuizDto = {
      id: newId,
      question: '',
      answer: '',
      imageUrl: null,
      type: 'multipleChoice',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setQuizzes((prev) => {
      const newQuizzes = prev ? [...prev, newData] : [newData];
      const newTotal = newQuizzes.length;
      const newCurrent = Math.ceil(newTotal / pagination.pageSize);
      setPagination((p) => ({ ...p, current: newCurrent }));
      return newQuizzes;
    });
  };

  const columns: TableProps<QuizDto>['columns'] = [
    {
      title: '타입',
      dataIndex: 'type',
      onCell: (record: QuizDto) => ({
        record,
        inputType: 'select',
        dataIndex: 'type',
        editing: true,
        onSave: save,
        onDoubleClick: () =>
          setEditingCell({ key: record.id, dataIndex: 'type' }),
      }),
      render: (type: QuizDto['type']) => type,
    },
    {
      title: '질문',
      dataIndex: 'question',
      onCell: (record: QuizDto) => ({
        record,
        inputType: 'text',
        dataIndex: 'question',
        editing:
          editingCell?.key === record.id &&
          editingCell?.dataIndex === 'question',
        onSave: save,
        onDoubleClick: () =>
          setEditingCell({ key: record.id, dataIndex: 'question' }),
      }),
    },
    {
      title: '정답',
      dataIndex: 'answer',
      onCell: (record: QuizDto) => ({
        record,
        inputType: 'text',
        dataIndex: 'answer',
        editing:
          editingCell?.key === record.id && editingCell?.dataIndex === 'answer',
        onSave: save,
        onDoubleClick: () =>
          setEditingCell({ key: record.id, dataIndex: 'answer' }),
      }),
    },
    {
      title: '이미지',
      dataIndex: 'imageUrl',
      render: (image: string | null, record: QuizDto) => (
        <div
          className="cursor-pointer"
          onClick={() => setDrawerState({ open: true, quizId: record.id })}
        >
          {image ? (
            <img
              src={image}
              alt="퀴즈 이미지"
              width={80}
              height={80}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
            />
          ) : (
            <button className="text-primary-600 hover:underline">
              이미지 선택
            </button>
          )}
        </div>
      ),
    },
    {
      title: '시점',
      children: [
        { title: 'createdAt', dataIndex: 'createdAt', key: 'createdAt' },
        { title: 'updatedAt', dataIndex: 'updatedAt', key: 'updatedAt' },
      ],
    },
  ];

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
        <Form component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={quizzes}
            columns={columns}
            rowKey="id"
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize: pageSize || 10 });
              },
            }}
          />
        </Form>
        <button
          onClick={addQuizTableHandler}
          className="bg-primary-600 px-2 py-1 mt-3 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
        >
          +
        </button>
      </main>

      <ImageDrawer
        drawerState={drawerState}
        setDrawerState={setDrawerState}
        save={save}
      />
    </>
  );
}
