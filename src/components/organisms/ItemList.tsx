import { Fragment, ReactNode } from "react";

type ItemListProps<T> = {
  data: T[];
  renderItem: (item: T, index: number, arr: T[]) => React.ReactNode;
  getKey: (item: T) => string | number;
  separator?: ReactNode;
};

export const ItemList = <T,>({
  data,
  renderItem,
  getKey,
  separator = <hr className="w-full border-t border-slate-300" />,
}: ItemListProps<T>) => {
  return (
    <>
      {data.map((item, index, arr) => {
        return (
          <Fragment key={getKey(item)}>
            {renderItem(item, index, arr)}
            {index !== arr.length - 1 && separator}
          </Fragment>
        );
      })}
    </>
  );
};
