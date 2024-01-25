import axios from "axios";

const AppConfig = {
  apiBaseUrl: "http://localhost:8000/api",
  tileMap: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    // zoom: {
    //   min: 1,
    //   max: 19
    // }
  },
  gridColorMap: {
    5: "rgba(0, 255, 0, 0.3)",
    4: "rgba(255, 255, 0, 0.3)",
    3: "rgba(255, 128, 0, 0.3)",
    2: "rgba(255, 0, 0, 0.3)",
    1: "rgba(128, 0, 0, 0.3)"
  },
  streetColorMap: {
    5: "rgba(0, 255, 0, 1)",
    4: "rgba(255, 255, 0, 1)",
    3: "rgba(255, 128, 0, 1)",
    2: "rgba(255, 0, 0, 1)",
    1: "rgba(128, 0, 0, 1)"
  },
  position: {
    color: "rgb(255, 0, 0)",
    opacity: 0.5
  }
};

axios.defaults.baseURL = AppConfig.apiBaseUrl;
axios.defaults.headers.post["Content-Type"] = "application/json";

export default AppConfig;
