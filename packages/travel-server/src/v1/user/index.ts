import { Server } from "../../app";
import create from "./create";

export default function (server: Server): void {
  create(server);
}
