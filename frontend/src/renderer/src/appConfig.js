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
  colorMap: {
    1: "rgb(0, 255, 0)",
    2: "rgb(128, 255, 0)",
    3: "rgb(191, 255, 0)",
    4: "rgb(255, 255, 0)",
    5: "rgb(255, 191, 0)",
    6: "rgb(255, 128, 0)",
    7: "rgb(255, 64, 0)",
    8: "rgb(255, 0, 0)",
    9: "rgb(191, 0, 0)",
    10: "rgb(128, 0, 0)"
  }
};

axios.defaults.baseURL = AppConfig.apiBaseUrl;
axios.defaults.headers.post["Content-Type"] = "application/json";

export default AppConfig;
