import Bee from 'bee-queue';
import CancellationEmail from '../app/jobs/CancellationEmail';
import redisSettings from '../settings/redis';

const jobs = [CancellationEmail];

class Queue {
  constructor() {
    this.queue = {};
    this.Init();
  }

  Init() {
    jobs.forEach(({ key, handle }) => {
      this.queue[key] = {
        bee: new Bee(key, {
          redis: redisSettings,
        }),
        handle,
      };
    });
  }

  Add(queue, job) {
    return this.queue[queue].bee.createJob(job).save();
  }

  ProcessQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queue[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
