import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurerNeutral } from '@dicebear/collection';

export default function Avatar({
  seed = 'John Doe',
  title = 'John Doe',
  size = 42,
}) {
  const avatar = useMemo(() => {
    return createAvatar(adventurerNeutral, {
      seed,
      size,
      radius: 50,
      // ... other options
    }).toDataUri();
  }, [seed, size]);

  return <img src={avatar} alt="Avatar" title={title} className="avatar" />;
}
