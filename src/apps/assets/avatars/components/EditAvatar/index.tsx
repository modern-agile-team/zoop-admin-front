import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Form,
  Image,
  Input,
  Spin,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { avatarQueries } from '@/shared/service/query/avatar';

const avatarEditSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof avatarEditSchema>;

export default function EditAvatar() {
  const { id: avatarId } = useParams({
    from: '/(menus)/assets/avatars/$id/edit/',
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: avatar,
    isLoading,
    isError,
  } = useQuery({
    ...avatarQueries.getSingle(avatarId),
    enabled: !!avatarId,
  });

  const { mutate: updateAvatar, isPending } = useMutation({
    ...avatarQueries.updateAvatar,
    onSuccess: () => {
      message.success('아바타 정보가 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [
          avatarQueries.getSingle(avatarId).queryKey,
          avatarQueries.getList({}).queryKey,
        ],
      });
      router.history.back();
    },
    onError: (error) => {
      message.error(
        `아바타 정보 수정에 실패했습니다: ${error.message || '알 수 없는 오류'}`
      );
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(avatarEditSchema),
    defaultValues: {
      name: avatar?.name ?? '',
      description: avatar?.description ?? '',
    },
    values: avatar
      ? { name: avatar.name, description: avatar.description ?? '' }
      : undefined,
  });

  const onSubmit = (updateAvatarAdminDto: FormValues) => {
    updateAvatar({
      avatarId,
      updateAvatarAdminDto,
    });
  };

  if (isLoading) {
    return <Spin size="large" className="flex justify-center" />;
  }

  if (isError || !avatar) {
    return (
      <Alert
        message="오류"
        description="아바타 정보를 불러오는 데 실패했습니다."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={3}>아바타 정보 수정</Typography.Title>
      <Card>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4">
            <Image
              width={200}
              src={avatar.avatarImageUrl}
              alt={avatar.name ?? '아바타 이미지'}
              className="rounded-lg object-cover"
            />
            <Descriptions
              bordered
              column={1}
              className="flex-1"
              labelStyle={{ width: '120px' }}
            >
              <Descriptions.Item label="ID">{avatar.id}</Descriptions.Item>
              <Descriptions.Item label="원본 파일명">
                {avatar.originalFileName}
              </Descriptions.Item>
              <Descriptions.Item label="생성일">
                {dayjs(avatar.createdAt).format('YYYY년 MM월 DD일 HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="수정일">
                {dayjs(avatar.updatedAt).format('YYYY년 MM월 DD일 HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            className="flex-1"
          >
            <Form.Item
              label="이름"
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="설명"
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input.TextArea {...field} rows={4} />}
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => router.history.back()}>취소</Button>
                <Button type="primary" htmlType="submit" loading={isPending}>
                  저장
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
}
