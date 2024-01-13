import { useEffect, useRef, useState } from "react";
import {
  Button, DrawerBody,
  Input, OverlayDrawer,
  Slider,
  Spinner
} from "@fluentui/react-components";
import Map from "./components/Map";
import Grid from "./components/Grid";
import Position from "./components/Position";
import Street from "./components/Street";
import { get_grid, get_position, get_street } from "./api";
import ControlPanel from "./components/ControlPanel";
import { ArrowLeft24Regular, Settings24Regular } from "@fluentui/react-icons";
import _ from "lodash";

function App() {
  const lngspan = [
    125.10861111111111,
    125.57722222222222
  ];
  const latspan = [
    43.7325,
    44.00277777777778
  ];
  const [configEditing, setConfigEditing] = useState({
    selectedTab: "grid",
    grid: {
      rectLength: "500"// 矩形宽度 单位：米
    },
    position: {
      pointSize: "1"// 散点大小
    },
    street: {},
    timespan: {
      from: "2016-04-11 00:00:00",
      to: "2016-04-11 00:05:00"
    },
    ignore: {
      enable: false,
      continuousStoppingSeconds: "0"
    }
  });
  const [config, setConfig] = useState(configEditing);
  const [gridData, setGridData] = useState([]);
  const [taxiPositionData, setTaxiPositionData] = useState([]);
  const [streetData, setStreetData] = useState([]);
  const [isReloading, setIsReloading] = useState(false);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(true);
  const positionRef = useRef(null);
  const reload = async () => {
    setIsReloading(true);
    setConfig(_.cloneDeep(configEditing));
    try {
      if (configEditing.selectedTab === "position") {
        // 如果只修改了pointSize，不需要重新获取数据
        // 只要修改了其他的，就需要重新获取数据
        const refetch = async () => {
          const result = await get_position({
            timespan: configEditing.timespan
          });
          setTaxiPositionData(result);
        };
        const newConfig = _.cloneDeep(configEditing);
        newConfig.position.pointSize = config.position.pointSize;
        if (!_.isEqual(newConfig, config)) {
          await refetch();
        } else {
          positionRef.current.reload();
        }
      }

      if (configEditing.selectedTab === "grid") {
        const result = await get_grid({
            grid: {
              width: configEditing.grid.rectLength,
              height: configEditing.grid.rectLength,
              from: [lngspan[0], latspan[0]],
              to: [lngspan[1], latspan[1]]
            },
            timespan: configEditing.timespan
          }
        );
        setGridData(result);
      }

      if (configEditing.selectedTab === "street") {
        const result = await get_street({
          timespan: configEditing.timespan
        });
        setStreetData(result);
      }
    } finally {
      setIsReloading(false);
    }
  };
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "row"
    }}>

      {
        !isConfigPanelOpen && (
          <div style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: 5
          }}>
            <Button icon={<Settings24Regular />}
                    appearance={"subtle"}
                    onClick={() => setIsConfigPanelOpen(true)}></Button>
          </div>
        )
      }

      <OverlayDrawer
        modalType="non-modal"
        open={isConfigPanelOpen}
        onOpenChange={(_, { open }) => setIsConfigPanelOpen(open)}
      >
        <DrawerBody style={{
          padding: 10
        }}>
          <div>
            <Button icon={<ArrowLeft24Regular />}
                    onClick={() => setIsConfigPanelOpen(false)}
                    appearance={"subtle"}></Button>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}>
              <ControlPanel config={configEditing}
                            onConfigChange={(c) => {
                              setConfigEditing(c);
                            }}
                            onConfirm={reload}
              />
              <Button onClick={reload}
                      appearance={"primary"}
                      style={{
                        width: "100%"
                      }}>
                {
                  !isReloading && (
                    "刷新"
                  )
                }
                {
                  isReloading && (
                    <Spinner size={"tiny"} />
                  )
                }
              </Button>
            </div>
          </div>
        </DrawerBody>
      </OverlayDrawer>
      <div style={{
        height: "100%",
        flex: 1
      }}>
        <Map style={{
          height: "100%",
          width: "100%"
        }}>
          {
            config.selectedTab === "grid" && (
              <Grid rectLength={configEditing.grid.rectLength}
                    data={gridData} />
            )
          }
          {
            config.selectedTab === "position" && (
              <Position pointSize={configEditing.position.pointSize}
                        data={taxiPositionData}
                        ref={positionRef} />
            )
          }
          {
            config.selectedTab === "street" && (
              <Street data={streetData} />
            )
          }
        </Map>
      </div>
    </div>
  );
}

export default App;
