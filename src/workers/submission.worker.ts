import { Worker } from "bullmq";
import { redisConnection } from "../queues/redis.connection";
import type {
  SubmissionJobData,
  SubmissionJobName,
} from "../queues/submission.queue";
import { executeSubmissionJob } from "../modules/submissions/submission.job";

export const submissionWorker = new Worker<
  SubmissionJobData,
  void,
  SubmissionJobName
>(
  "submissions",
  async (job) => {
    console.log("Processing submission job:", job.data.submissionId);

    await executeSubmissionJob(job.data.submissionId);
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);

submissionWorker.on("completed", (job) => {
  console.log(`Submission job ${job.id} completed`);
});

submissionWorker.on("failed", (job, error) => {
  console.error(`Submission job ${job?.id} failed`, error);
});
