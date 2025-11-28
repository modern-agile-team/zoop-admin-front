import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Alert, App, Button, Select } from 'antd';
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
  const { modal, message } = App.useApp();

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

  const { mutateAsync: removeAvatar } = useMutation({
    ...avatarQueries.deleteAvatar,
    retry: false,
  });

  const handleRemoveAvatars = async () => {
    const shouldRemove = await modal.confirm({
      title: '아바타 삭제',
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      icon: null,
      content: (
        <Alert
          message="선택한 아바타를 삭제하시겠습니까?"
          description="삭제된 아바타는 복구할 수 없습니다."
          type="error"
        />
      ),
    });

    if (shouldRemove) {
      try {
        await Promise.all(
          selectedAvatarIds.map((id) =>
            removeAvatar({ avatarId: id.toString() })
          )
        );
        queryClient.invalidateQueries({
          queryKey: avatarQueries.getList({ page }).queryKey,
        });
        message.success('아바타를 삭제했어요.');
      } catch {
        message.error('아바타 삭제 중 오류가 발생했어요.');
      }
    }
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
