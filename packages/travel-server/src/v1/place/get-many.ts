import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getManyPlaces",
    handler: async (req, res) => {
      const repositoryController = server.repositoryController;

      const service = new PlaceService(repositoryController);
      const places = await service.getMany();
      console.log(places);
      await res.send(places);
    },
  });

  return server;
}
