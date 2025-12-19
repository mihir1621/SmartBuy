import { useState, useEffect } from 'react';
import Image from 'next/image';

const DEFAULT_FALLBACK = "https://placehold.co/600x600/png?text=Product+Image";

export default function ImageWithFallback({ src, alt, fallback = DEFAULT_FALLBACK, ...props }) {
    const [imgSrc, setImgSrc] = useState(src);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setIsError(false);
    }, [src]);

    return (
        <Image
            {...props}
            src={isError ? fallback : imgSrc}
            alt={alt || "Image"}
            onError={() => {
                if (!isError) {
                    setIsError(true);
                    setImgSrc(fallback);
                }
            }}
            unoptimized={isError} // Fallback might not need optimization or might fail it
        />
    );
}
