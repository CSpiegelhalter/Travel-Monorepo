import { Server } from "../../app";
import isSavedByUser from "./isSavedByUser";
import savePlace from "./savePlace";
import unsavePlace from "./unsavePlace";

export default function (server: Server): void {
  savePlace(server);
  unsavePlace(server);
  isSavedByUser(server);
}
