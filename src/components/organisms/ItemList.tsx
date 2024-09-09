import { Fragment, ReactNode } from "react";

type ItemListProps<K extends string, T> = {
  data: (T & { [key in K]: string | number })[];
  renderItem: (item: T, index: number, arr: T[]) => React.ReactNode;
  uniqIdentifier: K;
  separator?: ReactNode;
};

export const ItemList = <K extends string, T>({
  data,
  renderItem,
  uniqIdentifier,
  separator = <hr className="w-full border-t border-slate-300" />,
}: ItemListProps<K, T>) => {
  return (
    <>
      {data.map((item, index, arr) => {
        return (
          <Fragment key={item[uniqIdentifier]}>
            {renderItem(item, index, arr)}
            {index !== arr.length - 1 && separator}
          </Fragment>
        );
      })}
    </>
  );
};
