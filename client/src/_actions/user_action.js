import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";



export function loginUser(dataToSubmit) {
  const request = axios
    .post("api/users/login", dataToSubmit)
    .then((res) => res.data);

  return {
    // 아래는 reducer로 보내는 것들
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post("api/users/register", dataToSubmit)
    .then((res) => res.data);

  return {
    // 아래는 reducer로 보내는 것들
    type: REGISTER_USER,
    payload: request,
  };
}

//get method이므로 body 필요 X
export function auth() {
  const request = axios
    .get("api/users/auth")
    .then((res) => res.data);

  return {
    // 아래는 reducer로 보내는 것들
    type: AUTH_USER,
    payload: request,
  };
}
