import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useBlocker,
  useNavigate,
  useParams,
  useRouter,
} from '@tanstack/react-router';
import { Button, Card, Form, Image, Popconfirm, Select, Skeleton } from 'antd';
import useApp from 'antd/es/app/useApp';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';

import type { UpdateQuizDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';
import { queryClient } from '@/lib/queryClient';
import { quizQueries } from '@/shared/service/query/quiz';

export default function EditQuiz() {
  const router = useRouter();
  const navigate = useNavigate();
  const [form] = Form.useForm<UpdateQuizDto>();
  const { message } = useApp();
  const [formIsDirty, setFormIsDirty] = useState(false);

  useBlocker({
    shouldBlockFn: () => {
      if (!formIsDirty) return false;

      const shouldLeave = confirm(
        '변경사항이 저장되지 않았습니다. 정말로 나가시겠습니까?'
      );
      return !shouldLeave;
    },
  });

  const { id: quizId } = useParams({ from: '/(menus)/quizzes/$id/edit/' });
  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery({
    ...quizQueries.getSingle(quizId!),
    enabled: !!quizId,
  });

  const { mutate: updateQuiz } = useMutation({
    ...quizQueries.singleUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      queryClient.invalidateQueries({
        queryKey: quizQueries.singleUpdate.mutationKey,
      });
      router.history.back();
      message.success('퀴즈가 성공적으로 수정되었습니다.');
    },
    onError: () => {
      message.error('퀴즈 수정에 실패했습니다.');
    },
  });

  const { mutate: deleteQuiz } = useMutation({
    ...quizQueries.singleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      queryClient.invalidateQueries({
        queryKey: quizQueries.singleDelete.mutationKey,
      });
      navigate({ to: '/quizzes' });
      message.success('퀴즈가 성공적으로 삭제되었습니다.');
    },
    onError: () => {
      message.error('퀴즈 삭제에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (quiz) {
      form.setFieldsValue(quiz);
    }
  }, [quiz, form]);

  const onFinish = (values: UpdateQuizDto) => {
    setFormIsDirty(false);
    updateQuiz({ quizId, updateQuizDto: values });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="p-6">
        <Card>
          <Title level={4}>퀴즈 정보를 불러오는 데 실패했습니다.</Title>
          <Paragraph>잠시 후 다시 시도해 주세요.</Paragraph>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={() => setFormIsDirty(true)}
      >
        <Card
          title={<Title level={3}>퀴즈 수정</Title>}
          bordered={false}
          className="shadow-md"
          extra={
            <div className="flex gap-2">
              <Button onClick={() => router.history.back()}>취소</Button>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={() => deleteQuiz({ quizId })}
                onCancel={() => message.info('삭제를 취소했습니다.')}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>
                  삭제
                </Button>
              </Popconfirm>
            </div>
          }
        >
          <div className="flex flex-col md:flex-row gap-8">
            {quiz.imageUrl && (
              <div className="flex-shrink-0 text-center">
                <Image
                  width={250}
                  src={quiz.imageUrl}
                  alt="퀴즈 이미지"
                  className="rounded-lg shadow-sm"
                />
                {/* TODO: 이미지 변경 기능 추가 */}
              </div>
            )}
            <div className="flex-grow">
              <Form.Item label="ID">
                <Input value={quiz.id} disabled />
              </Form.Item>
              <Form.Item
                name="type"
                label="카테고리"
                rules={[
                  { required: true, message: '카테고리를 선택해주세요.' },
                ]}
              >
                <Select
                  defaultValue={quiz.type}
                  options={[
                    { value: 'multipleChoice', label: '다중선택' },
                    { value: 'shortAnswer', label: '짧은 글' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="question"
                label="질문"
                rules={[{ required: true, message: '질문을 입력해주세요.' }]}
              >
                <TextArea rows={4} defaultValue={quiz.question!} />
              </Form.Item>
              <Form.Item
                name="answer"
                label="정답"
                rules={[{ required: true, message: '정답을 입력해주세요.' }]}
              >
                <TextArea rows={2} defaultValue={quiz.answer} />
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>
    </div>
  );
}
