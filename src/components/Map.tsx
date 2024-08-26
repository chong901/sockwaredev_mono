import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  return (
    <MapContainer
      center={[1.275807695459636, 103.80688665819828]}
      zoom={13}
      scrollWheelZoom={false}
      className="flex h-screen w-full "
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[1.275807695459636, 103.80688665819828]}
        icon={divIcon({ className: "w-10 h-10 bg-red-600" })}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
