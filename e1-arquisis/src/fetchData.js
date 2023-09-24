import { API, Auth } from "aws-amplify";

async function getAuthToAPI() {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const headers = {
    accessToken: token,
    Authorization: user.username,
  };

  return headers;
}

async function callApi(url, method = "GET", isProtected = true, body = null) {

  const headers = isProtected ? await getAuthToAPI() : {};

  if (method === "GET") {
    const data = await API.get("stocks", url, { headers });
    return data;
  } else if (method === "POST") {
    const data = await API.post("stocks", url, { headers, body });
    return data;
  } else if (method === "PUT") {
    const data = await API.put("stocks", url, { headers, body });
    return data;
  } else if (method === "DELETE") {
    const data = await API.del("stocks", url, { headers });
    return data;
  }
}

export default callApi;
