"use client";

import { useEffect, useRef } from "react";

type InfiniteScrollListProps<T> = {
  items: T[];
  loadMoreItems: () => void;
  loading: boolean;
  children: (item: T) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
};

export function InfiniteScrollList<T>({
  items,
  loadMoreItems,
  loading,
  children,
  loadingComponent = <p className="text-gray-500">Loading more items...</p>,
  emptyComponent,
}: InfiniteScrollListProps<T>) {
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !loading && items.length > 0) {
          loadMoreItems();
        }
      },
      { threshold: 1 },
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [items.length, loadMoreItems, loading]);

  return (
    <>
      {items.length === 0 ? emptyComponent : items.map(children)}
      <div ref={loaderRef} className="flex items-center justify-center">
        {loading && loadingComponent}
      </div>
    </>
  );
}
