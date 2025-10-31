import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
    onLoadMore: () => void | Promise<void>;
    disabled?: boolean;
    rootMargin?: string;
};

export const InfiniteScroll = ({ onLoadMore, disabled = false, rootMargin = "200px" }: InfiniteScrollProps) => {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (disabled) {
            return;
        }

        const node = sentinelRef.current;
        if (!node) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (entry?.isIntersecting) {
                    onLoadMore();
                }
            },
            { rootMargin }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [disabled, onLoadMore, rootMargin]);

    return <div ref={sentinelRef} aria-hidden="true" />;
};
