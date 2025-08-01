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
    return (
      <div className={`${className} mx-auto mb-3 relative`}>
        <div className="w-full h-full bg-red-900/50 rounded-lg flex items-center justify-center">
          <span className="text-3xl">👹</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} mx-auto mb-3 relative`}>
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
