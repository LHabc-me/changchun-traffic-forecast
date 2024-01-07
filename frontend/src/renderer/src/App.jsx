import { useEffect, useRef, useState } from "react";
import { Button, Input, Slider } from "@fluentui/react-components";
import Map from "./components/Map";
import Grid from "./components/Grid";
import Position from "./components/Position";
import { get_congestion_level, get_position } from "./api";
import ControlPanel from "./components/ControlPanel";


function App() {
  const lngspan = [
    125.10861111111111,
    125.57722222222222
  ];
  const latspan = [
    43.7325,
    44.00277777777778
  ];
  const [config, setConfig] = useState({
    rectLength: 500,// 矩形宽度 单位：米
    pointSize: 10// 点大小
  });
  const { rectLength, pointSize } = config;
  const [gridData, setGridData] = useState([]);
  const [taxiPositionData, setTaxiPositionData] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [showTaxiPosition, setShowTaxiPosition] = useState(true);
  const reload = () => {
    showTaxiPosition && (
      get_position({
        timespan: {
          from: "2016-04-11 00:07:00",
          to: "2016-04-11 00:07:10"
        }
      }).then((result) => {
        setTaxiPositionData(result);
      })
    );
    showGrid && (
      get_congestion_level({
          grid: {
            width: rectLength,
            height: rectLength,
            from: [lngspan[0], latspan[0]],
            to: [lngspan[1], latspan[1]]
          },
          timespan: {
            from: "2016-04-11 00:07:03",
            to: "2016-04-11 00:07:04"
          }
        }
      ).then((result) => {
        setGridData(result);
      })
    );
  };
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "row"
    }}>
      <div style={{ flex: 1 }}>
        <ControlPanel style={{
          height: "100%"
        }}
                      config={config}
                      onConfigChange={(c) => {
                        setConfig(c);
                      }}
                      onConfirm={reload}
        />
      </div>
      <div style={{
        height: "100%",
        flex: 10
      }}>
        <Map style={{
          height: "100%",
          width: "100%"
        }}>
          {
            showGrid && (
              <Grid rectLength={rectLength}
                    data={gridData} />
            )
          }
          {
            showTaxiPosition && (
              <Position pointSize={pointSize}
                        data={taxiPositionData} />
            )
          }
        </Map>
      </div>
    </div>
  );
}

export default App;
