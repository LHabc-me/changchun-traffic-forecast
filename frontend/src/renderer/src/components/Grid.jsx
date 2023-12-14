import { Rectangle, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";

function Grid(props) {
  const { rectLength, lngspan, latspan, colors, ...rest } = props;
  /*
    将长春市分成网络状的矩形区域，每个矩形区域的宽高为rectLength米
    吉林省 经度121.638964~131.309886	纬度40.864207~46.302152
    长春市 125°06′31″E—125°34′37″E，43°43′57″N—44°00′10″N
    1m=0.00001141经度 1m=0.00000899纬度
   */
  const map = useMap();// useMap、useMapEvents只能在MapContainer的子组件中使用
  const [lng1, lng2] = lngspan;
  const [lat1, lat2] = latspan;

  const lngperm = 0.00001141;// 经度方向每增加1m，经度增加的值
  const latperm = 0.00000899;// 纬度方向每增加1m，纬度增加的值

  const [rects, setRects] = useState([]);

  const redraw = () => {
    const bounds = map.getBounds(); // 当前地图的可视范围，超出范围的矩形不绘制
    const arr = [];
    for (let i = Math.max(lng1, bounds.getWest()); i < Math.min(lng2, bounds.getEast()); i += rectLength * lngperm) {
      for (let j = Math.max(lat1, bounds.getSouth()); j < Math.min(lat2, bounds.getNorth()); j += rectLength * latperm) {
        arr.push(
          <Rectangle key={`${i}-${j}`}
                     bounds={[
                       [j, i],
                       [j + rectLength * latperm, i + rectLength * lngperm]
                     ]}
                     color="#00000000"
                     weight={1}
                     fillColor={colors[arr.length]} />
        );
      }
    }
    setRects(arr);
  };
  useEffect(() => {
    redraw();
  }, [rectLength]);

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
