import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Form, Modal, Upload } from 'antd';

import type { UploadData } from './type';

interface FormValues {
  fileList: UploadFile[];
}

interface Props {
  isOpen: boolean;
  onClose: (data: UploadData | null) => void;
}

export default function SfxUploadModal({ isOpen, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();

  const handleOk = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }

    const { fileList } = form.getFieldsValue();

    if (confirm('음향 효과를 업로드 하시겠습니까?')) {
      onClose({
        fileList: fileList.map(
          (file: UploadFile) => file.originFileObj as File
        ),
      });
    }
  };

  const handleCancel = () => {
    const fileList = form.getFieldValue('fileList') || [];
    if (fileList.length > 0) {
      if (
        !confirm('업로드하지 않은 음향 효과가 있습니다. 모달을 닫으시겠습니까?')
      ) {
        return;
      }
    }
    onClose(null);
  };

  return (
    <Modal
      title="음향 효과 업로드"
      open={isOpen}
      okText="업로드"
      cancelText="취소"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ category: '', fileList: [] }}
      >
        <Form.Item
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          rules={[
            {
              required: true,
              message: '업로드할 음향 효과를 하나 이상 선택해주세요.',
            },
          ]}
        >
          <Upload
            multiple
            beforeUpload={() => false}
            accept="audio/*"
            listType="text"
            className="max-h-[500px] overflow-y-auto"
          >
            <Button icon={<UploadOutlined />}>파일 선택</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
