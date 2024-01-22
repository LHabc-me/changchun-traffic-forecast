import axios from "axios";

async function get_street({ timespan, split }) {
  const request = {
    timespan,
    split
  };
  const response = await axios.post("/street", request);
  return response.data;
}

export default get_street;
