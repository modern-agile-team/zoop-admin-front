import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { Image } from 'antd';

import { imageQueries } from '@/shared/service/query/image';

interface ImageGalleryProps {
  onSelect: (imageUrl: string) => void;
}

const PAGE_SIZE = 30;

export default function ImageModal({ onSelect }: ImageGalleryProps) {
  const currentPage = useSearch({ from: '/(menus)/assets/images/' }).page;

  const {
    data: imageList,
    isLoading,
    refetch,
  } = useQuery({
    ...imageQueries.getList({
      category: undefined,
      page: currentPage,
      perPage: PAGE_SIZE,
    }),
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        maxHeight: 550,
        overflow: 'auto',
      }}
    >
      {imageList?.data.map((ele) => (
        <Image
          key={ele.id}
          src={ele.quizImageUrl}
          alt={ele.originalFileName}
          width={200}
          height={200}
          style={{
            objectFit: 'cover',
            cursor: 'pointer',
            border: '1px solid #999',
            borderRadius: 16,
          }}
          onClick={() => onSelect(imageUrl)}
          preview={false}
        />
      ))}
    </div>
  );
}
