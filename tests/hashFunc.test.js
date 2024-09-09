const hashFunc = require("../utils/hashFunc");

describe("hashFunc", () => {
  it("should generate same output for same input", () => {
    expect(hashFunc("heydar")).toEqual(
      "2951404684105dfa3c14e44622f8846bbd1e4b056bd1d972142ad861475363da"
    );
  });

  it("should generate same output for inputs in diffrence order", () => {
    expect(
      hashFunc("one", "two", "three")
    ).toEqual(hashFunc("three", "one", "two"));
  });
});
