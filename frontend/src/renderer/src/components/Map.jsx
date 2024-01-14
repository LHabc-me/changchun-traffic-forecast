import AppConfig from "../AppConfig";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { createContext, useEffect, useState } from "react";
import MapContext from "../contexts/MapContext";
import { fromLonLat } from "ol/proj";

function Map(props) {
  const { children, ...rest } = props;
  const [map, setMap] = useState(null);
  useEffect(() => {
    const newMap = new OlMap({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat([125.3180852891106, 43.88444655236956]),
        zoom: 13
      })
    });

    setMap(newMap);
  }, []);

  return (
    <div {...rest}>
      <div id="map" style={{
        width: "100%",
        height: "100%"
      }}>
        <MapContext.Provider value={map}>
          {children}
        </MapContext.Provider>
      </div>
    </div>
  );
}

export default Map;
