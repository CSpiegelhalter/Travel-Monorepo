import { SavedPlaceService } from "app-db";
import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  placeId: string;
  userId: string;
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/isSavedByUser",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const { placeId, userId } = req.query;
      
      const repositoryController = server.repositoryController;
      const savedPlaceService = new SavedPlaceService(repositoryController);
      try {
        const isSaved = await savedPlaceService.isPlaceSavedByUser(
          userId,
          placeId
        );
return res.send(isSaved);
       
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
    if (!place) {
      return place;
    }
    (place as any).isSaved = isSavedByUser;
    return place;
  } else {
    const place = await placeService.getById(placeId);
    return place;
  }
};
