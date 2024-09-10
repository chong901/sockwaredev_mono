import { animated, useTransition } from "@react-spring/web";
import { ReactNode } from "react";

type ItemListProps<T> = {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string | number;
  separator?: ReactNode;
};

export const ItemList = <T,>({
  data,
  renderItem,
  getKey,
  separator = <hr className="w-full border-t border-slate-300" />,
}: ItemListProps<T>) => {
  const transitions = useTransition(data, {
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 300 },
  });
  return (
    <>
      {transitions((styled, item, _, index) => {
        return (
          <animated.div key={getKey(item)} style={styled}>
            {renderItem(item)}
            {index !== data.length - 1 && separator}
          </animated.div>
        );
      })}
    </>
  );
};
