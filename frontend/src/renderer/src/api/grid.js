import axios from "axios";

/*
        request:
        {
            "grid": {
                "width": 10, // 网络宽度 单位：米
                "height": 10, // 网络高度 单位：米
                "from": [0, 0], // 起点经纬度
                "to": [9, 9], // 终点经纬度
            },
            "timespan": { // 时间段
               "from": "2019-01-01 00:00:00", // 起始时间
               "to": "2019-02-01 00:00:00", // 结束时间
            }
        }

        response:
        {
            "status": 200,
            "message": "success",
            "data": [ //从低经度到高经度，从低纬度到高纬度，每个栅格的拥堵指数
                1,
                1.2,
                0.2
                ....
            ]
        }
 */
async function get_grid({ grid, timespan }) {
  const request = {
    grid: grid,
    timespan: timespan
  };
  const response = await axios.post("/grid", request);
  return response.data;
}

export default get_grid;
