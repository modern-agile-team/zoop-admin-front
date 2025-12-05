import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, App, Button } from 'antd';
import { overlay } from 'overlay-kit';

import { sfxQueries } from '@/shared/service/query/sfx';

import SfxUploadModal from './SfxUploadModal';
import type { UploadData } from './type';

interface Props {
  selectedSfxIds: string[];
  onRemoveSfxs: () => void;
}

export default function ActionButtons({ selectedSfxIds, onRemoveSfxs }: Props) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();

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

  const { mutateAsync: removeSfx } = useMutation({
    ...sfxQueries.remove,
    retry: false,
  });

  const handleRemoveSfxs = async () => {
    const shouldRemove = await modal.confirm({
      title: '효과음 삭제',
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      icon: null,
      content: (
        <Alert
          message="선택한 효과음을 삭제하시겠습니까?"
          description="삭제된 효과음은 복구할 수 없습니다."
          type="error"
        />
      ),
    });

    if (shouldRemove) {
      try {
        await Promise.all(selectedSfxIds.map((id) => removeSfx(id.toString())));
        message.success('음향 효과를 삭제했어요.');
      } catch {
        message.error('삭제 중 오류가 발생했어요.');
      }
      onRemoveSfxs();
    }
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
