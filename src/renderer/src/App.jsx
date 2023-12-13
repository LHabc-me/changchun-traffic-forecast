import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  useEffect(() => {
    const map = L.map("map").setView([43.88, 125.35], 13);
    //吉林省 经度121.638964~131.309886	纬度40.864207~46.302152
    /*
      标准地图：https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
     */
    // L.tileLayer("http://localhost:3000/{z}/{x}/{y}.png", {
    //   maxZoom: 13
    // }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.marker([43.88, 125.35]).addTo(map);
    // 点击地图时添加标记，同一时间只能有一个标记
    map.on("click", (e) => {
      // 清除所有标记
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      // 添加标记
      L.marker(e.latlng).addTo(map);
    });

    // 去除水印
    document.querySelector("#map > div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div")
      .style.display = "none";
  });
  return (
    <div style={{
      height: "100vh"
    }}>
      <div id="map"
           style={{
             height: "100%"
           }}></div>
    </div>
  );
}

export default App;
