import { useContext, useEffect, useRef, useState } from "react";
import AppConfig from "../AppConfig";
import MapContext from "../contexts/MapContext";
import { Layer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";

function Street(props) {
  const { data, ...rest } = props;
  const map = useContext(MapContext);
  /*
    data的格式：[
      {
        level: number,
        street_geometry: [
          [lng, lat],
          [lng, lat],
          ...
        ],
      },
    ]
   */
  const layerRef = useRef(null);
  const reload = () => {
    if (!map) {
      return;
    }
    const features = [];
    for (let i = 0; i < data.length; i++) {
      const { level, street_geometry } = data[i];
      const feature = new Feature({
        geometry: new LineString(street_geometry.map(i => fromLonLat(i)))
      });
      feature.setStyle(new Style({
        stroke: new Stroke({
          color: AppConfig.streetColorMap[level],
          width: 2
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

export default Street;
