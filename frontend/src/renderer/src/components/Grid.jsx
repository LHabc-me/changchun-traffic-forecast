import { Rectangle, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { cacl_grid_number } from "../utils";
import AppConfig from "../AppConfig";

function Grid(props) {
  const { rectLength, data, ...rest } = props;
  /*
    将长春市分成网络状的矩形区域，每个矩形区域的宽高为rectLength米
    吉林省 经度121.638964~131.309886	纬度40.864207~46.302152
    长春市 125°06′31″E—125°34′37″E，43°43′57″N—44°00′10″N
    1m=0.00001141经度 1m=0.00000899纬度
   */
  const map = useMap();// useMap、useMapEvents只能在MapContainer的子组件中使用

  const [rects, setRects] = useState([]);

  const redraw = () => {
    if (data.length === 0) return;
    const bounds = map.getBounds(); // 当前地图的可视范围，超出范围的矩形不绘制
    const arr = data.filter(arr => {
      const [lngstart, latstart, lngend, latend, level] = arr;
      const [lngstart1, latstart1, lngend1, latend1] = [
        Math.min(lngstart, lngend),
        Math.min(latstart, latend),
        Math.max(lngstart, lngend),
        Math.max(latstart, latend)
      ];
      return bounds.contains([
        [latstart1, lngstart1],
        [latend1, lngend1]
      ]) || bounds.intersects([
        [latstart1, lngstart1],
        [latend1, lngend1]
      ]);
    });
    setRects(arr.map(arr => {
      const [lngstart, latstart, lngend, latend, level] = arr;
      return (
        <Rectangle key={`${lngstart}-${latstart}`}
                   bounds={[
                     [latstart, lngstart],
                     [latend, lngend]
                   ]}
                   color="#00000000"
                   weight={1}
                   fillColor={AppConfig.colorMap[level]}>

        </Rectangle>
      );
    }));
  };
  useEffect(() => {
    redraw();
  }, [rectLength, data]);

  useMapEvents({
    moveend() {
      redraw();
    },
    zoomend() {
      redraw();
    }
  });

  return <>{rects}</>;
}

export default Grid;
