import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { App, Button } from 'antd';
import { overlay } from 'overlay-kit';

import { sfxQueries } from '@/shared/service/query/sfx';

import SfxUploadModal from './SfxUploadModal';
import type { UploadData } from './type';

interface Props {
  selectedSfxIds: string[];
  onRemoveSfxs: () => void;
}

export default function ActionButtons({ selectedSfxIds }: Props) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { page, sortBy, orderBy } = useSearch({
    from: '/(menus)/assets/sfx/',
  });
  const navigate = useNavigate({ from: '/assets/sfx' });

  const { mutate: uploadSfx, isPending: isUploading } = useMutation({
    ...sfxQueries.upload,
    onSuccess: () => {
      message.success('음향 효과를 업로드했어요.');
      queryClient.invalidateQueries({
        queryKey: sfxQueries.getList({}).queryKey,
      });
    },
    onError: () => {
      message.error('업로드 중 오류가 발생했어요.');
    },
    retry: false,
  });

  const handleRemoveSfxs = async () => {};

  const handleSelectSortField = (value: string) => {
    navigate({ search: { page, sortBy: value, orderBy } });
  };

  const handleToggleSortType = (type: 'asc' | 'desc') => {
    navigate({ search: { page, sortBy, orderBy: type } });
  };

  return (
    <div className="flex gap-4 justify-end">
      <div>
        {selectedSfxIds.length > 0 && (
          <Button danger onClick={handleRemoveSfxs}>
            선택된 음향 효과 삭제
          </Button>
        )}
        <Button
          loading={isUploading}
          disabled={isUploading}
          onClick={async () => {
            const uploadData = await overlay.openAsync<UploadData | null>(
              ({ close, isOpen }) => (
                <SfxUploadModal isOpen={isOpen} onClose={close} />
              )
            );

            if (uploadData) {
              const { fileList } = uploadData;
              fileList.forEach((file) => {
                uploadSfx({ file });
              });
            }
          }}
        >
          음향 효과 업로드
        </Button>
      </div>
    </div>
  );
}
