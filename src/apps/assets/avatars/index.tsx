import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Image, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { omit } from 'es-toolkit/object';
import { useState } from 'react';

import { avatarQueries } from '@/shared/service/query/avatar';

import ActionButton from './components/ActionButton';

const columns: ColumnsType = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '아바타',
    dataIndex: 'avatarImageUrl',
    key: 'avatarImageUrl',
    render: (url) => <Image src={url} alt="아바타" style={{ height: 40 }} />,
  },
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
  },
  { title: '설명', dataIndex: 'description', key: 'description' },
  {
    title: '원래 파일명',
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

const PAGE_SIZE = 30;

export default function Avatars() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const {
    page: currentPage,
    sortBy,
    orderBy,
  } = useSearch({
    from: '/(menus)/assets/avatars/',
  });
  const navigate = useNavigate({ from: '/assets/avatars' });
  const { data, isLoading, refetch } = useQuery({
    ...avatarQueries.getList({ page: currentPage, perPage: PAGE_SIZE }),
    select: (res) => ({
      dataSource: res.data.map((item) => ({ ...item, key: item.id })),
      meta: omit(res, ['data']),
    }),
  });

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={2}>아바타 관리</Typography.Title>
      <ActionButton
        selectedAvatarIds={selectedRowKeys.map((key) => key.toString())}
        onRemoveAvatars={() => {
          refetch();
          setSelectedRowKeys([]);
        }}
      />
      <Table
        onRow={(record) => {
          return {
            onClick: () =>
              navigate({
                to: '/assets/avatars/$id',
                params: { id: record.id },
              }),
          };
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        loading={isLoading}
        columns={columns}
        dataSource={data?.dataSource}
        scroll={{ y: '70vh' }}
        pagination={{
          pageSize: PAGE_SIZE,
          current: currentPage,
          total: data?.meta.totalCount,
          showQuickJumper: true,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `총 ${total.toLocaleString()}개 중 ${range[0]}-${range[1]}`,
          onChange(page) {
            navigate({ search: { page, sortBy, orderBy } });
          },
        }}
      />
    </div>
  );
}
