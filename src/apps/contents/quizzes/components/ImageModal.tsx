import { Image } from 'antd';

import { IMAGE_GALLERY_MOCK } from '@/apps/contents/quizzes/mock/quizzes';

interface ImageGalleryProps {
  onSelect: (imageUrl: string) => void;
}

export default function ImageModal({ onSelect }: ImageGalleryProps) {
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
      {IMAGE_GALLERY_MOCK.map((imageUrl) => (
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={`${imageUrl}`}
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
