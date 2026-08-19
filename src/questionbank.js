export const QUESTION_BANK = [
  // arrays & strings
  { id: "arr1", topic: "arrays", phase: "fundamentals", difficulty: 1, question: "What is the time complexity of accessing an element in an array versus a linked list, and why?" },
  { id: "arr2", topic: "arrays", phase: "fundamentals", difficulty: 2, question: "How would you find the duplicate number in an array of n integers where each is between 1 and n-1?" },
  { id: "arr3", topic: "arrays", phase: "fundamentals", difficulty: 3, question: "Explain how you'd find the maximum subarray sum in O(n) time." },
  { id: "arr4", topic: "arrays", phase: "fundamentals", difficulty: 2, question: "How would you rotate an array by k positions in place?" },
  { id: "arr5", topic: "arrays", phase: "fundamentals", difficulty: 4, question: "How would you merge two sorted arrays without using extra space?" },
  { id: "str1", topic: "strings", phase: "fundamentals", difficulty: 2, question: "How would you check if two strings are anagrams of each other?" },
  { id: "str2", topic: "strings", phase: "fundamentals", difficulty: 3, question: "How would you find the longest substring without repeating characters?" },
  { id: "str3", topic: "strings", phase: "fundamentals", difficulty: 1, question: "How would you reverse a string, and what's the time and space complexity of your approach?" },
  { id: "str4", topic: "strings", phase: "fundamentals", difficulty: 3, question: "How would you check if a string is a valid palindrome, ignoring case and punctuation?" },

  // linked lists, stacks, queues
  { id: "ll1", topic: "linked lists", phase: "fundamentals", difficulty: 2, question: "How do you detect a cycle in a linked list?" },
  { id: "ll2", topic: "linked lists", phase: "fundamentals", difficulty: 3, question: "How would you reverse a linked list, both iteratively and recursively?" },
  { id: "ll3", topic: "linked lists", phase: "fundamentals", difficulty: 3, question: "How would you find the middle of a linked list in a single pass?" },
  { id: "sq1", topic: "stacks and queues", phase: "fundamentals", difficulty: 2, question: "How would you implement a queue using two stacks?" },
  { id: "sq2", topic: "stacks and queues", phase: "fundamentals", difficulty: 2, question: "How would you check if a string of brackets is balanced?" },

  // trees & graphs
  { id: "tree1", topic: "trees", phase: "fundamentals", difficulty: 2, question: "What's the difference between a binary tree and a binary search tree?" },
  { id: "tree2", topic: "trees", phase: "fundamentals", difficulty: 3, question: "How would you check if a binary tree is height-balanced?" },
  { id: "tree3", topic: "trees", phase: "fundamentals", difficulty: 4, question: "Explain how you'd serialize and deserialize a binary tree." },
  { id: "tree4", topic: "trees", phase: "fundamentals", difficulty: 2, question: "What's the difference between in-order, pre-order, and post-order traversal?" },
  { id: "tree5", topic: "trees", phase: "fundamentals", difficulty: 3, question: "How would you find the lowest common ancestor of two nodes in a binary tree?" },
  { id: "graph1", topic: "graphs", phase: "fundamentals", difficulty: 3, question: "What's the difference between BFS and DFS, and when would you use one over the other?" },
  { id: "graph2", topic: "graphs", phase: "fundamentals", difficulty: 4, question: "How does Dijkstra's algorithm work, and what's its time complexity?" },
  { id: "graph3", topic: "graphs", phase: "fundamentals", difficulty: 3, question: "How would you detect a cycle in a directed graph?" },
  { id: "graph4", topic: "graphs", phase: "fundamentals", difficulty: 4, question: "Can you explain topological sorting and when it's used?" },

  // hashing, sorting, recursion, DP
  { id: "hash1", topic: "hashing", phase: "fundamentals", difficulty: 2, question: "How does a hash map handle collisions?" },
  { id: "hash2", topic: "hashing", phase: "fundamentals", difficulty: 2, question: "What makes a good hash function, and why does it matter for performance?" },
  { id: "sort1", topic: "sorting", phase: "fundamentals", difficulty: 2, question: "Can you compare the time complexity and stability of merge sort versus quicksort?" },
  { id: "sort2", topic: "sorting", phase: "fundamentals", difficulty: 3, question: "How would you sort an array of zeros, ones, and twos in a single pass?" },
  { id: "rec1", topic: "recursion", phase: "fundamentals", difficulty: 2, question: "What's the difference between recursion and iteration, and when might recursion cause problems in practice?" },
  { id: "bt1", topic: "backtracking", phase: "fundamentals", difficulty: 4, question: "How would you generate all permutations of a given array?" },
  { id: "dp1", topic: "dynamic programming", phase: "fundamentals", difficulty: 4, question: "How would you approach a dynamic programming problem — what makes a problem a good fit for DP?" },
  { id: "dp2", topic: "dynamic programming", phase: "fundamentals", difficulty: 5, question: "Explain the difference between memoization and tabulation, with an example." },
  { id: "dp3", topic: "dynamic programming", phase: "fundamentals", difficulty: 4, question: "How would you solve the classic coin change problem, and what's its time complexity?" },

  // complexity & OOP
  { id: "bo1", topic: "complexity", phase: "fundamentals", difficulty: 1, question: "Can you explain what Big-O notation actually measures?" },
  { id: "bo2", topic: "complexity", phase: "fundamentals", difficulty: 2, question: "What's the difference between time complexity and space complexity? Give an example of a trade-off between them." },
  { id: "oop1", topic: "oop", phase: "fundamentals", difficulty: 1, question: "Can you explain the four pillars of object-oriented programming?" },
  { id: "oop2", topic: "oop", phase: "fundamentals", difficulty: 2, question: "What's the difference between method overloading and method overriding?" },
  { id: "oop3", topic: "oop", phase: "fundamentals", difficulty: 3, question: "When would you favor composition over inheritance?" },
  { id: "oop4", topic: "oop", phase: "fundamentals", difficulty: 2, question: "What's the difference between an abstract class and an interface?" },
  { id: "oop5", topic: "oop", phase: "fundamentals", difficulty: 3, question: "Can you explain what polymorphism actually means, with a concrete example?" },

  // databases
  { id: "db1", topic: "databases", phase: "fundamentals", difficulty: 2, question: "What's the difference between SQL and NoSQL databases, and when would you choose one over the other?" },
  { id: "db2", topic: "databases", phase: "fundamentals", difficulty: 3, question: "Can you explain database normalization and why it matters?" },
  { id: "db3", topic: "databases", phase: "fundamentals", difficulty: 3, question: "What's the difference between a primary key, a unique key, and a foreign key?" },
  { id: "db4", topic: "databases", phase: "fundamentals", difficulty: 4, question: "How does indexing improve query performance, and what's the trade-off?" },
  { id: "db5", topic: "databases", phase: "fundamentals", difficulty: 3, question: "What's the difference between an INNER JOIN and a LEFT JOIN?" },
  { id: "db6", topic: "databases", phase: "fundamentals", difficulty: 4, question: "Can you explain the ACID properties of a database transaction?" },

  // OS & networking
  { id: "os1", topic: "operating systems", phase: "fundamentals", difficulty: 2, question: "What's the difference between a process and a thread?" },
  { id: "os2", topic: "operating systems", phase: "fundamentals", difficulty: 3, question: "Can you explain what a deadlock is and one way to prevent it?" },
  { id: "os3", topic: "operating systems", phase: "fundamentals", difficulty: 3, question: "What's the difference between paging and segmentation in memory management?" },
  { id: "os4", topic: "operating systems", phase: "fundamentals", difficulty: 2, question: "What's a race condition, and how would you prevent one?" },
  { id: "net1", topic: "networking", phase: "fundamentals", difficulty: 2, question: "What happens, step by step, when you type a URL into a browser and hit enter?" },
  { id: "net2", topic: "networking", phase: "fundamentals", difficulty: 2, question: "What's the difference between TCP and UDP?" },
  { id: "net3", topic: "networking", phase: "fundamentals", difficulty: 3, question: "Can you explain the difference between REST and GraphQL APIs?" },
  { id: "net4", topic: "networking", phase: "fundamentals", difficulty: 3, question: "What's the difference between HTTP and HTTPS, and how does the handshake work?" },
  { id: "net5", topic: "networking", phase: "fundamentals", difficulty: 2, question: "What's the difference between the OSI model and TCP/IP model, at a high level?" },

  // design & open-ended
  { id: "des1", topic: "system design", phase: "design", difficulty: 2, question: "How would you design a URL shortener like bit.ly?" },
  { id: "des2", topic: "system design", phase: "design", difficulty: 3, question: "How would you design a rate limiter for an API?" },
  { id: "des3", topic: "system design", phase: "design", difficulty: 3, question: "If a website's database is the bottleneck under heavy load, what are your options to scale it?" },
  { id: "des4", topic: "system design", phase: "design", difficulty: 4, question: "How would you design a notification system that supports email, SMS, and push notifications?" },
  { id: "des5", topic: "system design", phase: "design", difficulty: 4, question: "How would you design the backend for a chat application like WhatsApp?" },
  { id: "des6", topic: "system design", phase: "design", difficulty: 5, question: "How would you design a system to detect and prevent duplicate payments in a distributed system?" },
  { id: "des7", topic: "system design", phase: "design", difficulty: 3, question: "How would you design a simple parking lot system — what classes and relationships would you define?" },
  { id: "des8", topic: "system design", phase: "design", difficulty: 4, question: "How would you design an autocomplete or typeahead search feature?" },
  { id: "des9", topic: "system design", phase: "design", difficulty: 3, question: "What's the difference between horizontal and vertical scaling, and when would you choose each?" },
  { id: "des10", topic: "system design", phase: "design", difficulty: 4, question: "How would you design a caching layer for a read-heavy application, and what eviction policy would you use?" },
  { id: "debug1", topic: "debugging", phase: "design", difficulty: 3, question: "Your API's response time suddenly doubled in production. Walk me through how you'd investigate." },
  { id: "debug2", topic: "debugging", phase: "design", difficulty: 4, question: "A service that was working fine starts throwing intermittent 500 errors under load. How do you debug this?" },
];

export function pickQuestion(phase, difficulty, askedIds = []) {
  const candidates = QUESTION_BANK.filter(
    (q) => q.phase === phase && !askedIds.includes(q.id)
  );
  if (candidates.length === 0) return null;

  let minDiff = Infinity;
  for (const q of candidates) {
    const d = Math.abs(q.difficulty - difficulty);
    if (d < minDiff) minDiff = d;
  }
  const closest = candidates.filter((q) => Math.abs(q.difficulty - difficulty) === minDiff);
  return closest[Math.floor(Math.random() * closest.length)];
}