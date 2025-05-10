import { Client } from "@upstash/qstash";

// Initialize QStash client
const client = new Client({
  
  token: process.env.QSTASH_TOKEN!,
});

export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  const { answers, submission_id } = await readBody(event);

  if (!userId || !id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Publish to QStash
  await client.publishJSON({
    url: `${process.env.BASE_URL}/api/queues/process`,
    body: {
      submission_id,
      answers,
    },
    retries: 3,
    notBefore: 0,
    deduplicationId: submission_id, // Prevent duplicate processing
  });

  return {
    statusCode: 202,
    statusMessage: "Submission queued successfully",
  };
});
