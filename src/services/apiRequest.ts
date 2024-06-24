//::================================>>Third party<<=================================::
import axios from "axios";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { logout, saveToken } from "../utils/help";
// import { message } from "antd";
//::================================================================================::

//::==>> get base url from .env
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//::==>> start core function
async function apiRequest(
  method: string,
  url: string,
  data = {},
  retry = false,
) {
  //:: validate
  const isAccessToken = localStorage.getItem("accessToken");
  const isRefreshToken = localStorage.getItem("refreshToken");
  const isRole = localStorage.getItem("role");
  if (!isAccessToken || !isRefreshToken || !isRole) {
    return logout();
  }
  //::==>> get accessToken from localstorage for make request
  let accessToken = localStorage.getItem("accessToken");

  try {
    //::==>> create request using axios
    const response = await axios.request({
      //::==>> method for make request
      method,
      //::==>> connect baseUrl with url provided
      url: baseUrl + url,
      //::==>> get data
      data,
      headers: {
        //::==>> put token in header Bearer
        Authorization: `Bearer ${accessToken}`,
      },
    });

    //::==>> response back
    return response.data;
  } catch (error: any) {
    //::==>> if request error throw catch check status for apply refreshToken
    if (
      //::==>> if response status 401 and 403
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      //::==>> if this is the first attempt to refresh token
      if (!retry) {
        try {
          //::==>> call method refreshToken to implement
          await refreshToken();
          //::==>> make request again after restore token by refreshToken function
          return apiRequest(method, url, data, true);
        } catch (refreshError) {
          //::==>> logout from system
          logout();
        }
      } else {
        //::==>> if already tried refreshing token, logout
        logout();
      }
    } else {
      // throw new Error(error.response.data.message);
    }
  }
}

async function refreshToken() {
  try {
    //::==>> make request to get new accessToken by using refreshToken
    const newToken = await axios.post(`${baseUrl}/auth/refreshToken`, {
      //::==>> get refreshToken from localstorage
      refreshToken: localStorage.getItem("refreshToken"),
    });
    //::==>> if response Ok we store new accessToken and new refreshToken
    saveToken(newToken.data.accessToken, newToken.data.refreshToken);
  } catch (error) {
    //::==>> if throw error system will auto logout
    logout();
  }
}

export default apiRequest;
