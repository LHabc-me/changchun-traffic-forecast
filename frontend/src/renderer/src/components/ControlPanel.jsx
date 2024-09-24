import {
  Button,
  Checkbox, CompoundButton, Field,
  Input, ProgressBar,
  Select,
  Tab,
  TabList
} from "@fluentui/react-components";
import { TimePicker } from "@fluentui/react-timepicker-compat";
import { DatePicker, defaultDatePickerStrings } from "@fluentui/react-datepicker-compat";
import { setObject, formatDate, formatTime } from "../utils";
import { useContext } from "react";
import ToastContext from "../contexts/ToastContext";

function GridConfig(props) {
  const { config, message, onConfigChange, ...rest } = props;
  const { rectLength } = config.grid;
  return (
    <div {...rest}>
      <div>
        <div>
          栅格长度(米)
        </div>
        <Input value={rectLength}
               style={{ width: "100%" }}
               onChange={(_, data) => {
                 onConfigChange(setObject(config, "grid.rectLength", data.value));
               }} />
      </div>
    </div>
  );
}


function PositionConfig(props) {
  const { config, message, onConfigChange, ...rest } = props;
  const { pointSize } = config.position;
  return (
    <div {...rest}>
      <div>
        <div>
          散点大小
        </div>
        <Input value={pointSize}
               style={{ width: "100%" }}
               onChange={(_, data) => {
                 onConfigChange(setObject(config, "position.pointSize", data.value));
               }} />
      </div>
    </div>
  );
}

function StreetConfig(props) {
  const { config, message, onConfigChange, ...rest } = props;
  const { lineWidth } = config.street;
  return (
    <div {...rest}>
      <div>
        <div>
          线宽
        </div>
        <Input value={lineWidth}
               style={{ width: "100%" }}
               onChange={(_, data) => {
                 onConfigChange(setObject(config, "street.lineWidth", data.value));
               }} />
      </div>
      <div>
        <div>
          分割道路
        </div>
        <div>
          <Select
            value={
              (config.street.split.mode === null && "不分割") ||
              (config.street.split.mode === "500" && "每隔500米分割") ||
              (config.street.split.mode === "1000" && "每隔1000米分割")
            }
            onChange={(_, data) => {
              let mode = null;
              if (data.value === "不分割") {
                mode = null;
              } else if (data.value === "每隔500米分割") {
                mode = "500";
              } else if (data.value === "每隔1000米分割") {
                mode = "1000";
              }
              onConfigChange(setObject(config, "street.split.mode", mode));
            }}>
            <option>不分割</option>
            <option>每隔500米分割</option>
            <option>每隔1000米分割</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

function AutoPlayConfig(props) {
  const { config, message, onConfigChange, ...rest } = props;
  return (
    <div {...rest}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <div style={{ flex: 1 }}>
          <Checkbox checked={config.autoPlay.enable}
                    onChange={(_, data) => {
                      onConfigChange(setObject(config, "autoPlay.enable", data.checked));
                    }} />
          自动播放
        </div>
        <div style={{ flex: 2 }}>
          {
            message.autoPlay.progress.enable && (
              <Field validationMessage={`当前进度：${message.autoPlay.progress.currentTimespan.from ?? "未开始"}`}
                     validationState="none">
                <ProgressBar max={Number.parseInt(message.autoPlay.progress.max)}
                             value={Number.parseInt(message.autoPlay.progress.value)} />
              </Field>
            )
          }
        </div>
      </div>
      <div style={{
        marginLeft: 20
      }}>
        <div>
          每帧最短间隔时间(秒)
          <Select value={config.autoPlay.frameInterval}
                  onChange={(_, data) => {
                    onConfigChange(setObject(config, "autoPlay.frameInterval", data.value));
                  }}>
            <option>1</option>
            <option>3</option>
            <option>5</option>
          </Select>
        </div>
        <div>
          每帧数据量(分钟)
          <Select value={config.autoPlay.dataInterval}
                  onChange={(_, data) => {
                    onConfigChange(setObject(config, "autoPlay.dataInterval", data.value));
                  }}>
            <option>5</option>
            <option>10</option>
            <option>30</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

function BasicConfig(props) {
  const { config, message, onConfigChange, ...rest } = props;
  const datePickerLocaleStrings = {
    ...defaultDatePickerStrings,
    days: [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ],
    shortDays: ["日", "一", "二", "三", "四", "五", "六"],
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月"
    ],

    shortMonths: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月"
    ],
    goToToday: "今天"
  };
  return (
    <div {...rest}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 3
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}>
          起始时间
          <DatePicker allowTextInput={true}
                      strings={datePickerLocaleStrings}
                      formatDate={formatDate}
                      value={new Date(config.timespan.from ?? null)}
                      onChange={(_, data) => {
                        onConfigChange(setObject(config, "timespan.from", `${formatDate(data.value)} ${formatTime(new Date(config.timespan.from))}`));
                      }} />
          <TimePicker value={formatTime(new Date(config.timespan.from ?? null))}
                      onTimeChange={(_, data) => {
                        onConfigChange(setObject(config, "timespan.from", `${formatDate(new Date(config.timespan.from))} ${formatTime(data.selectedTime)}`));
                      }}
                      freeform={true}
                      increment={5} />
        </div>
        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}>
          结束时间
          <DatePicker allowTextInput={true}
                      strings={datePickerLocaleStrings}
                      formatDate={formatDate}
                      value={new Date(config.timespan.to ?? null)}
                      onChange={(_, data) => {
                        onConfigChange(setObject(config, "timespan.to", `${formatDate(data.value)} ${formatTime(new Date(config.timespan.to))}`));
                      }} />
          <TimePicker value={formatTime(new Date(config.timespan.to ?? null))}
                      onTimeChange={(_, data) => {
                        onConfigChange(setObject(config, "timespan.to", `${formatDate(new Date(config.timespan.to))} ${formatTime(data.selectedTime)}`));
                      }}
                      increment={5} />
        </div>
      </div>
    </div>
  );
}

function ChartsConfig(props) {
  const { config, message, onConfigChange, ...rest } = props;
  const ChartButton = (props) => {
    const { type, description, selected, onClick, ...rest } = props;
    return (
      <CompoundButton appearance={selected ? "primary" : "secondary"}
                      onClick={onClick}
                      secondaryContent={description}>
        <span className={"colorBrandForeground1"}>{type}</span>
      </CompoundButton>
    );
  };
  const charts = [
    { type: "行驶方向统计", description: "显示车辆行驶方向统计图" },
    { type: "行驶速度统计", description: "显示车辆行驶速度统计图(小时)" },
    { type: "路段车流量统计", description: "显示各路段车流量统计图" },
    { type: "时段车流量统计", description: "显示各时段车流量统计图(小时)" }
  ];
  const selectedChart = config.charts.type;
  return (
    <div {...rest}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 5
      }}>
        {
          charts.map(({ type, description }, index) => (
            <ChartButton key={index}
                         type={type}
                         description={description}
                         selected={type === selectedChart}
                         onClick={() => {
                           onConfigChange(setObject(config, "charts.type", type));
                         }} />
          ))
        }
      </div>
    </div>
  );
}


function controlPanel(props) {
  const { config, message, onConfigChange, open, isReloading, ...rest } = props;
  // const configBasicProps = {
  //   style: { width: "100%" },
  //   config: { config },
  //   message: { message }
  // };
  const handleConfigChange = (newConfig) => {
    // if (isReloading) {
    //   toast.error("正在刷新中，请稍后");
    //   return;
    // }
    onConfigChange(newConfig);
  };
  const toast = useContext(ToastContext);
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10
    }}>
      <TabList selectedValue={config.selectedTab}
               onTabSelect={(_, data) => {
                 handleConfigChange(setObject(config, "selectedTab", data.value));
               }}>
        <Tab value="grid">
          栅格
        </Tab>
        <Tab value="position">
          散点
        </Tab>
        <Tab value="street">
          道路
        </Tab>
        <Tab value="charts">
          图表
        </Tab>
      </TabList>
      {
        config.selectedTab === "grid" && (
          <GridConfig config={config}
                      message={message}
                      onConfigChange={handleConfigChange}
                      style={{ width: "100%" }} />
        )
      }
      {
        config.selectedTab === "position" && (
          <PositionConfig config={config}
                          message={message}
                          onConfigChange={handleConfigChange}
                          style={{ width: "100%" }} />
        )
      }
      {
        config.selectedTab === "street" && (
          <StreetConfig config={config}
                        message={message}
                        onConfigChange={handleConfigChange}
                        style={{ width: "100%" }} />
        )
      }
      {
        config.selectedTab === "charts" && (
          <ChartsConfig config={config}
                        message={message}
                        onConfigChange={handleConfigChange}
                        style={{ width: "100%" }} />
        )
      }
      <BasicConfig style={{ width: "100%" }}
                   config={config}
                   message={message}
                   onConfigChange={handleConfigChange} />
      {
        ["grid", "position", "street"].includes(config.selectedTab) && (
          <>
            <AutoPlayConfig style={{ width: "100%" }}
                            config={config}
                            message={message}
                            onConfigChange={handleConfigChange} />
          </>
        )
      }
    </div>
  );
}

export default controlPanel;
