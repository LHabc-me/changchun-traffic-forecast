import { Circle, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import AppConfig from "../AppConfig";

function Position(props) {
  const { pointSize, data, ...rest } = props;
  const map = useMap();

  const [points, setPoints] = useState([]);

  const redraw = () => {
    if (data.length === 0) return;
    const bounds = map.getBounds(); // 当前地图的可视范围，超出范围的矩形不绘制
    const arr = data.filter(i => {
      const { lon, lat } = i;
      return bounds.contains([[lat, lon]]) || bounds.intersects([[lat, lon]]);
    });

    // 实心无边框
    setPoints(arr.map(({ lon, lat }, index) => {
      return (
        <Circle key={index}
                center={[lat, lon]}
                radius={pointSize}
                fillColor={AppConfig.position.color}
                color={AppConfig.position.color}>
        </Circle>
      );
    }));
  };
  useEffect(() => {
    redraw();
  }, [pointSize, data]);

  useMapEvents({
    moveend() {
      redraw();
    },
    zoomend() {
      redraw();
    }
  });

  return <>{points}</>;
}

export default Position;
