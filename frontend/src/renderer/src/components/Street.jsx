import { Polyline, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import AppConfig from "../AppConfig";

function Street(props) {
  const { data, ...rest } = props;
  const map = useMap();

  const [lines, setLines] = useState([]);// [data: Array, level: Number]

  const redraw = () => {
    if (data.length === 0) return;
    const bounds = map.getBounds(); // 当前地图的可视范围，超出范围的矩形不绘制

    // 实心无边框
    setLines(data.map(({ street_geometry, level }, index) => {
      console.log(street_geometry, level);
      return (
        <Polyline key={index}
                  positions={street_geometry}
                  color={AppConfig.colorMap[level]}
                  weight={2}>
        </Polyline>
      );
    }));
  };

  useEffect(() => {
    redraw();
  }, [data]);

  useMapEvents({
    moveend() {
      redraw();
    },
    zoomend() {
      redraw();
    }
  });

  return <>{lines}</>;
}

export default Street;
