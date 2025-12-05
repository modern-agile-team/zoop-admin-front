import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { omit } from 'es-toolkit/object';
import { useState } from 'react';

import type { SoundEffectAdminDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';
import { sfxQueries } from '@/shared/service/query/sfx';

import ActionButtons from './components/ActionButtons';

const columns: ColumnsType<SoundEffectAdminDto> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '재생',
    dataIndex: 'soundEffectUrl',
    key: 'soundEffectUrl',
    width: 400,
    render: (url) => <audio controls src={url} className="w-full" />,
    sorter: (a, b) => a.soundEffectUrl.localeCompare(b.soundEffectUrl),
  },
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: '원본 파일명',
    dataIndex: 'originalFileName',
    key: 'originalFileName',
    sorter: (a, b) => a.originalFileName.localeCompare(b.originalFileName),
  },
  {
    title: '생성일',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => dayjs(date).format('YYYY년 MM월 DD일'),
    sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
  },
];

const PAGE_SIZE = 30;

export default function SfxAssetPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const {
    page: currentPage,
    sortBy,
    orderBy,
  } = useSearch({
    from: '/(menus)/assets/sfx/',
  });
  const navigate = useNavigate({ from: '/assets/sfx' });

  const { data, isLoading, refetch } = useQuery({
    ...sfxQueries.getList({
      page: currentPage,
      perPage: PAGE_SIZE,
    }),
    select: (res) => {
      return {
        dataSource: res.data.map((item) => ({ ...item, key: item.id })),
        meta: omit(res, ['data']),
      };
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Typography.Title level={2}>효과음 관리</Typography.Title>
      <ActionButtons
        selectedSfxIds={selectedRowKeys.map((key) => key.toString())}
        onRemoveSfxs={() => {
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
