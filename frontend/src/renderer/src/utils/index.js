import _ from "lodash";

function cacl_grid_number(lon, lat, fromPoint, toPoint, rectWidth, rectHeight) {
  const lngperm = 0.00001141;
  const latperm = 0.00000899;
  // 计算经度方向网格数量
  const lngGridCnt = Math.ceil((toPoint[0] - fromPoint[0]) / (rectWidth * lngperm));
  // 计算纬度方向网格数量
  const latGridCnt = Math.ceil((toPoint[1] - fromPoint[1]) / (rectHeight * latperm));

  // 计算所在网格编号
  const lngGridNumber = Math.ceil((lon - fromPoint[0]) / (rectWidth * lngperm));
  const latGridNumber = Math.ceil((lat - fromPoint[1]) / (rectHeight * latperm));

  return (latGridNumber - 1) * lngGridCnt + lngGridNumber;
}

function setObject(obj, key, value) {
  const newObj = _.cloneDeep(obj);

  const keys = key.split("."); // 将 key 拆分为路径数组
  let currentObj = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];

    if (!currentObj[currentKey]) {
      currentObj[currentKey] = {}; // 如果路径上的对象不存在，创建一个空对象
    }

    currentObj = currentObj[currentKey]; // 更新当前对象为路径上的对象
  }

  const lastKey = keys[keys.length - 1];
  currentObj[lastKey] = value; // 设置最终路径上的值

  return newObj;
}

export { cacl_grid_number, setObject };
