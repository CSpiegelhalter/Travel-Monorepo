import { Server } from "../../app";
import hasUserBeen from "./hasUserBeen";
import saveUserHasBeen from "./saveUserHasBeen";
import unsaveUserHasBeen from "./unsaveUserHasBeen";

export default function (server: Server): void {
  hasUserBeen(server);
  saveUserHasBeen(server);
  unsaveUserHasBeen(server);
}
