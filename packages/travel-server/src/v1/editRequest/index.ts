import { Server } from "../../app";
import create from "./create";
import getById from "./getById";
import getManyByStatus from "./getManyByStatus";

export default function (server: Server): void {
  create(server);
  getById(server);
  getManyByStatus(server)
}
