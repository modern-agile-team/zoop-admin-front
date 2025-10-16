import { Input, InputNumber, Select } from 'antd';

import type { QuizDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';

interface EditableCellProps {
  editing: boolean;
  dataIndex: keyof QuizDto;
  record: QuizDto;
  inputType: 'number' | 'text' | 'select';
  onSave: (key: string, dataIndex: keyof QuizDto, value: unknown) => void;
  children: React.ReactNode;
  onDoubleClick: () => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  record,
  inputType,
  onSave,
  children,
  onDoubleClick,
}) => {
  let inputNode: React.ReactNode;

  if (inputType === 'select') {
    inputNode = (
      <Select
        autoFocus
        defaultValue={record[dataIndex]}
        style={{ width: '100%', minWidth: '120px' }}
        onChange={(value) => onSave(record.id, dataIndex, value)}
        options={[
          { value: 'multipleChoice', label: '다중선택' },
          { value: 'shortAnswer', label: '짧은 글' },
          { value: 'selectPicture', label: '그림맞추기' },
          { value: 'correctWords', label: '단어맞추기' },
        ]}
      />
    );
  } else if (inputType === 'number') {
    inputNode = (
      <InputNumber
        autoFocus
        onPressEnter={(e) =>
          onSave(record.id, dataIndex, (e.target as HTMLInputElement).value)
        }
        onBlur={(e) => onSave(record.id, dataIndex, e.target.value)}
      />
    );
  } else {
    inputNode = (
      <Input
        autoFocus
        onPressEnter={(e) =>
          onSave(record.id, dataIndex, (e.target as HTMLInputElement).value)
        }
        onBlur={(e) => onSave(record.id, dataIndex, e.target.value)}
      />
    );
  }

  return (
    <td onDoubleClick={onDoubleClick}>{editing ? inputNode : children}</td>
  );
};

export default EditableCell;
