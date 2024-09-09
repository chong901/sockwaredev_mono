import { InfoContainer } from "@/components/containers/InfoContainer";
import { FavoriteBusStopList } from "@/components/pages/map/FavoriteBusStopList";

export const FavoriteBusStopInfo = () => {
  return (
    <InfoContainer header={<div className="text-3xl font-bold">Favorite </div>}>
      <FavoriteBusStopList />
    </InfoContainer>
  );
};
