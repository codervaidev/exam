import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Received request body:", body);

    const {
      CLOUDFLARE_ACCESS_ID,
      CLOUDFLARE_BUCKET_NAME,
      CLOUDFLARE_ACCESS_KEY,
    } = process.env;

    if (
      !CLOUDFLARE_ACCESS_ID ||
      !CLOUDFLARE_BUCKET_NAME ||
      !CLOUDFLARE_ACCESS_KEY
    ) {
      console.error("Missing Cloudflare credentials");
      return {
        error: "Missing Cloudflare credentials",
      };
    }

    const S3 = new S3Client({
      region: "auto",
      endpoint:
        "https://7a066c2cd17173018126fd29309e3fe1.r2.cloudflarestorage.com",
      credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_ID,
        secretAccessKey: CLOUDFLARE_ACCESS_KEY,
      },
    });

    if (typeof body !== "object" || body === null || !body.fileName) {
      console.error("Invalid request body or missing fileName");
      return { error: "Invalid request body or missing fileName" };
    }

    const { fileName, fileSize, fileType } = body;

    if (!fileName.trim()) {
      console.error("File name cannot be empty");
      return { error: "File name cannot be empty" };
    }

    const command = new PutObjectCommand({
      Bucket: CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
      ContentLength: fileSize,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(S3, command, { expiresIn: 3600 }); // 1 hour expiration

    const imageUrl = `https://pub-d57f9ae58ef241f1a5912929a6798b61.r2.dev/${fileName}`

    return { uploadUrl, imageUrl };
  } catch (error) {
    console.error("Error generating signed URL:", error as string);
    return { error: "Error generating signed URL" };
  }
});
