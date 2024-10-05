import { Server } from "../../app";
import create from "./create";
import getById from "./getById";

export default function (server: Server): void {
  create(server);
  getById(server)
}
