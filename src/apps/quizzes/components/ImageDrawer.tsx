import { Drawer } from 'antd';

import type { QuizDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';

import type { DrawerStateType } from './QuizzesTable';

export const IMAGE_GALLERY_MOCK = [
  'https://images.unsplash.com/photo-1538485394074-75f3474c7590?q=80&w=200',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=200',
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=200',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=200',
];

interface ImageDrawerProps {
  drawerState: DrawerStateType;
  setDrawerState: (modified: DrawerStateType) => void;
  save: (key: string, dataIndex: keyof QuizDto, value: unknown) => void;
}

export default function ImageDrawer({
  drawerState,
  setDrawerState,
  save,
}: ImageDrawerProps) {
  const handleImageSelect = (imageUrl: string) => {
    if (drawerState.quizId) {
      save(drawerState.quizId, 'imageUrl', imageUrl);
    }
    setDrawerState({ open: false, quizId: null });
  };
  return (
    <Drawer
      title="이미지 갤러리"
      placement="right"
      onClose={() => setDrawerState({ open: false, quizId: null })}
      open={drawerState.open}
      width={400}
    >
      <div className="grid grid-cols-2 gap-4">
        {IMAGE_GALLERY_MOCK.map((imgUrl) => (
          <div
            key={imgUrl}
            className="cursor-pointer border-2 border-transparent hover:border-primary-500 rounded-lg overflow-hidden"
            onClick={() => handleImageSelect(imgUrl)}
          >
            <img
              src={imgUrl}
              alt="갤러리 이미지"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </Drawer>
  );
}
