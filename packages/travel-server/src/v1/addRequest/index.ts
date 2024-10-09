import { Server } from "../../app";
import acceptAddRequest from "./acceptAddRequest";
import create from "./create";
import declineAddRequest from "./declineAddRequest";
import getAllAddRequestsByStatus from "./getAllAddRequestsByStatus";
import getById from "./getById";

export default function (server: Server): void {
  create(server);
  declineAddRequest(server)
  acceptAddRequest(server)
  getById(server)
  getAllAddRequestsByStatus(server)
}
