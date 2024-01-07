import { MapContainer, Rectangle, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import AppConfig from "../AppConfig";

function Map(props) {
  const { children, ...rest } = props;
  return (
    <div {...rest}>
      <MapContainer style={{
        height: "100%",
        width: "100%"
      }}
                    center={[43.88, 125.35]}
                    zoom={13}
                    scrollWheelZoom={true}>
        <TileLayer attribution={AppConfig.tileMap.attribution}
                   url={AppConfig.tileMap.url} />
        {children}
      </MapContainer>
    </div>
  );
}

export default Map;
