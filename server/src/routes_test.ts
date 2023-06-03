import * as assert from "assert";
import * as httpMocks from "node-mocks-http";
import { Dummy } from "./routes";

describe("routes", function () {
  it("Dummy", function () {
    const req1 = httpMocks.createRequest({
      method: "GET",
      url: "/api/dummy",
      query: { name: "Kevin" },
    });
    const res1 = httpMocks.createResponse();
    Dummy(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getJSONData(), "Hi, Kevin");
  });
});
