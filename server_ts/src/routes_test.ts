import * as assert from "assert";
import * as httpMocks from "node-mocks-http";
import { Dummy, loadExistDrafts, addDraft, updateDraft } from "./routes";

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
    const reqbase = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      query: {
        curDrafterName: "x",
        rounds: "1",
        options: "z",
        drafters: "x",
      },
    });
    const resbase = httpMocks.createResponse();
    addDraft(reqbase, resbase);

    assert.strictEqual(resbase._getStatusCode(), 200);
    assert.deepStrictEqual(resbase._getData(), {
      draftId: 0,
      pickedOptions: [],
      rounds: 1,
      drafters: ["x"],
      allOptions: ["z"],
      nextPicker: "x",
    });

    const reqbase1 = httpMocks.createRequest({
      method: "GET",
      url: "/api/load",
      query: {
        curDrafterName: "x",
        draftId: "0",
      },
    });
    const resbase1 = httpMocks.createResponse();

    loadExistDrafts(reqbase1, resbase1);
    assert.strictEqual(resbase1._getStatusCode(), 200);
    const database1 = resbase1._getData();
    assert.deepStrictEqual(database1, {
      draftId: 0,
      pickedOptions: [],
      rounds: 1,
      drafters: ["x"],
      allOptions: ["z"],
      nextPicker: "x",
    });

    const reqbase2 = httpMocks.createRequest({
      method: "POST",
      url: "/api/update",
      query: {
        curPickOption: "z",
        draftId: "0",
        curDrafter: "x",
      },
    });
    const resbase2 = httpMocks.createResponse();
    updateDraft(reqbase2, resbase2);

    assert.strictEqual(resbase2._getStatusCode(), 200);
    const database2 = resbase2._getData();

    assert.deepStrictEqual(database2, {
      allOptions: [],
      pickedOption: "z",
      curDrafter: "x",
      nextPicker: "COMPLETED!!!",
    });

    const req1 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      query: {
        curDrafterName: "ab",
        rounds: "1",
        options: "a\nb\nc\nd",
        drafters: "ab\nbc\ncd\nde",
      },
    });
    const res1 = httpMocks.createResponse();
    addDraft(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {
      draftId: 1,
      pickedOptions: [],
      rounds: 1,
      drafters: ["ab", "bc", "cd", "de"],
      allOptions: ["a", "b", "c", "d"],
      nextPicker: "ab",
    });

    const req2 = httpMocks.createRequest({
      method: "GET",
      url: "/api/load",
      query: {
        curDrafterName: "bc",
        draftId: "1",
      },
    });
    const res2 = httpMocks.createResponse();

    loadExistDrafts(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    const data2 = res2._getData();
    assert.deepStrictEqual(data2, {
      draftId: 1,
      pickedOptions: [],
      rounds: 1,
      drafters: ["ab", "bc", "cd", "de"],
      allOptions: ["a", "b", "c", "d"],
      nextPicker: "ab",
    });

    const req3 = httpMocks.createRequest({
      method: "POST",
      url: "/api/update",
      query: {
        curPickOption: "b",
        draftId: "1",
        curDrafter: "ab",
      },
    });
    const res3 = httpMocks.createResponse();
    updateDraft(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    const data3 = res3._getData();

    assert.deepStrictEqual(data3, {
      allOptions: ["a", "c", "d"],
      pickedOption: "b",
      curDrafter: "ab",
      nextPicker: "bc",
    });

    const req4 = httpMocks.createRequest({
      method: "POST",
      url: "/api/add",
      query: {
        curDrafterName: "y",
        rounds: "2",
        options:
          "option1\noption2\noption3\noption4\noption5\noption6\noption7",
        drafters: "drafter1\ndrafter2\ndrafter3\n",
      },
    });
    const res4 = httpMocks.createResponse();
    addDraft(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {
      draftId: 2,
      pickedOptions: [],
      rounds: 2,
      drafters: ["drafter1", "drafter2", "drafter3"],
      allOptions: [
        "option1",
        "option2",
        "option3",
        "option4",
        "option5",
        "option6",
        "option7",
      ],
      nextPicker: "drafter1",
    });

    const req5 = httpMocks.createRequest({
      method: "POST",
      url: "/api/update",
      query: {
        curPickOption: "d",
        draftId: "1",
        curDrafter: "bc",
      },
    });
    const res5 = httpMocks.createResponse();
    updateDraft(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);
    const data5 = res5._getData();

    assert.deepStrictEqual(data5, {
      allOptions: ["a", "c"],
      pickedOption: "d",
      curDrafter: "bc",
      nextPicker: "cd",
    });

    const req6 = httpMocks.createRequest({
      method: "POST",
      url: "/api/update",
      query: {
        curPickOption: "c",
        draftId: "1",
        curDrafter: "cd",
      },
    });
    const res6 = httpMocks.createResponse();
    updateDraft(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 200);
    const data6 = res6._getData();

    assert.deepStrictEqual(data6, {
      allOptions: ["a"],
      pickedOption: "c",
      curDrafter: "cd",
      nextPicker: "de",
    });

    const req7 = httpMocks.createRequest({
      method: "POST",
      url: "/api/update",
      query: {
        curPickOption: "a",
        draftId: "1",
        curDrafter: "de",
      },
    });
    const res7 = httpMocks.createResponse();
    updateDraft(req7, res7);

    assert.strictEqual(res7._getStatusCode(), 200);
    const data7 = res7._getData();

    assert.deepStrictEqual(data7, {
      allOptions: [],
      pickedOption: "a",
      curDrafter: "de",
      nextPicker: "COMPLETED!!!",
    });
  });
});
