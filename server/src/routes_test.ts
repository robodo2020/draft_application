import * as assert from "assert";
import * as httpMocks from "node-mocks-http";
import { Dummy, loadExistDrafts, addDraft } from "./routes";
// import { Dummy, addDraft } from "./routes";
// import { countDraft, makeSimpleDraft } from "./draft";

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

  it("end-to-end", function () {
    const req1 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      query: {
        curDrafterName: "ab",
        rounds: "2",
        options: "a\nb\nc\nd",
        drafters: "ab\nbc\ncd\nde",
      },
    });
    const res1 = httpMocks.createResponse();
    addDraft(req1, res1);

    // const map1 = makeSimpleDraft("", 1, "", "");
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {
      draftId: 0,
      pickedOptions: [],
      rounds: 2,
      drafters: ["ab", "bc", "cd", "de"],
      allOptions: ["a", "b", "c", "d"],
    });

    const req2 = httpMocks.createRequest({
      method: "GET",
      url: "/api/load",
      query: {
        curDrafterName: "bc",
        draftId: "0",
      },
    });
    const res2 = httpMocks.createResponse();

    loadExistDrafts(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    const data2 = res2._getData();
    assert.deepStrictEqual(data2, {
      draftId: 0,
      pickedOptions: [],
      rounds: 2,
      drafters: ["ab", "bc", "cd", "de"],
      allOptions: ["a", "b", "c", "d"],
    });
  });
});
