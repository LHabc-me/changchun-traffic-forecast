import { useContext, useEffect, useRef } from "react";
import AppConfig from "../AppConfig";
import MapContext from "../contexts/MapContext";
import { Layer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer";

class WebGLLayer extends Layer {
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      style: {
        "fill-color": ["get", "color"]
      }
    });
  }
}

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
      feature.setProperties({
        color: AppConfig.gridColorMap[level]
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

export default Grid;
