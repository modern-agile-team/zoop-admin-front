import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Image, Table, Typography, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';

import type { ImageDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';
import { imageQueries } from '@/shared/service/query/image';

const columns: ColumnsType<ImageDto> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '이미지',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    render: (url) => <Image src={url} alt="이미지" style={{ height: 120 }} />,
  },
  {
    title: '카테고리',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '이름',
    dataIndex: 'originalFileName',
    key: 'originalFileName',
  },
  {
    title: '생성일',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => dayjs(date).format('YYYY년 MM월 DD일'),
  },
];

export default function ImageAssetPage() {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data, isLoading } = useQuery({
    ...imageQueries.getList({ category: undefined }),
    select: (res) => res.data.map((item) => ({ ...item, key: item.id })),
  });

  const { mutate: uploadImage, isPending } = useMutation({
    ...imageQueries.uploadImage,
    onSuccess: () => {
      message.success('이미지를 업로드했어요.');
      queryClient.invalidateQueries({
        queryKey: imageQueries.getList({ category: undefined }).queryKey,
      });
    },
    onError: () => {
      message.error('업로드 중 오류가 발생했어요.');
    },
    retry: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={1}>이미지 관리</Typography.Title>

      <div className="flex gap-4 self-end">
        {selectedRowKeys.length > 0 && (
          <Button danger>선택된 이미지 삭제</Button>
        )}
        <Upload
          disabled={isPending}
          multiple
          customRequest={(args) => {
            const { file } = args;
            uploadImage({ file: file as File, category: '테스트' });
          }}
        >
          <Button>이미지 업로드</Button>
        </Upload>
      </div>
      <Table
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        loading={isLoading}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}
