import { useContext, useEffect, useRef } from "react";
import AppConfig from "../AppConfig";
import MapContext from "../contexts/MapContext";
import { Layer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { fromLonLat } from "ol/proj";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer";

class WebGLLayer extends Layer {
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      style: {
        "stroke-color": ["get", "color"],
        "stroke-width": ["get", "width"]
      }
    });
  }
}

function Street(props) {
  const { data, ...rest } = props;
  const map = useContext(MapContext);
  /*
    data的格式：[
      {
        level: number,
        street_geometry: [
          [lon, lat],
          [lon, lat],
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
      feature.setProperties({
        color: AppConfig.streetColorMap[level],
        width: 2
      });
      features.push(feature);
    }
    layerRef.current = new WebGLLayer({
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
