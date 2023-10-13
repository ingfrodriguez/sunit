import axios from "axios";
import {IpGlobal} from './funciones.js'

export default axios.create({
  baseURL: IpGlobal,
  headers: {
    "Content-type": "application/json"
  }
});