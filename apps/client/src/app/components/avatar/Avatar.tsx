import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurerNeutral } from '@dicebear/collection';

export default function Avatar({ seed = 'John Doe', title = 'John Doe' }) {
  const avatar = useMemo(() => {
    return createAvatar(adventurerNeutral, {
      seed,
      size: 42,
      radius: 50,
      // ... other options
    }).toDataUri();
  }, [seed]);

  return <img src={avatar} alt="Avatar" title={title} />;
}
