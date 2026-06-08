import { Worker } from "bullmq";
import { redisConnection } from "../queues/redis.connection";
import type {
  SubmissionJobData,
  SubmissionJobName,
} from "../queues/submission.queue";

export const submissionWorker = new Worker<
  SubmissionJobData,
  void,
  SubmissionJobName
>(
  "submissions",
  async (job) => {
    console.log("Processing submission job:", job.data.submissionId);
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);
