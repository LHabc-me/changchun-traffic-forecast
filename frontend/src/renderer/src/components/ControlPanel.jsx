import {
  Button, Checkbox,
  Input,
  Slider,
  Tab,
  TabList
} from "@fluentui/react-components";
import { TimePicker } from "@fluentui/react-timepicker-compat-preview";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { useEffect, useState } from "react";
import { get_data_timespan } from "../api";
import { setObject } from "../utils";

function GridConfig(props) {
  const { config, onConfigChange, ...rest } = props;
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
  const { config, onConfigChange, ...rest } = props;
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
  const { config, onConfigChange, ...rest } = props;
  return (
    <div {...rest}>
    </div>
  );
}

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatTime(date) {
  return date.toTimeString().split(" ")[0];
}

function controlPanel(props) {
  const { config, onConfigChange, onConfirm, open, ...rest } = props;
  // const [availableDateSpan, setAvailableDateSpan] = useState(null);
  // useEffect(() => {
  //   get_data_timespan()
  //     .then((data) => {
  //       setAvailableDateSpan(data);
  //     });
  // }, []);
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10
    }}>
      <TabList selectedValue={config.selectedTab}
               onTabSelect={(_, data) => onConfigChange(setObject(config, "selectedTab", data.value))}>
        <Tab value="grid">
          栅格
        </Tab>
        <Tab value="position">
          散点
        </Tab>
        <Tab value="street">
          道路
        </Tab>
      </TabList>
      {
        config.selectedTab === "grid" && (
          <GridConfig config={config}
                      onConfigChange={onConfigChange}
                      style={{ width: "100%" }} />
        )
      }
      {
        config.selectedTab === "position" && (
          <PositionConfig config={config}
                          onConfigChange={onConfigChange}
                          style={{ width: "100%" }} />
        )
      }
      {
        config.selectedTab === "street" && (
          <StreetConfig config={config}
                        onConfigChange={onConfigChange}
                        style={{ width: "100%" }} />
        )
      }
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3
      }}>
        起始时间
        <DatePicker allowTextInput={true}
                    formatDate={formatDate}
                    value={new Date(config.timespan.from ?? null)}
                    onChange={(_, data) => {
                      onConfigChange(setObject(config, "timespan.from", `${formatDate(data.value)} ${formatTime(new Date(config.timespan.from))}`));
                    }} />
        <TimePicker value={formatTime(new Date(config.timespan.from ?? null))}
                    onTimeChange={(_, data) => {
                      onConfigChange(setObject(config, "timespan.from", `${formatDate(new Date(config.timespan.from))} ${formatTime(data.selectedTime)}`));
                    }}
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
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <Checkbox />
        <div>
          忽略连续停留时间大于
          <Input style={{ width: 55 }} />
          秒的数据
        </div>
      </div>
    </div>
  );
}

export default controlPanel;
