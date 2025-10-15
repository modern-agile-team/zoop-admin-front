import { useQuery } from '@tanstack/react-query';
import { Typography } from 'antd';

import { imageQueries } from '@/shared/service/query/image';

export default function ImageAssetPage() {
  const { data } = useQuery(imageQueries.getList({}));

  return (
    <div>
      <Typography.Title level={1}>이미지 관리</Typography.Title>
      {data?.data.map((image) => (
        <div key={image.id}>
          <img src={image.imageUrl} alt={image.id} width={100} height={100} />
        </div>
      ))}
    </div>
  );
}
