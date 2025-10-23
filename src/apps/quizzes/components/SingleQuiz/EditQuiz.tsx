import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { Button, Card, Form, Image, Select, Skeleton } from 'antd';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';

import { quizQueries } from '@/shared/service/query/quiz';

export default function EditQuiz() {
  const router = useRouter();
  const [form] = Form.useForm();

  const { id: quizId } = useParams({ from: '/(menus)/quizzes/$id/edit/' });
  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery({
    ...quizQueries.getSingle(quizId!),
    enabled: !!quizId,
  });

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

  const onFinish = () => {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="answer"
                label="정답"
                rules={[{ required: true, message: '정답을 입력해주세요.' }]}
              >
                <TextArea rows={2} />
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>
    </div>
  );
}
