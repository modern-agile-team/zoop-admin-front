import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { TableProps } from 'antd';
import { Button, Drawer, Form, notification, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';

import useOutWindow from '@/shared/hooks/useOutWindow';
import { quizQueries } from '@/shared/service/query/quiz';

import EditableCell from './EditTableCell';
import ImageDrawer from './ImageDrawer';
import type { CreateQuizDto } from './schema';

export default function CreateQuizzes() {
  const [notificationApi, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [form] = Form.useForm<{ dataSource: CreateQuizDto[] }>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const { blocker, setFormIsDirty } = useOutWindow();

  const quizFormValues = Form.useWatch([], form)?.dataSource || [];
  const handleDelete = (key: React.Key) => {
    const newData = quizFormValues.filter((quiz) => quiz.key !== key);
    form.setFieldsValue({ dataSource: [...newData] });
    setFormIsDirty(true);
  };

  const handleAdd = () => {
    const newData: CreateQuizDto = {
      key: (quizFormValues.length + 1).toString(),
      type: '',
      question: '',
      answer: '',
      imageUrl: '',
    };
    form.setFieldsValue({ dataSource: [...quizFormValues, newData] });
    setFormIsDirty(true);
  };

  const handleSave = (
    key: string,
    dataIndex: keyof CreateQuizDto,
    value: unknown
  ) => {
    const newData = [...quizFormValues];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        [dataIndex]: value,
      });
      form.setFieldsValue({ dataSource: newData });
      setFormIsDirty(true);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (selectedRowKey) {
      handleSave(selectedRowKey, 'imageUrl', imageUrl);
    }
    setDrawerVisible(false);
  };

  const { mutateAsync: quizMutation } = useMutation(quizQueries.bulkUpload);

  const handleBulkUpload = () => {
    const dataToSave = quizFormValues.map(({ key, ...rest }) => rest);
    quizMutation(dataToSave, {
      onSuccess: () => {
        setFormIsDirty(false);
        navigate({ to: '/quizzes' });
      },
      onError: () => {
        notificationApi.info({
          message: '❌ 퀴즈 업로드에 실패했습니다.',
          description:
            '잠시 뒤 다시 요청을 보내거나, 새로고침 후 다시 시도해 보세요.',
          placement: 'topLeft',
        });
      },
    });
  };

  const columns: TableProps<CreateQuizDto>['columns'] = [
    {
      title: '번호',
      dataIndex: 'key',
      render: (_text, _record, index) => `${index + 1}`,
    },
    {
      title: '카테고리',
      dataIndex: 'type',
      width: '15%',
      onCell: (record: CreateQuizDto) => ({
        record,
        inputType: 'select',
        dataIndex: 'type',
        onSave: handleSave,
        isEdit: true,
        children: record.type,
      }),
    },
    {
      title: '질문',
      dataIndex: 'question',
      width: '45%',

      onCell: (record: CreateQuizDto) => ({
        record,
        inputType: 'text',
        dataIndex: 'question',
        onSave: handleSave,
        isEdit: true,
        children: record.question,
      }),
    },
    {
      title: '정답',
      dataIndex: 'answer',
      width: '15%',
      onCell: (record: CreateQuizDto) => ({
        record,
        inputType: 'text',
        dataIndex: 'answer',
        onSave: handleSave,
        isEdit: true,
        children: record.answer,
      }),
    },
    {
      title: '이미지',
      dataIndex: 'imageUrl',
      width: '10%',
      render: (imageUrl: string, record: CreateQuizDto) => (
        <>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="quiz"
              onClick={() => {
                setDrawerVisible(true);
                setSelectedRowKey(record.key);
              }}
            />
          ) : (
            <Button
              onClick={() => {
                setDrawerVisible(true);
                setSelectedRowKey(record.key);
              }}
            >
              이미지 선택
            </Button>
          )}
        </>
      ),
    },
    {
      title: '삭제',
      dataIndex: 'operation',
      render: (_, record: { key: React.Key }) =>
        quizFormValues.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>삭제</a>
          </Popconfirm>
        ) : null,
    },
  ];

  useEffect(() => {
    if (blocker.status === 'blocked') {
      if (
        window.confirm('변경사항이 저장되지 않았습니다. 정말로 나가시겠습니까?')
      ) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  return (
    <>
      {contextHolder}
      <header className="p-6 border-b border-contents-200 flex justify-between items-center">
        <div>
          <h1 className="text-title-2 font-bold">퀴즈 추가</h1>
          <p className="text-contents-600 mt-1">
            셀에 새로운 정보를 입력해 주세요.
          </p>
        </div>
        <button
          onClick={handleBulkUpload}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
        >
          변경 사항 저장
        </button>
      </header>
      <main className="p-6">
        <Form form={form} component={false} initialValues={{ dataSource: [] }}>
          <Form.Item name="dataSource" rules={[{ required: true }]}>
            <Table
              components={{
                body: { cell: EditableCell },
              }}
              bordered
              dataSource={quizFormValues}
              columns={columns}
              rowClassName="editable-row"
              pagination={false}
            />
          </Form.Item>
        </Form>
        <Button
          onClick={handleAdd}
          type="primary"
          className="bg-primary-600 mt-5"
        >
          행 추가
        </Button>
        <Drawer
          title="이미지 선택"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={500}
        >
          <ImageDrawer onSelect={handleImageSelect} />
        </Drawer>
      </main>
    </>
  );
}
