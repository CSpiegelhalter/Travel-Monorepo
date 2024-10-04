import { Server } from "../app";
import editRequest from "./editRequest";
import place from "./place";
import user from "./user";

export default function (server: Server): void {
  place(server)
  user(server)
  editRequest(server)
}
