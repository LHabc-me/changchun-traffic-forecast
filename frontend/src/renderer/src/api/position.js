import axios from "axios";

async function get_position({ timespan }) {
  const request = {
    timespan
  };
  const response = await axios.post("/position", request);
  return response.data;
}

export default get_position;
