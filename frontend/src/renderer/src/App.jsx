import { useEffect, useRef, useState } from "react";
import { Button, Slider } from "@fluentui/react-components";
import Map from "./components/Map";
import Grid from "./components/Grid";
import get_congestion_level from "./api/congestion_level";
import AppConfig from "./appConfig";

function App() {
  const lngspan = [
    125.10861111111111,
    125.57722222222222
  ];
  const latspan = [
    43.7325,
    44.00277777777778
  ];
  const [rectLength, setRectLength] = useState(500);// 矩形宽度 单位：米
  const [colors, setColors] = useState([]);
  const reload = () => {
    get_congestion_level({
        grid: {
          width: rectLength,
          height: rectLength,
          from: [lngspan[0], latspan[0]],
          to: [lngspan[1], latspan[1]]
        },
        timespan: {
          from: "2020-10-01 00:00:00",
          to: "2020-10-01 23:59:59"
        }
      }
    ).then(({ data }) => {
      // setColors(data.map(item => colorMap[item]));
      setColors(
        Array.from({ length: 100000 })
          .map(() => AppConfig.colorMap[Math.floor(Math.random() * 10) + 1])
      );
    });
  };
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
        <div>
          {rectLength}
        </div>
        <Button onClick={reload}>刷新</Button>
      </div>
      <div style={{
        height: "100%",
        flex: 10
      }}>
        <Map style={{
          height: "100%",
          width: "100%"
        }}>
          <Grid rectLength={rectLength}
                lngspan={lngspan}
                latspan={latspan}
                colors={colors} />
        </Map>
      </div>
    </div>
  );
}

export default App;
