import { Button, Input, Slider } from "@fluentui/react-components";

function controlPanel(props) {
  const { config, onConfigChange, onConfirm, ...rest } = props;
  const { rectLength } = config;
  return (
    <div>
      <Slider min={100}
              max={1000}
              defaultValue={500}
              value={rectLength}
              onChange={(_, data) => {
                onConfigChange({
                  ...config,
                  rectLength: data.value
                });
              }} />
      <div>
        栅格长度：
        <Input value={rectLength}
               onChange={(_, data) => {
                 onConfigChange({
                   ...config,
                   rectLength: data.value
                 });
               }} />
        米
      </div>
      <Button onClick={onConfirm}>刷新</Button>
    </div>
  );
}

export default controlPanel;
