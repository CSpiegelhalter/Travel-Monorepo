import { Server } from "../../app";
import create from "./create";
import deleteProfilePicture from "./deleteProfilePicture";
import getById from "./getById";
import getUserProfile from "./getUserProfile";
import saveProfilePicture from "./saveProfilePicture";

export default function (server: Server): void {
  create(server);
  getById(server);
  getUserProfile(server);
  saveProfilePicture(server);
  deleteProfilePicture(server);
}
