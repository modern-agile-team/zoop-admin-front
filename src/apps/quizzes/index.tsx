import { Spin } from 'antd';
import { Suspense } from 'react';

import QuizzesTable from './components/QuizzesTable';

export default function QuizListPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <Suspense fallback={<Spin />}>
          <QuizzesTable />
        </Suspense>
      </div>
    </div>
  );
}
