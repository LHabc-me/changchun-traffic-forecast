import { useEffect, useRef, useState } from "react";
import { Slider } from "@fluentui/react-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Rectangle, TileLayer, useMap, useMapEvents } from "react-leaflet";

const Grid = (props) => {
  const { rectLength, ...rest } = props;
  /*
    将长春市分成网络状的矩形区域，每个矩形区域的宽高为rectLength米
    吉林省 经度121.638964~131.309886	纬度40.864207~46.302152
    长春市 125°06′31″E—125°34′37″E，43°43′57″N—44°00′10″N
    1m=0.00001141经度 1m=0.00000899纬度
   */
  const map = useMap();// useMap、useMapEvents只能在MapContainer的子组件中使用
  const lng1 = 125.10861111111111;// 经度最小值
  const lng2 = 125.57722222222222;// 经度最大值
  const lat1 = 43.7325;// 纬度最小值
  const lat2 = 44.00277777777778;// 纬度最大值
  const lngperm = 0.00001141;// 经度方向每增加1m，经度增加的值
  const latperm = 0.00000899;// 纬度方向每增加1m，纬度增加的值

  const [rects, setRects] = useState([]);
  const colors = [
    "#ff0000",
    "#ff7f00",
    "#ffff00",
    "#00ff00"
  ];
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
                     fillColor={colors[Math.floor((i * 100 + j * 100 + j * i * 100)) % 4]} />
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
};

function App() {
  const [rectLength, setRectLength] = useState(500);// 矩形宽度 单位：米

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "row"
    }}>
      <div style={{ flex: 1 }}>
        <Slider min={100}
                max={1000}
                defaultValue={500}
                value={rectLength}
                onChange={(_, data) => {
                  setRectLength(data.value);
                }} />
        {rectLength}
      </div>
      <div style={{
        height: "100%",
        flex: 10
      }}>
        <MapContainer style={{
          height: "100%",
          width: "100%"
        }}
                      center={[43.88, 125.35]}
                      zoom={13}
                      scrollWheelZoom={true}
        >
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Grid rectLength={rectLength} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
