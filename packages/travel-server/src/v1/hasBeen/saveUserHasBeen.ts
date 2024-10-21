import { HasBeenService, PlaceService, UserService } from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";

interface UserRequestBody {
  userId: string;
  placeId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/saveUserHasBeen",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { placeId, userId } = req.body;
      console.log(`Recieved save place for user: ${userId}, place: ${placeId}`);
      const placeService = new PlaceService(repositoryController);
      const userService = new UserService(repositoryController);
      const hasBeenService = new HasBeenService(repositoryController);

      const [place, user] = await Promise.all([
        placeService.getById(placeId),
        userService.getUserHasBeenPlaces(userId),
      ]);

      if (!place) {
        const error = "Place not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (!user) {
        const error = "User not found";
        console.log(error);
        return res.status(404).send({ error });
      }

      const newlySaved = await hasBeenService.saveHasBeenForUser(user, place);

      await res.status(200).send({ ...newlySaved, status: 200 });
    },
  });

  return server;
}