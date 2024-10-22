import { CategoryService } from "app-db";
import { Server } from "../../app";
import { PlaceService } from "app-db/dist/services/PlaceService";
import { FastifyRequest, FastifyReply } from "fastify";

interface Query {
  neLongitude: string; // Northeast longitude
  neLatitude: string; // Northeast latitude
  swLongitude: string; // Southwest longitude
  swLatitude: string; // Southwest latitude
  page?: string;
  pageSize?: string;
  category?: string; // Keeping just one for now
}

export default function (server: Server): Server {
  server.route({
    method: "GET",
    url: "/v1/getPlacesWithinBounds",
    handler: async (
      req: FastifyRequest<{ Querystring: Query }>,
      res: FastifyReply
    ) => {
      const {
        neLongitude,
        neLatitude,
        swLongitude,
        swLatitude,
        page,
        pageSize,
        category,
      } = req.query;

      const repositoryController = server.repositoryController;

      try {
        const categoryService = new CategoryService(repositoryController);
        const placeService = new PlaceService(repositoryController);
        console.log('CATTTT: ')
        console.log(category)
        const categoryEntity = await categoryService.getByName(category);
        console.log(categoryEntity)
        const places = await placeService.getWithinBounds({
          neLongitude: parseFloat(neLongitude),
          neLatitude: parseFloat(neLatitude),
          swLongitude: parseFloat(swLongitude),
          swLatitude: parseFloat(swLatitude),
          page: page ? parseInt(page) : 1,
          pageSize: pageSize ? parseInt(pageSize) : 16,
          category: categoryEntity ? categoryEntity : null,
        });
        if (places) {
          return res.send(places);
        } else {
          return res
            .status(404)
            .send({ message: "No places within the bounds found" });
        }
      } catch (e) {
        return res.status(500).send({ error: `An error occurred: ${e}` });
      }
    },
  });

  return server;
}
