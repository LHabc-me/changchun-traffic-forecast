import axios from "axios";

async function get_street({ timespan }) {
  const request = {
    timespan
  };
  const response = await axios.post("/street", request);
  return response.data;
}

export default get_street;
