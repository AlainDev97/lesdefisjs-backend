import { Queue } from "bullmq";
import { redisConnection } from "./redis.connection";

export type SubmissionJobName = "run-submission";

export type SubmissionJobData = {
  submissionId: string;
};

export const submissionQueue = new Queue<
  SubmissionJobData,
  void,
  SubmissionJobName
>("submissions", {
  connection: redisConnection,
});
