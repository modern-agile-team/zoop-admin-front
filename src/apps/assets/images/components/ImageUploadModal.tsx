import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Modal, Upload } from 'antd';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: (fileList: File[] | null) => void;
}

export default function ImageUploadModal({
  isOpen,

  onClose,
}: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Modal
      title="이미지 업로드"
      open={isOpen}
      okText="업로드"
      cancelText="취소"
      onOk={() => {
        if (fileList.length === 0) {
          onClose(null);
          return;
        }

        const ok = confirm('이미지를 업로드 하시겠습니까?');
        if (ok) {
          onClose(fileList.map((file) => file.originFileObj as File));
        }
      }}
      onCancel={() => {
        if (fileList.length > 0) {
          const ok = confirm(
            '업로드하지 않은 이미지가 있습니다. 모달을 닫으시겠습니까?'
          );
          if (!ok) {
            return;
          }
        }
        onClose(null);
      }}
    >
      <Upload
        multiple
        fileList={fileList}
        beforeUpload={() => false}
        accept="image/*"
        listType="picture-card"
        onChange={handleChange}
        className="max-h-[600px] overflow-y-auto"
      >
        <PlusOutlined />
      </Upload>
    </Modal>
  );
}
