import React, { FC } from 'react';
import Image from 'next/image';
import { ImageElement } from '../markdownProcessor';

interface Props {
    element: ImageElement;
}

export const MarkdownImage: FC<Props> = ({ element }) => {
    const { src, alt } = element;

    // Convert relative paths to absolute paths for blog images
    const imagePath = src.startsWith('/') ? src : `/images/blog/${src}`;

    return (
        <div className="my-8">
            <Image
                src={imagePath}
                alt={alt}
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
                style={{
                    width: '100%',
                    height: 'auto',
                }}
                priority={undefined}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
            {alt && (
                <p className="text-center text-sm text-gray-600 mt-2 italic">
                    {alt}
                </p>
            )}
        </div>
    );
};
