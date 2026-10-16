Throughout this course, the most difficult concept to grasp was handling database concurrency and race conditions during high-throughput events—specifically understanding how multiple database transactions interact when thousands of users try to update the exact same record simultaneously. I overcame this by studying row-level locking mechanisms (`FOR UPDATE`), atomic state updates, and separating read traffic from write operations.

If I could improve any part of my capstone design based on feedback and architectural best practices, I would incorporate a virtual waiting room (queue-number system) prior to the seat-selection phase. This would smooth out the traffic spike instead of letting 200,000 users slam the API endpoints concurrently in the first minute.

Next, I plan to dive deeper into cloud infrastructure orchestration (such as Kubernetes and automated horizontal auto-scaling) to see how backend services dynamically scale up and down under unpredictable workloads.
