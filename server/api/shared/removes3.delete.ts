import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default defineEventHandler(async (event) => {
  await validateRequest(event);

  try {
    const body = await readBody(event);

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

    if (typeof body !== "object" || body === null || !body.url) {
      console.error("Invalid request body or missing URL");
      return { error: "Invalid request body or missing URL" };
    }

    const { url } = body;

    const fileName = url
      .replace("https://pub-d57f9ae58ef241f1a5912929a6798b61.r2.dev/", "")
      .replace("https://storage.rhombuspublications.com/", "");

    if (!fileName || !fileName.trim()) {
      console.error("File name cannot be determined from the URL");
      return { error: "File name cannot be determined from the URL" };
    }

    const command = new DeleteObjectCommand({
      Bucket: CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
    });

    await S3.send(command);
    console.log(`File deleted successfully: ${fileName}`);
    return { message: `File deleted successfully: ${fileName}` };
  } catch (error) {
    console.error("Error deleting file:", error as string);
    return { error: "Error deleting file" };
  }
});
