describe("Server.ts tests", () => {
  test("Environment test", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });
});
