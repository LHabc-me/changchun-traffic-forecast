import { useContext, useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react";
import AppConfig from "../AppConfig";
import MapContext from "../contexts/MapContext";
import { Vector as VectorLayer, WebGLPoints as WebGLPointsLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";

const Position = forwardRef((props, ref) => {
  const { pointSize, data, ...rest } = props;
  const map = useContext(MapContext);
  const layerRef = useRef(null);
  const reload = () => {
    if (!map) {
      return;
    }
    const features = [];
    for (let i = 0; i < data.length; i += 2) {
      features.push(new Feature({
        geometry: new Point(fromLonLat(data[i]))
      }));
    }
    layerRef.current = new WebGLPointsLayer({
      source: new VectorSource({
        features
      }),
      style: {
        "circle-fill-color": "rgb(255, 0, 0)",
        "circle-radius": Number.parseFloat(pointSize),
        "circle-opacity": 0.5
      }
    });
    // 删除之前的图层
    const layers = map.getLayers().getArray();
    for (let i = 1; i < layers.length; i++) {
      map.removeLayer(layers[i]);
    }
    // 添加新的图层
    map.addLayer(layerRef.current);
  };
  useImperativeHandle(ref, () => ({ reload }));
  useEffect(() => {
    reload();
  }, [data]);
});

export default Position;
