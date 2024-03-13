import ReactECharts from "echarts-for-react";

function Charts(props) {
  const { option, ...rest } = props;
  return (
    <div {...rest}>
      {
        option?.series?.length && (
          <ReactECharts style={{
            marginTop: 20,
            width: "100%",
            height: "100%"
          }}
                        option={option}
                        notMerge={true} />
        )
      }
    </div>
  );
}

export default Charts;

