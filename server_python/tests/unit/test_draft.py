import pytest
from src.draft import Draft


def test_draft_to_list():
    assert Draft.to_list("") == []
    assert Draft.to_list("       ") == []
    assert Draft.to_list("a") == ["a"]
    assert Draft.to_list("list") == ["list"]
    assert Draft.to_list("  row    ") == ["row"]
    assert Draft.to_list("       col") == ["col"]
    assert Draft.to_list("matrix       ") == ["matrix"]
    assert Draft.to_list("a\nb\n") == ["a", "b"]
    assert Draft.to_list("apple\nbird\n") == ["apple", "bird"]
    assert Draft.to_list("     cat   \n elephant   \n") == ["cat", "elephant"]
    assert Draft.to_list("purple\n blue  \n white\n   ") == [
        "purple",
        "blue",
        "white",
    ]
    assert Draft.to_list("purple\nblue\n white\n") == [
        "purple",
        "blue",
        "white",
    ]
    assert Draft.to_list("   black\npink   \ncolorful\nhowdy\n hello     ") == [
        "black",
        "pink",
        "colorful",
        "howdy",
        "hello",
    ]
    assert Draft.to_list("   black\n   \ncolorful\nhowdy\n hello     ") == [
        "black",
        "colorful",
        "howdy",
        "hello",
    ]


def test_check_all_item_valid():
    pass


def test_make_draft():
    pass
