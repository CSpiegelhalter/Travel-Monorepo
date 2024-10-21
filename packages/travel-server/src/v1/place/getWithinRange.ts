import { CategoryService } from "app-db";
import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  longitude: string;
  latitude: string;
  rangeKm: string;
  page?: number;
  pageSize?: number;
  category?: string; // Keeping just one for now
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getPlacesWithinRange",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const { longitude, latitude, rangeKm, page, pageSize, category } =
        req.query;

      const repositoryController = server.repositoryController;

      try {
        const categoryService = new CategoryService(repositoryController);
        const placeService = new PlaceService(repositoryController);
        const categoryEntity = await categoryService.getByName(category);
        console.log('Here is the cat')
        console.log(categoryEntity)
        const places = await placeService.getWithinRange({
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
          rangeKm: rangeKm ? parseInt(rangeKm) : 100,
          page: page || 1,
          pageSize: pageSize || 16,
          category: categoryEntity ? categoryEntity : null,
        });
        if (places) {
          return res.send(places);
        } else {
          return res
            .status(404)
            .send({ message: "No places within the range found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
