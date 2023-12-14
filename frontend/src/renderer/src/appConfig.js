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
  }
};

axios.defaults.baseURL = AppConfig.apiBaseUrl;
axios.defaults.headers.post["Content-Type"] = "application/json";

export default AppConfig;
