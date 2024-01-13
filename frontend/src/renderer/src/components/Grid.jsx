import { useContext, useEffect, useRef, useState } from "react";
import { cacl_grid_number } from "../utils";
import AppConfig from "../AppConfig";
import MapContext from "../contexts/MapContext";
import { Layer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer";
import { Feature } from "ol";
import { LineString, Polygon } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";

function Grid(props) {
  const { rectLength, data, ...rest } = props;
  const map = useContext(MapContext);
  const layerRef = useRef(null);
  const reload = () => {
    if (!map) {
      return;
    }
    const features = [];
    for (let i = 0; i < data.length; i++) {
      const { level, grid_geometry } = data[i];
      const [fromLon, fromLat, toLon, toLat] = grid_geometry;
      const feature = new Feature({
        geometry: new Polygon([[
          fromLonLat([fromLon, fromLat]),
          fromLonLat([fromLon, toLat]),
          fromLonLat([toLon, toLat]),
          fromLonLat([toLon, fromLat]),
          fromLonLat([fromLon, fromLat])
        ]])
      });
      feature.setStyle(new Style({
        fill: new Fill({
          color: AppConfig.gridColorMap[level]
        })
      }));
      features.push(feature);
    }
    layerRef.current = new VectorLayer({
      source: new VectorSource({
        features
      })
    });

    // 删除之前的图层
    const layers = map.getLayers().getArray();
    for (let i = 1; i < layers.length; i++) {
      map.removeLayer(layers[i]);
    }
    // 添加新的图层
    map.addLayer(layerRef.current);
  };

  useEffect(() => {
    reload();
  }, [data]);
}

export default Grid;
