import { Server } from "../../app";
import { FastifyRequest, FastifyReply } from "fastify";
import { S3 } from "aws-sdk";

interface UploadImageRequestBody {
  fileName: string;
  fileType: string;
}

export default function (server: Server): Server {
  server.route({
    method: "POST",
    url: "/v1/uploadImage",
    handler: async (
      req: FastifyRequest<{ Body: UploadImageRequestBody }>,
      res: FastifyReply
    ) => {
      const { fileName, fileType } = req.body;
      const s3 = new S3();
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName, // The file name that will be stored in the S3 bucket
        Expires: 60, // Signed URL expiration time in seconds
        ContentType: fileType, // MIME type of the file (e.g., 'image/jpeg')
      };

      try {
        // Generate the signed URL
        const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

        // Construct the public URL that will serve the image
        const publicURL = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

        return res.send({ uploadURL, publicURL });
      } catch (e) {
        return res.send({ error: `Error generating signed URL: ${e}` });
      }
    },
  });

  return server;
}
