import { Input, InputNumber } from 'antd';
import React from 'react';

import type { Quiz } from '../mock/quizzes';

const EditableCell: React.FC<{
  editing: boolean;
  dataIndex: keyof Quiz;
  record: Quiz;
  inputType: 'number' | 'text';
  onSave: (key: string, dataIndex: keyof Quiz, value: unknown) => void;
  children: React.ReactNode;
  onDoubleClick: () => void;
}> = ({
  editing,
  dataIndex,
  record,
  inputType,
  onSave,
  children,
  onDoubleClick,
}) => {
  const inputNode =
    inputType === 'number' ? (
      <InputNumber
        autoFocus
        onBlur={(e) => onSave(record.id, dataIndex, e.target.value)}
        onPressEnter={(e) =>
          onSave(record.id, dataIndex, (e.target as HTMLInputElement).value)
        }
      />
    ) : (
      <Input
        autoFocus
        onBlur={(e) => onSave(record.id, dataIndex, e.target.value)}
        onPressEnter={(e) =>
          onSave(record.id, dataIndex, e.currentTarget.value)
        }
      />
    );

  return (
    <td onDoubleClick={onDoubleClick}>{editing ? inputNode : children}</td>
  );
};

export default EditableCell;
