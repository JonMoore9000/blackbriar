'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BossImageProps {
  imageUrl?: string;
  name: string;
  className?: string;
}

export default function BossImage({ imageUrl, name, className = "w-24 h-24" }: BossImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    // Determine emoji size based on component size
    const isSmall = className.includes('w-8') || className.includes('h-8');
    const emojiSize = isSmall ? 'text-sm' : 'text-3xl';
    const marginClass = isSmall ? '' : 'mx-auto mb-3';

    return (
      <div className={`${className} ${marginClass} relative`}>
        <div className="w-full h-full bg-red-900/50 rounded-lg flex items-center justify-center">
          <span className={emojiSize}>👹</span>
        </div>
      </div>
    );
  }

  // Determine margins based on component size
  const isSmall = className.includes('w-8') || className.includes('h-8');
  const marginClass = isSmall ? '' : 'mx-auto mb-3';

  return (
    <div className={`${className} ${marginClass} relative`}>
      <Image
        src={imageUrl}
        alt={name}
        width={96}
        height={96}
        className="w-full h-full object-contain rounded-lg bg-red-900/20 border border-red-500/30"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
