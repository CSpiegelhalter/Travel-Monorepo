import {
  PlaceService,
  UserService,
  ImageService,
  AddRequestService,
  CategoryService,
  Category,
} from "app-db";
import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreatePlaceDto } from "app-db/src/dto";

interface PlaceData {
  name: string;
  city?: string;
  state?: string;
  country: string;
  address: string;
  website?: string;
  short_description: string;
  long_description: string;
  latitude: string;
  longitude: string;
  images: string[];
  categories: string[];
  newCategory?: string;
}

interface UserRequestBody {
  userId: string;
  addRequestId: string;
  placeData: PlaceData;
  additionalComments: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/acceptAddRequest",
    handler: async (
      req: FastifyRequest<{ Body: UserRequestBody }>,
      res: FastifyReply
    ) => {
      const repositoryController = server.repositoryController;
      const { placeData, addRequestId, userId, additionalComments } = req.body;
      const addRequestService = new AddRequestService(repositoryController);
      const placeService = new PlaceService(repositoryController);
      const userService = new UserService(repositoryController);
      const imageService = new ImageService(repositoryController);
      const categoryService = new CategoryService(repositoryController);
      const [user, addRequest] = await Promise.all([
        userService.getById(userId),
        addRequestService.getById(addRequestId),
      ]);

      if (!addRequest) {
        const error = "Add request not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (!user) {
        const error = "User not found";
        console.log(error);
        return res.status(404).send({ error });
      }
      if (user.role !== "admin") {
        const error = "User not an admin";
        console.log(error);
        return res.status(403).send({ error });
      }

      const { images, categories, latitude, longitude, newCategory, ...basePlace } =
        placeData as PlaceData;
        const allCategories: Category[] = []
        if (newCategory) {
            console.log('heres your new cats:')
            console.log(newCategory)
          const newCats = newCategory.split(",");
          console.log(newCats);
          for (const cat of newCats) {
            console.log(cat);
            const createdCat = await categoryService.create(cat.trim());
            allCategories.push(createdCat)
          }
        }
        if (categories?.length) {
            for (const cat of categories) {
              const existingCat = await categoryService.getByName(cat);
              allCategories.push(existingCat);
            } 
        }
        const placeCreate: CreatePlaceDto = { ...basePlace, latitude: Number(latitude), longitude: Number(longitude), categories: allCategories};
      const place = await placeService.create(placeCreate, user);


      console.log("wtffff");
      console.log(basePlace);

      if (images) {
        for (const imageUrl of images) {
          await imageService.create({ src: imageUrl, place });
        }
      }

      const updatedAddRequest = await addRequestService.update({
        id: addRequestId,
        status: "accepted",
        placeData,
        place,
      });

      // TODO: Send an email notification
      const message = "Add request accepted successfully";
      console.log(message);
      return res
        .status(200)
        .send({ message, updatedAddRequest, place, status: 200 });
    },
  });

  return server;
}
