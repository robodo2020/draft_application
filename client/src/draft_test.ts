import * as assert from "assert";
import { toList, hasDuplicate } from "./draft";

describe("routes", function () {
  it("toList", function () {
    assert.deepEqual(toList(""), []);
    assert.deepEqual(toList("   "), []);
    assert.deepEqual(toList("a"), ["a"]);
    assert.deepEqual(toList("list"), ["list"]);
    assert.deepEqual(toList("row   "), ["row"]);
    assert.deepEqual(toList("     column"), ["column"]);
    assert.deepEqual(toList("a\nb\n"), ["a", "b"]);
    assert.deepEqual(toList("apple\nbird\n"), ["apple", "bird"]);
    assert.deepEqual(toList("     cat   \n elephant   \n"), [
      "cat",
      "elephant",
    ]);

    assert.deepEqual(toList("purple\n blue  \n white\n   "), [
      "purple",
      "blue",
      "white",
    ]);
    assert.deepEqual(toList("purple\nblue\n white\n"), [
      "purple",
      "blue",
      "white",
    ]);
    assert.deepEqual(
      toList("   black\npink   \ncolorful\nhowdy\n hello     "),
      ["black", "pink", "colorful", "howdy", "hello"]
    );

    assert.deepEqual(toList("   black\n   \ncolorful\nhowdy\n hello     "), [
      "black",
      "colorful",
      "howdy",
      "hello",
    ]);
  });

  it("hasDuplicate", function () {
    assert.deepEqual(hasDuplicate(""), false);
    assert.deepEqual(hasDuplicate("a\n"), false);
    assert.deepEqual(hasDuplicate("a\nb\n"), false);
    assert.deepEqual(hasDuplicate("a\na\n"), true);
    assert.deepEqual(hasDuplicate("purple\nblue\n"), false);
    assert.deepEqual(hasDuplicate("red\ngreen\n"), false);
    assert.deepEqual(hasDuplicate("red\ngreen\nblack\nwhite"), false);
    assert.deepEqual(
      hasDuplicate("uber\nmicrosoft\napple\ntesla\ngoogle\nlinekdin\nnetflix"),
      false
    );
    assert.deepEqual(
      hasDuplicate("uber\nmicrosoft\napple\ntesla\ngoogle\nlinekdin\ntesla"),
      true
    );
  });
});
