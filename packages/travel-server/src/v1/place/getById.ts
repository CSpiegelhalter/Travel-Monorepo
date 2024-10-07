import { SavedPlaceService } from "app-db";
import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  id: string; // The 'id' query parameter should be a string
  userId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getPlaceById",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const { id, userId } = req.query;
      console.log("Here be the user id:");
      console.log(userId);
      const repositoryController = server.repositoryController;

      try {
        const place = await getPlace({
          placeId: id,
          userId,
          repo: repositoryController,
        });
        if (place) {
          return res.send(place);
        } else {
          return res.status(404).send({ message: "Place not found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}

const getPlace = async ({ placeId, userId, repo }) => {
  const placeService = new PlaceService(repo);
  const savedPlaceService = new SavedPlaceService(repo);

  if (userId) {
    const [isSavedByUser, place] = await Promise.all([
      savedPlaceService.isPlaceSavedByUser(userId, placeId),
      placeService.getById(placeId),
    ]);
    (place as any).isSaved = isSavedByUser;
    return place;
  } else {
    const place = await placeService.getById(placeId);
    return place;
  }
};
