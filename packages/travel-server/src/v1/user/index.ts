import { Server } from "../../app";
import create from "./create";
import getById from "./getById";
import getUserProfile from "./getUserProfile";

export default function (server: Server): void {
  create(server);
  getById(server)
  getUserProfile(server)
}
