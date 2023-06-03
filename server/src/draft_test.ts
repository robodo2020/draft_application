import { makeSimpleDraft } from "./draft";
import * as assert from "assert";

// write it as ADT to test it
it("toList", function () {
  const curDrafter = "";
  const rounds = 0;
  const options = "";
  const drafters = "";
  const simpleDraft = makeSimpleDraft(curDrafter, rounds, options, drafters);

  assert.deepEqual(simpleDraft.toList(""), []);
  assert.deepEqual(simpleDraft.toList("   "), []);

  assert.deepEqual(simpleDraft.toList("a"), ["a"]);
  assert.deepEqual(simpleDraft.toList("list"), ["list"]);

  assert.deepEqual(simpleDraft.toList("row   "), ["row"]);
  assert.deepEqual(simpleDraft.toList("     column"), ["column"]);

  assert.deepEqual(simpleDraft.toList("a\nb\n"), ["a", "b"]);
  assert.deepEqual(simpleDraft.toList("apple\nbird\n"), ["apple", "bird"]);
  assert.deepEqual(simpleDraft.toList("     cat   \n elephant   \n"), [
    "cat",
    "elephant",
  ]);

  assert.deepEqual(simpleDraft.toList("purple\n blue  \n white\n   "), [
    "purple",
    "blue",
    "white",
  ]);
  assert.deepEqual(simpleDraft.toList("purple\nblue\n white\n"), [
    "purple",
    "blue",
    "white",
  ]);
  assert.deepEqual(
    simpleDraft.toList("   black\npink   \ncolorful\nhowdy\n hello     "),
    ["black", "pink", "colorful", "howdy", "hello"]
  );

  assert.deepEqual(
    simpleDraft.toList("   black\n   \ncolorful\nhowdy\n hello     "),
    ["black", "colorful", "howdy", "hello"]
  );
});

it("countOptions", function () {});

it("makeOptionsMap", function () {});

it("makeDraftersList", function () {});

it("addDraft", function () {});
