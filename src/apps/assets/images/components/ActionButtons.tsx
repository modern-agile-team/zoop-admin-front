import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, message, Modal, Upload } from 'antd';
import { overlay } from 'overlay-kit';

import { imageQueries } from '@/shared/service/query/image';

interface Props {
  selectedImageIds: string[];
  onRemoveImages: () => void;
}

export default function ActionButtons({
  selectedImageIds,
  onRemoveImages,
}: Props) {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: uploadImage, isPending } = useMutation({
    ...imageQueries.uploadImage,
    onSuccess: () => {
      messageApi.success('이미지를 업로드했어요.');
      queryClient.invalidateQueries({
        queryKey: imageQueries.getList({ category: undefined }).queryKey,
      });
    },
    onError: () => {
      messageApi.error('업로드 중 오류가 발생했어요.');
    },
    retry: false,
  });

  const { mutateAsync: removeImage } = useMutation({
    ...imageQueries.removeImage,
    retry: false,
  });

  const handleRemoveImages = async () => {
    const shouldRemove = await overlay.openAsync<boolean>(
      ({ isOpen, close }) => (
        <Modal
          title="이미지 삭제"
          open={isOpen}
          onCancel={() => close(false)}
          onOk={() => close(true)}
          okButtonProps={{ danger: true }}
        >
          <Alert
            message="선택한 이미지를 삭제하시겠습니까?"
            description="삭제된 이미지는 복구할 수 없습니다."
            type="error"
          />
        </Modal>
      )
    );

    if (shouldRemove) {
      try {
        await Promise.all(
          selectedImageIds.map((id) => removeImage(id.toString()))
        );
        messageApi.success('이미지를 삭제했어요.');
      } catch {
        messageApi.error('삭제 중 오류가 발생했어요.');
      }
      onRemoveImages();
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex gap-4 self-end">
        {selectedImageIds.length > 0 && (
          <Button danger onClick={handleRemoveImages}>
            선택된 이미지 삭제
          </Button>
        )}
        <Upload
          disabled={isPending}
          multiple
          accept="image/*"
          customRequest={(args) => {
            const { file } = args;
            uploadImage({ file: file as File, category: '테스트' });
          }}
        >
          <Button>이미지 업로드</Button>
        </Upload>
      </div>
    </>
  );
}
