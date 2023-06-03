import { makeCountDraft } from "./draft";
import * as assert from "assert";

// write it as ADT to test it
it("toList", function () {
  const curDrafter = "";
  const rounds = 0;
  const options = "";
  const drafters = "";
  const countDraft = makeCountDraft(curDrafter, rounds, options, drafters);

  assert.deepEqual(countDraft.toList(""), []);
  assert.deepEqual(countDraft.toList("   "), []);

  assert.deepEqual(countDraft.toList("a"), ["a"]);
  assert.deepEqual(countDraft.toList("list"), ["list"]);

  assert.deepEqual(countDraft.toList("row   "), ["row"]);
  assert.deepEqual(countDraft.toList("     column"), ["column"]);

  assert.deepEqual(countDraft.toList("a\nb\n"), ["a", "b"]);
  assert.deepEqual(countDraft.toList("apple\nbird\n"), ["apple", "bird"]);
  assert.deepEqual(countDraft.toList("     cat   \n elephant   \n"), [
    "cat",
    "elephant",
  ]);

  assert.deepEqual(countDraft.toList("purple\n blue  \n white\n   "), [
    "purple",
    "blue",
    "white",
  ]);
  assert.deepEqual(countDraft.toList("purple\nblue\n white\n"), [
    "purple",
    "blue",
    "white",
  ]);
  assert.deepEqual(
    countDraft.toList("   black\npink   \ncolorful\nhowdy\n hello     "),
    ["black", "pink", "colorful", "howdy", "hello"]
  );

  assert.deepEqual(
    countDraft.toList("   black\n   \ncolorful\nhowdy\n hello     "),
    ["black", "colorful", "howdy", "hello"]
  );
});

it("countOptions", function () {});

it("makeOptionsMap", function () {});

it("makeDraftersList", function () {});

it("addDraft", function () {});
