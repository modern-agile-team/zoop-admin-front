import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { App, Button, Select } from 'antd';
import { overlay } from 'overlay-kit';

import { avatarQueries } from '@/shared/service/query/avatar';

import AvatarUploadModal from './AvatarUploadModal';
import type { AvatarUploadData } from './schema';

interface Props {
  selectedAvatarIds: string[];
  onRemoveAvatars: () => void;
}

export default function ActionButton({ selectedAvatarIds }: Props) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { page, sortBy, orderBy } = useSearch({
    from: '/(menus)/assets/avatars/',
  });
  const navigate = useNavigate({ from: '/assets/avatars' });

  const { mutate: uploadAvatar, isPending: isUploading } = useMutation({
    ...avatarQueries.uploadAvatar,
    onSuccess: () => {
      message.success('아바타를 업로드했어요.');
      queryClient.invalidateQueries({
        queryKey: avatarQueries.getList({ page }).queryKey,
      });
    },
    onError: () => {
      message.error('업로드 중 오류가 발생했어요.');
    },
    retry: false,
  });

  const handleRemoveAvatars = async () => {
    message.info('구현중입니다.');
  };

  const handleSelectSortField = (value: string) => {
    navigate({ search: { page, sortBy: value, orderBy } });
  };

  const handleToggleSortType = (type: 'asc' | 'desc') => {
    navigate({ search: { page, sortBy, orderBy: type } });
  };

  return (
    <div className="flex justify-between gap-4">
      <div className="flex gap-1">
        <Select
          value={sortBy ?? undefined}
          style={{ width: 120 }}
          options={[
            { value: 'createdAt', label: '생성 날짜' },
            { value: 'updatedAt', label: '수정 날짜' },
            { value: 'name', label: '이름' },
            { value: 'category', label: '카테고리' },
          ]}
          onChange={handleSelectSortField}
        />
        <Button
          onClick={() =>
            handleToggleSortType(orderBy === 'desc' ? 'asc' : 'desc')
          }
        >
          {orderBy === 'desc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </Button>
      </div>
      <div>
        {selectedAvatarIds.length > 0 && (
          <Button danger onClick={handleRemoveAvatars}>
            선택된 아바타 삭제
          </Button>
        )}
        <Button
          loading={isUploading}
          disabled={isUploading}
          onClick={async () => {
            const uploadData = await overlay.openAsync<
              AvatarUploadData[] | null
            >(({ close, isOpen }) => (
              <AvatarUploadModal isOpen={isOpen} onClose={close} />
            ));

            if (uploadData) {
              uploadData.forEach((avatar) => {
                uploadAvatar({
                  file: avatar.file,
                  name: avatar.name,
                  description: avatar.description,
                });
              });
            }
          }}
        >
          아바타 업로드
        </Button>
      </div>
    </div>
  );
}
