import axios from "axios";

async function get_charts_option({ timespan, type }) {
  const request = {
    type: type,
    timespan: timespan
  };
  const response = await axios.post("/charts", request);
  return response.data;
}

export default get_charts_option;
