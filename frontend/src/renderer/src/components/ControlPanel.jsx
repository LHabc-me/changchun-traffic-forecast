import {
  Checkbox, Field,
  Input, ProgressBar,
  Select,
  Tab,
  TabList
} from "@fluentui/react-components";
import { TimePicker } from "@fluentui/react-timepicker-compat";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { setObject, formatDate, formatTime } from "../utils";

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
          <Checkbox value={config.autoPlay.enable}
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
                      formatDate={formatDate}
                      value={new Date(config.timespan.from ?? null)}
                      onChange={(_, data) => {
                        onConfigChange(setObject(config, "timespan.from", `${formatDate(data.value)} ${formatTime(new Date(config.timespan.from))}`));
                      }} />
          <TimePicker value={formatTime(new Date(config.timespan.from ?? null))}
                      onTimeChange={(_, data) => {
                        console.log(data.selectedTime);
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


function controlPanel(props) {
  const { config, message, onConfigChange, open, ...rest } = props;
  // const configBasicProps = {
  //   style: { width: "100%" },
  //   config: { config },
  //   message: { message }
  // };
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
                      message={message}
                      onConfigChange={onConfigChange}
                      style={{ width: "100%" }} />
        )
      }
      {
        config.selectedTab === "position" && (
          <PositionConfig config={config}
                          message={message}
                          onConfigChange={onConfigChange}
                          style={{ width: "100%" }} />
        )
      }
      {
        config.selectedTab === "street" && (
          <StreetConfig config={config}
                        message={message}
                        onConfigChange={onConfigChange}
                        style={{ width: "100%" }} />
        )
      }
      <BasicConfig style={{ width: "100%" }}
                   config={config}
                   message={message}
                   onConfigChange={onConfigChange} />
      <AutoPlayConfig style={{ width: "100%" }}
                      config={config}
                      message={message}
                      onConfigChange={onConfigChange} />
    </div>
  );
}

export default controlPanel;
