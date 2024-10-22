import { Server } from "../../app";
import getMany from "./get-many";
import getAddedPlaces from "./getAddedPlaces";
import getById from "./getById";
import getEditedPlaces from "./getEditedPlaces";
import getHasBeenPlaces from "./getHasBeenPlaces";
import getSavedPlaces from "./getSavedPlaces";
import getWithinBounds from "./getWithinBounds";
import getWithinRange from "./getWithinRange";
import uploadImage from "./uploadImage";

export default function (server: Server): void {
  getMany(server);
  getById(server);
  uploadImage(server);
  getEditedPlaces(server);
  getAddedPlaces(server);
  getSavedPlaces(server);
  getWithinRange(server);
  getHasBeenPlaces(server);
  getWithinBounds(server)
}
