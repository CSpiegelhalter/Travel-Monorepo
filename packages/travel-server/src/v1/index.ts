import { Server } from "../app";
import addRequest from "./addRequest";
import category from "./category";
import editRequest from "./editRequest";
import place from "./place";
import savedPlace from "./savedPlace";
import user from "./user";

export default function (server: Server): void {
  place(server);
  user(server);
  editRequest(server);
  savedPlace(server);
  category(server);
  addRequest(server);
}
