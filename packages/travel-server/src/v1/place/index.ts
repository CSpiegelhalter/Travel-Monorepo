import { Server } from "../../app";
import getMany from "./get-many";
import getById from "./getById";
import uploadImage from "./uploadImage";

export default function (server: Server): void {
  getMany(server);
  getById(server);
  uploadImage(server);
}
