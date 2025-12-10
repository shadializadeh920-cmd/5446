export async function POST() {
  return new Response("hello", {
    status: 200,
    headers: {
      fullname: "string",
      username: "string",
      password: "string",
      system: "string",
      groupId: 0,
      description: "string",
      outboxes: [
        {
          prefixes: ["string"],
          cpId: 0,
          priority: 0,
          outboxNumber: "string",
        },
      ],
      inboxes: [
        {
          cpId: 0,
          inboxNumber: "string",
        },
      ],
    },
  });
}
