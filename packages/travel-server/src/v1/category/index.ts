import { Server } from "../../app";
import getAll from "./getAll";


export default function (server: Server): void {
  getAll(server);
}
