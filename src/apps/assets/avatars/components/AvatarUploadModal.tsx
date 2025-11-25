import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Form, Image, Input, Modal, Upload } from 'antd';
import type { ReactNode } from 'react';

import type { AvatarUploadData } from './schema';

interface FormValues {
  fileList: UploadFile[];
  metadata: Record<
    string,
    {
      name?: string;
      description?: string;
    }
  >;
}

interface Props {
  isOpen: boolean;
  onClose: (data: AvatarUploadData[] | null) => void;
}

export default function AvatarUploadModal({ isOpen, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();

  const handleOk = async () => {
    try {
      await form.validateFields(['fileList']);
    } catch {
      return;
    }

    const { fileList, metadata } = form.getFieldsValue();

    if (!fileList || fileList.length === 0) {
      onClose(null);
      return;
    }

    if (confirm('아바타를 업로드 하시겠습니까?')) {
      onClose(
        fileList.map((file) => ({
          file: file.originFileObj as File,
          name: metadata?.[file.uid]?.name,
          description: metadata?.[file.uid]?.description,
        }))
      );
    }
  };

  const handleCancel = () => {
    const fileList = form.getFieldValue('fileList') || [];
    if (fileList.length > 0) {
      if (
        !confirm('업로드하지 않은 아바타가 있습니다. 모달을 닫으시겠습니까?')
      ) {
        return;
      }
    }
    onClose(null);
  };

  const itemRender = (
    originNode: ReactNode,
    file: UploadFile,
    fileList: UploadFile[],
    actions: { download: () => void; preview: () => void; remove: () => void }
  ) => {
    return (
      <div className="mb-4 flex items-start gap-4 rounded-md border p-4">
        <Image
          width={80}
          height={80}
          src={file.thumbUrl}
          alt={file.name}
          className="rounded-md object-cover"
          preview={false}
        />
        <div className="flex-1">
          <p className="truncate font-semibold">{file.name}</p>
          <Form.Item name={['metadata', file.uid, 'name']} noStyle>
            <Input placeholder="이름 (선택 사항)" className="mt-2" />
          </Form.Item>
          <Form.Item name={['metadata', file.uid, 'description']} noStyle>
            <Input.TextArea
              placeholder="설명 (선택 사항)"
              rows={2}
              className="mt-2"
            />
          </Form.Item>
        </div>
        <Button
          icon={<DeleteOutlined />}
          onClick={actions.remove}
          danger
          type="text"
        />
      </div>
    );
  };

  return (
    <Modal
      title="아바타 업로드"
      open={isOpen}
      okText="업로드"
      cancelText="취소"
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ fileList: [], metadata: {} }}
        className="max-h-[60vh] overflow-y-auto p-1"
      >
        <Form.Item
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          rules={[
            {
              required: true,
              message: '업로드할 아바타를 하나 이상 선택해주세요.',
            },
          ]}
        >
          <Upload
            multiple
            beforeUpload={() => false}
            accept="image/*"
            itemRender={itemRender}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>파일 선택</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
