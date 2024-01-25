import AppConfig from "../AppConfig";

function Row(props) {
  const { text, color } = props;
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      gap: 15
    }}>
      <div>{text}</div>
      <div style={{
        width: "30px",
        height: "15px",
        backgroundColor: color
      }}></div>
    </div>
  );
}

function Legend(props) {
  const { type, ...rest } = props;
  let colorMap = {};
  if (type === "street") {
    colorMap = AppConfig.streetColorMap;
  } else if (type === "grid") {
    colorMap = AppConfig.gridColorMap;
  }
  return (
    <div {...rest}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10
      }}>
        <div style={{
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          图例
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          gap: 5
        }}>
          <Row text="严重拥堵" color={colorMap[1]} type={type} />
          <Row text="较拥堵" color={colorMap[2]} type={type} />
          <Row text="严重拥堵" color={colorMap[3]} type={type} />
          <Row text="轻度拥堵" color={colorMap[4]} type={type} />
          <Row text="通畅" color={colorMap[5]} type={type} />
        </div>
      </div>
    </div>
  );
}

export default Legend;
