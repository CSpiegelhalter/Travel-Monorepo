import { Server } from "../../app";
import getMany from "./get-many";

export default function (server: Server): void {
  console.log("hey");
  getMany(server)
}
