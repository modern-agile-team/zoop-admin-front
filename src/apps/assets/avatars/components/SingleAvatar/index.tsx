import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Alert, Card, Descriptions, Image, Spin, Typography } from 'antd';
import dayjs from 'dayjs';

import { avatarQueries } from '@/shared/service/query/avatar';

export default function SingleAvatar() {
  const { id: avatarId } = useParams({ from: '/(menus)/assets/avatars/$id/' });
  const {
    data: avatar,
    isLoading,
    isError,
  } = useQuery({
    ...avatarQueries.getSingle(avatarId!),
    enabled: !!avatarId,
  });

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
      <Typography.Title level={3}>아바타 상세 정보</Typography.Title>
      <Card>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex justify-center">
            <Image
              width={200}
              src={avatar.avatarImageUrl}
              alt={avatar.name ?? '아바타 이미지'}
              className="rounded-lg object-cover"
            />
          </div>
          <Descriptions
            bordered
            column={1}
            className="flex-1"
            labelStyle={{ width: '120px' }}
          >
            <Descriptions.Item label="ID">{avatar.id}</Descriptions.Item>
            <Descriptions.Item label="이름">{avatar.name}</Descriptions.Item>
            <Descriptions.Item label="설명">
              {avatar.description}
            </Descriptions.Item>
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
      </Card>
    </div>
  );
}
