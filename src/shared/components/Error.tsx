import { useRouter } from '@tanstack/react-router';
import { Button, Result } from 'antd';
import type { ResultStatusType } from 'antd/es/result';

interface ErrorComponentProps {
  status: ResultStatusType;
  title: string;
  description: string;
}

export default function ErrorComponent({
  status,
  title,
  description,
}: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="p-6">
      <Result
        status={status}
        title={title}
        subTitle={description}
        extra={
          <Button onClick={() => router.history.back()} type="primary">
            이전 페이지로 돌아가기
          </Button>
        }
      />
    </div>
  );
}
