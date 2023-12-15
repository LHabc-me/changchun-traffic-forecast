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

export { cacl_grid_number };
