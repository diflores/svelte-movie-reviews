import { writable } from "svelte/store";
import axios from "axios";
import qs from "qs";

export const userIdStored = writable(null);
export const tokenStored = writable(null);