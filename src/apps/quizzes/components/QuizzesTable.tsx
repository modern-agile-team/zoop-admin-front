import type { TableProps } from 'antd';
import { Form, Input, InputNumber, Select, Table } from 'antd';
import React, { useState } from 'react';

import type { Quiz } from '../mock/quizzes';
import { QUIZZES_MOCK_DATA } from '../mock/quizzes';

interface EditableCellProps {
  editing: boolean;
  dataIndex: keyof Quiz;
  record: Quiz;
  inputType: 'number' | 'text' | 'select';
  onSave: (key: string, dataIndex: keyof Quiz, value: unknown) => void;
  children: React.ReactNode;
  onDoubleClick: () => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  record,
  inputType,
  onSave,
  children,
  onDoubleClick,
}) => {
  let inputNode: React.ReactNode;

  if (inputType === 'select') {
    inputNode = (
      <Select
        autoFocus
        defaultValue={record[dataIndex]}
        style={{ width: '100%', minWidth: '120px' }}
        onChange={(value) => onSave(record.id, dataIndex, value)}
        options={[
          { value: 'multipleChoice', label: '다중선택' },
          { value: 'shortAnswer', label: '짧은 글' },
          { value: 'selectPicture', label: '그림맞추기' },
          { value: 'correctWords', label: '단어맞추기' },
        ]}
      />
    );
  } else if (inputType === 'number') {
    inputNode = (
      <InputNumber
        autoFocus
        onPressEnter={(e) =>
          onSave(record.id, dataIndex, (e.target as HTMLInputElement).value)
        }
        onBlur={(e) => onSave(record.id, dataIndex, e.target.value)}
      />
    );
  } else {
    inputNode = (
      <Input
        autoFocus
        onPressEnter={(e) =>
          onSave(record.id, dataIndex, (e.target as HTMLInputElement).value)
        }
        onBlur={(e) => onSave(record.id, dataIndex, e.target.value)}
      />
    );
  }

  return (
    <td onDoubleClick={onDoubleClick}>{editing ? inputNode : children}</td>
  );
};

export default function QuizzesTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(QUIZZES_MOCK_DATA);
  const [editingCell, setEditingCell] = useState<{
    key: string;
    dataIndex: keyof Quiz;
  } | null>(null);

  const save = (key: string, dataIndex: keyof Quiz, value: unknown) => {
    setQuizzes((prev) =>
      prev.map((item) =>
        item.id === key
          ? { ...item, [dataIndex]: value, updatedAt: new Date().toISOString() }
          : item
      )
    );
    setEditingCell(null);
  };

  const addQuizTableHandler = () => {
    const newId = `new_${Date.now()}`;
    const newData: Quiz = {
      id: newId,
      question: '',
      answer: '',
      imageUrl: '',
      type: 'multipleChoice',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [...prev, newData]);
  };

  const columns: TableProps<Quiz>['columns'] = [
    {
      title: '타입',
      dataIndex: 'type',
      onCell: (record: Quiz) => ({
        record,
        inputType: 'select',
        dataIndex: 'type',
        editing: true,
        onSave: save,
        onDoubleClick: () =>
          setEditingCell({ key: record.id, dataIndex: 'type' }),
      }),
      render: (type: Quiz['type']) => type,
    },
    {
      title: '질문',
      dataIndex: 'question',
      onCell: (record: Quiz) => ({
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
      onCell: (record: Quiz) => ({
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
      onCell: (record: Quiz) => ({
        record,
        inputType: 'text',
        dataIndex: 'imageUrl',
        editing:
          editingCell?.key === record.id &&
          editingCell?.dataIndex === 'imageUrl',
        onSave: save,
        onDoubleClick: () =>
          setEditingCell({ key: record.id, dataIndex: 'imageUrl' }),
      }),
      render: (image: string) => {
        if (!image) return null;
        return (
          <img
            src={image}
            alt="image"
            width={50}
            height={50}
            style={{ objectFit: 'cover' }}
          />
        );
      },
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
            pagination={false}
          />
        </Form>
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
