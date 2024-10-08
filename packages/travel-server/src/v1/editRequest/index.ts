import { Server } from "../../app";
import acceptEditRequest from "./acceptEditRequest";
import create from "./create";
import declineEditRequest from "./declineEditRequest";
import getById from "./getById";
import getManyByStatus from "./getManyByStatus";

export default function (server: Server): void {
  create(server);
  getById(server);
  getManyByStatus(server);
  acceptEditRequest(server);
  declineEditRequest(server);
}
