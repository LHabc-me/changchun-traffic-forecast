import axios from "axios";

async function get_data_timespan() {
  const response = await axios.post("/data_timespan");
  return response.data;
}

export default get_data_timespan;
