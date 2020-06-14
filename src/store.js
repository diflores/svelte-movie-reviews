import { writable } from "svelte/store";
import axios from "axios";
import qs from "qs";

export const userIdStored = writable(localStorage.getItem("userId") || "");
export const tokenStored = writable(localStorage.getItem("token") || "");

export function login(user) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.SVELTE_APP_API_BASE_URL}/users/login/jwt`,
      data: qs.stringify(user),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "POST"
    })
      .then(resp => {
        const token = resp.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // get current user to save it in state
        axios({
          url: `${process.env.SVELTE_APP_API_BASE_URL}/users/me`,
          method: "GET"
        })
          .then(response => {
            const userId = response.data.id;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            userIdStored.set(userId);
            tokenStored.set(token);
            resolve(resp);
          })
          .catch(error => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            reject(error);
          });
      })
      .catch(err => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        reject(err);
      });
  });
}

export function register(user) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.VUE_APP_API_BASE_URL}/users/register`,
      data: user,
      method: "POST"
    })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function logout() {
  return new Promise(resolve => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    userIdStored.set("");
    tokenStored.set("");
    delete axios.defaults.headers.common["Authorization"];
    resolve();
  });
}
