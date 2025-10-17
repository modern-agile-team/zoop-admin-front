import { useQuery } from '@tanstack/react-query';
import { Image, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';

import type { ImageDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';
import { imageQueries } from '@/shared/service/query/image';

import ActionButtons from './components/ActionButtons';

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data, isLoading, refetch } = useQuery({
    ...imageQueries.getList({ category: undefined }),
    select: (res) => res.data.map((item) => ({ ...item, key: item.id })),
  });

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={1}>이미지 관리</Typography.Title>

      <ActionButtons
        selectedImageIds={selectedRowKeys.map((key) => key.toString())}
        onRemoveImages={() => {
          refetch();
          setSelectedRowKeys([]);
        }}
      />
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
