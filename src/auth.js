import { writable } from "svelte/store";
import axios from "axios";
import qs from "qs";

export const userIdStored = writable(localStorage.getItem("userId") || "");
export const tokenStored = writable(localStorage.getItem("token") || "");