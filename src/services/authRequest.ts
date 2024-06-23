import axios from "axios";

//::==>> get base url from .env
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const authRequest = async (url: string, data = {}) => {
  const payload = await axios.post(baseUrl + url, data, {
    headers: {
      Accept: "application/json",
    },
  });
  return payload.data;
};

export default authRequest;
