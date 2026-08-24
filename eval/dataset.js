// Hand-labeled sample answers used to measure whether the assessment
// logic ("strong" / "partial" / "weak") tracks real answer quality.
// Labels are the ground truth a human would assign.

export const EVAL_CASES = [
  {
    question: "What is the time complexity of accessing an element in an array versus a linked list, and why?",
    answer: "Array access is O(1) because you can jump straight to an index using pointer arithmetic. Linked list access is O(n) because you have to walk from the head node until you reach the one you want.",
    expected: "strong",
  },
  {
    question: "What is the time complexity of accessing an element in an array versus a linked list, and why?",
    answer: "Array is faster I think, linked list is slower.",
    expected: "weak",
  },
  {
    question: "What is the time complexity of accessing an element in an array versus a linked list, and why?",
    answer: "Array access is O(1) and linked list is slower because you have to go through the list.",
    expected: "partial",
  },
  {
    question: "What's the difference between a process and a thread?",
    answer: "A process is an independent program with its own memory space, while a thread is a lightweight unit of execution within a process that shares memory with other threads in the same process.",
    expected: "strong",
  },
  {
    question: "What's the difference between a process and a thread?",
    answer: "A thread is smaller than a process.",
    expected: "weak",
  },
  {
    question: "What's the difference between a process and a thread?",
    answer: "Process is like a program running, thread is a part of it that shares memory.",
    expected: "partial",
  },
  {
    question: "How does a hash map handle collisions?",
    answer: "The two common approaches are chaining, where each bucket holds a linked list of entries that hash to the same index, and open addressing, where you probe for the next empty slot using a strategy like linear or quadratic probing.",
    expected: "strong",
  },
  {
    question: "How does a hash map handle collisions?",
    answer: "It just handles it automatically.",
    expected: "weak",
  },
  {
    question: "How does a hash map handle collisions?",
    answer: "It stores multiple things in the same bucket somehow.",
    expected: "partial",
  },
  {
    question: "What's the difference between SQL and NoSQL databases, and when would you choose one over the other?",
    answer: "SQL databases are relational with fixed schemas and strong ACID guarantees, good for structured data with complex relationships. NoSQL databases like MongoDB are schema-flexible and scale horizontally more easily, better for unstructured or rapidly evolving data.",
    expected: "strong",
  },
  {
    question: "What's the difference between SQL and NoSQL databases, and when would you choose one over the other?",
    answer: "SQL uses tables, NoSQL doesn't.",
    expected: "weak",
  },
  {
    question: "Can you explain what a deadlock is and one way to prevent it?",
    answer: "A deadlock happens when two or more processes are each waiting for a resource held by the other, so neither can proceed. One way to prevent it is to always acquire locks in a fixed global order across all processes.",
    expected: "strong",
  },
  {
    question: "Can you explain what a deadlock is and one way to prevent it?",
    answer: "I'm not really sure, maybe when things get stuck?",
    expected: "weak",
  },
  {
    question: "How would you design a rate limiter for an API?",
    answer: "I'd use a token bucket algorithm — each client gets a bucket that refills at a fixed rate, and each request consumes a token. If the bucket's empty, the request is rejected or queued. I'd store bucket state in Redis so it works across multiple server instances.",
    expected: "strong",
  },
  {
    question: "How would you design a rate limiter for an API?",
    answer: "You could just count how many requests come in and block after a certain number.",
    expected: "partial",
  },
  {
    question: "What's the difference between TCP and UDP?",
    answer: "TCP is connection-oriented and guarantees ordered, reliable delivery through acknowledgments and retransmission, at the cost of overhead. UDP is connectionless with no delivery guarantees, but has lower latency, which is why it's used for things like video streaming.",
    expected: "strong",
  },
  {
    question: "What's the difference between TCP and UDP?",
    answer: "One is more reliable than the other.",
    expected: "weak",
  },
];