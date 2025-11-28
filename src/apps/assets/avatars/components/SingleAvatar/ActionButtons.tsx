import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Button } from 'antd';
import useApp from 'antd/es/app/useApp';

import { avatarQueries } from '@/shared/service/query/avatar';

interface ActionButtonsProps {
  avatarId: string;
}

export default function ActionButtons({ avatarId }: ActionButtonsProps) {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { modal, notification } = useApp();

  const navigateToEdit = () => {
    navigate({ to: `/assets/avatars/${avatarId}/edit/` });
  };

  const { mutate: deleteAvatar } = useMutation({
    ...avatarQueries.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: avatarQueries.getList({}).queryKey,
      });
      router.history.back();
    },
    onError: () => {
      notification.error({
        message: '삭제 실패',
        description: '아바타 삭제 중 오류가 발생했습니다.',
      });
    },
  });

  const handleDelete = () => {
    modal.confirm({
      title: '아바타 삭제',
      content:
        '정말로 이 아바타를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okButtonProps: { danger: true },
      cancelText: '취소',
      onOk: () => {
        deleteAvatar({ avatarId });
      },
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <Button type="default" onClick={navigateToEdit}>
        <EditOutlined />
      </Button>
      <Button type="primary" danger onClick={handleDelete}>
        <DeleteOutlined />
      </Button>
    </div>
  );
}
