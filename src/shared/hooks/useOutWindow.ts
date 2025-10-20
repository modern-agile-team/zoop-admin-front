import { useBlocker } from '@tanstack/react-router';
import { useState } from 'react';

export default function useOutWindow() {
  const [formIsDirty, setFormIsDirty] = useState(false);

  const blocker = useBlocker({
    shouldBlockFn: () => formIsDirty,
    withResolver: true,
  });

  return { blocker, setFormIsDirty };
}
