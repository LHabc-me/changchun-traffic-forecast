import { useContext, useEffect, useRef, useState } from "react";
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
import Legend from "./components/Legend";
import { get_charts_option, get_grid, get_position, get_street } from "./api";
import ControlPanel from "./components/ControlPanel";
import { ArrowLeft24Regular, Settings24Regular } from "@fluentui/react-icons";
import _ from "lodash";
import { formatDate, formatTime, setObject } from "./utils";
import Charts from "./components/Charts";
import ToastContext from "./contexts/ToastContext";

function App() {
  const toast = useContext(ToastContext);
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
    street: {
      lineWidth: "2",// 线宽
      split: {
        mode: null
      }
    },
    charts: {
      type: "行驶方向统计"
    },
    timespan: {
      from: "2016-04-11 07:00:00",
      to: "2016-04-11 07:30:00"
    },
    ignore: {
      enable: false,
      continuousStoppingSeconds: "0"
    },
    autoPlay: {
      enable: false,
      frameInterval: "1",// 单位：秒
      dataInterval: "10" // 单位：分钟
    }
  });
  const [configMessage, setConfigMessage] = useState({
    autoPlay: {
      progress: {
        enable: true,
        max: 100,
        value: 0,
        currentTimespan: {
          from: null,
          to: null
        }
      }
    }
  });
  const [config, setConfig] = useState(configEditing);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(true);
  const positionRef = useRef(null);
  const streetRef = useRef(null);

  const getApiParams = ({ timespan }) => {
    if (configEditing.selectedTab === "grid") {
      return {
        grid: {
          width: configEditing.grid.rectLength,
          height: configEditing.grid.rectLength,
          from: [lngspan[0], latspan[0]],
          to: [lngspan[1], latspan[1]]
        },
        timespan
      };
    } else if (configEditing.selectedTab === "position") {
      return {
        timespan
      };
    } else if (configEditing.selectedTab === "street") {
      return {
        timespan,
        split: {
          mode: configEditing.street.split.mode
        }
      };
    } else if (configEditing.selectedTab === "charts") {
      return {
        timespan,
        type: configEditing.charts.type
      };
    }
  };

  const needRefetch = ({ timespan }) => {
    const newConfig = _.cloneDeep(configEditing);
    if (configEditing.selectedTab === "grid") {
      return true;
    } else if (configEditing.selectedTab === "position") {
      newConfig.position.pointSize = config.position.pointSize;
      return !_.isEqual(newConfig, config) || _.isEqual(configEditing, config);
    } else if (configEditing.selectedTab === "street") {
      newConfig.street.lineWidth = config.street.lineWidth;
      return !_.isEqual(newConfig, config) || _.isEqual(configEditing, config);
    } else {
      return true;
    }
  };

  const getRef = () => {
    if (configEditing.selectedTab === "grid") {
      return null;
    } else if (configEditing.selectedTab === "position") {
      return positionRef.current;
    } else if (configEditing.selectedTab === "street") {
      return streetRef.current;
    } else {
      return null;
    }
  };

  const getApi = () => {
    if (configEditing.selectedTab === "grid") {
      return get_grid;
    } else if (configEditing.selectedTab === "position") {
      return get_position;
    } else if (configEditing.selectedTab === "street") {
      return get_street;
    } else if (configEditing.selectedTab === "charts") {
      return get_charts_option;
    }
  };

  const reloadNormal = async ({ timespan }) => {
    setIsReloading(true);
    try {
      if (needRefetch({ timespan })) {
        const api = getApi();
        const params = getApiParams({ timespan });
        const { data, type } = await api(params);
        setDataType(type);
        setData(data);
      } else {
        getRef()?.reload();
      }
    } catch (e) {
      toast.error("数据加载失败");
    } finally {
      setIsReloading(false);
    }
  };

  const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60 * 1000);
  };

  // 算出fromDate到toDate之间有多少个minutes，向上取整
  const countMinutes = (fromDate, toDate, minutes) => {
    const diff = toDate.getTime() - fromDate.getTime();
    const minutesDiff = diff / 1000 / 60;
    return Math.ceil(minutesDiff / minutes);
  };

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayInterval = useRef(null);
  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval.current);
    // setConfigMessage(setObject(configMessage, "autoPlay.progress.enable", false));
    setIsAutoPlaying(false);
  };
  const autoPlay = async () => {
    try {
      setIsReloading(true);
      clearInterval(autoPlayInterval.current);
      const minFrameInterval = configEditing.autoPlay.frameInterval * 1000;
      const timespanArray = [];
      const getAllDataPromise = async () => {
        const result = [];
        let timespan = {
          from: new Date(configEditing.timespan.from),
          to: new Date(configEditing.timespan.to)
        };
        const api = getApi();
        const resultLength = countMinutes(timespan.from, timespan.to, configEditing.autoPlay.dataInterval);
        for (let i = 0; i < resultLength; i++) {
          const span = {
            from: `${formatDate(timespan.from)} ${formatTime(timespan.from)}`,
            to: `${formatDate(timespan.to)} ${formatTime(timespan.to)}`
          };
          timespanArray.push(span);
          const dataPromise = api(getApiParams({
            timespan: span
          }));
          result.push(dataPromise);
          timespan.from = addMinutes(timespan.from, configEditing.autoPlay.dataInterval);
          timespan.to = addMinutes(timespan.to, configEditing.autoPlay.dataInterval);
        }
        return result;
      };
      const promiseArray = await getAllDataPromise();
      const dataArray = await Promise.all(promiseArray);
      setIsAutoPlaying(true);
      let count = 0;
      let message = _.cloneDeep(configMessage);
      message.autoPlay.progress.max = dataArray.length;
      setConfigMessage(message);
      const nextFrame = () => {
        try {
          const { data, type } = dataArray.shift();
          message.autoPlay.progress.value = ++count;
          message.autoPlay.progress.currentTimespan = timespanArray.shift();
          setConfigMessage(message);
          setDataType(type);
          setData(data);
          if (dataArray.length === 0) {
            stopAutoPlay();
          }
        } catch (e) {
          stopAutoPlay();
        }
      };
      nextFrame();
      // message.autoPlay.progress.enable = true;
      // setConfigMessage(message);
      autoPlayInterval.current = setInterval(nextFrame, minFrameInterval);
    } catch (e) {
      toast.error("数据加载失败");
    } finally {
      setIsReloading(false);
    }
  };

  const reload = async () => {
    if (isReloading) {
      toast.error("正在刷新中，请稍后");
      return;
    }
    setConfig(_.cloneDeep(configEditing));
    if (configEditing.autoPlay.enable &&
      ["grid", "position", "street"].includes(configEditing.selectedTab)) {
      await autoPlay();
    } else {
      await reloadNormal({
        timespan: configEditing.timespan
      });
    }
  };
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "row",
      overflowY: "hidden"
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

      <OverlayDrawer modalType="non-modal"
                     open={isConfigPanelOpen}
                     onOpenChange={(_, { open }) => setIsConfigPanelOpen(open)}>
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
                            message={configMessage}
                            onConfigChange={(c) => {
                              setConfigEditing(c);
                            }}
                            isReloading={isReloading}
              />
              {
                !isAutoPlaying && (
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
                )
              }
              {
                isAutoPlaying && (
                  <Button onClick={stopAutoPlay}
                          appearance={"primary"}
                          style={{
                            width: "100%",
                            backgroundColor: "#c50f1f"
                          }}>
                    停止
                  </Button>
                )
              }
            </div>
          </div>
        </DrawerBody>
      </OverlayDrawer>
      <div style={{
        height: "100%",
        flex: 1
      }}>
        {
          ["grid", "position", "street"].includes(config.selectedTab) && (
            <Map style={{
              height: "100%",
              width: "100%"
            }}>
              {
                config.selectedTab === "grid" && (
                  <Grid rectLength={configEditing.grid.rectLength}
                        data={dataType === "grid" ? data : null} />
                )
              }
              {
                config.selectedTab === "position" && (
                  <Position pointSize={configEditing.position.pointSize}
                            data={dataType === "position" ? data : null}
                            ref={positionRef} />
                )
              }
              {
                config.selectedTab === "street" && (
                  <Street lineWidth={configEditing.street.lineWidth}
                          data={dataType === "street" ? data : null}
                          ref={streetRef} />
                )
              }
            </Map>
          )
        }
        {
          config.selectedTab === "charts" && (
            <Charts style={{
              height: "100%",
              width: "100%"
            }}
                    option={dataType === "charts_option" ? JSON.parse(data) : null} />
          )
        }
      </div>

      {
        (config.selectedTab === "grid" || config.selectedTab === "street") && (
          <div style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "#f7f7f7"
          }}>
            <Legend type={config.selectedTab} />
          </div>
        )
      }
    </div>
  );
}

export default App;
