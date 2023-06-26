import json

from server_python.src.app import app
from urllib import parse


def test_health():
    with app.test_client() as test_client:
        response = test_client.get("/api/health")
        assert response.status_code == 200
        assert response.data == b"OK"


def test_end_to_end():
    with app.test_client() as test_client:
        encoded_rounds = parse.quote("1")
        encoded_options = parse.quote("z")
        encoded_drafters = parse.quote("x")
        url = f"/api/add?rounds={encoded_rounds}&options={encoded_options}&drafters={encoded_drafters}"

        response = test_client.post(url)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data == {
            "draftId": 0,
            "pickedOptions": [],
            "rounds": 1,
            "drafters": ["x"],
            "allOptions": ["z"],
            "nextPicker": "x",
        }

        encoded_curDrafterName1 = parse.quote("x")
        encoded_draftId1 = parse.quote("0")
        url1 = f"/api/load?curDrafterName={encoded_curDrafterName1}&draftId={encoded_draftId1}"

        response1 = test_client.get(url1)
        assert response1.status_code == 200
        data1 = json.loads(response1.data)

        assert data1 == {
            "draftId": 0,
            "pickedOptions": [],
            "rounds": 1,
            "drafters": ["x"],
            "allOptions": ["z"],
            "nextPicker": "x",
        }

        encoded_curPickOption2 = parse.quote("z")
        encoded_draftId2 = parse.quote("0")
        encoded_curDrafter2 = parse.quote("x")
        url2 = f"/api/update?curPickOption={encoded_curPickOption2}&draftId={encoded_draftId2}&curDrafter={encoded_curDrafter2}"

        response2 = test_client.post(url2)
        assert response2.status_code == 200
        data2 = json.loads(response2.data)
        assert data2 == {
            "allOptions": [],
            "pickedOption": "z",
            "curDrafter": "x",
            "nextPicker": "COMPLETED!!!",
        }

        encoded_curDrafterName3 = parse.quote("ab")
        encoded_options3 = parse.quote("a\nb\nc\nd")
        encoded_rounds3 = parse.quote("1")
        encoded_drafters3 = parse.quote("ab\nbc\ncd\nde")
        url3 = f"/api/add?curDrafterName={encoded_curDrafterName3}&rounds={encoded_rounds3}&options={encoded_options3}&drafters={encoded_drafters3}"
        response3 = test_client.post(url3)
        assert response3.status_code == 200
        data3 = json.loads(response3.data)
        assert data3 == {
            "draftId": 1,
            "pickedOptions": [],
            "rounds": 1,
            "drafters": ["ab", "bc", "cd", "de"],
            "allOptions": ["a", "b", "c", "d"],
            "nextPicker": "ab",
        }

        encoded_curPickOption4 = parse.quote("b")
        encoded_draftId4 = parse.quote("1")
        encoded_curDrafter4 = parse.quote("ab")
        url4 = f"/api/update?curPickOption={encoded_curPickOption4}&draftId={encoded_draftId4}&curDrafter={encoded_curDrafter4}"

        response4 = test_client.post(url4)
        assert response4.status_code == 200
        data4 = json.loads(response4.data)
        assert data4 == {
            "allOptions": ["a", "c", "d"],
            "pickedOption": "b",
            "curDrafter": "ab",
            "nextPicker": "bc",
        }

        encoded_curDrafterName5 = parse.quote("y")
        encoded_rounds5 = parse.quote("2")
        encoded_options5 = parse.quote(
            "option1\noption2\noption3\noption4\noption5\noption6\noption7"
        )
        encoded_drafters5 = parse.quote("drafter1\ndrafter2\ndrafter3\n")
        url5 = f"/api/add?curDrafterName={encoded_curDrafterName5}&rounds={encoded_rounds5}&options={encoded_options5}&drafters={encoded_drafters5}"

        response5 = test_client.post(url5)
        assert response5.status_code == 200
        data5 = json.loads(response5.data)
        assert data5 == {
            "draftId": 2,
            "pickedOptions": [],
            "rounds": 2,
            "drafters": ["drafter1", "drafter2", "drafter3"],
            "allOptions": [
                "option1",
                "option2",
                "option3",
                "option4",
                "option5",
                "option6",
                "option7",
            ],
            "nextPicker": "drafter1",
        }

        encoded_curPickOption6 = parse.quote("d")
        encoded_draftId6 = parse.quote("1")
        encoded_curDrafter6 = parse.quote("bc")
        url6 = f"/api/update?curPickOption={encoded_curPickOption6}&draftId={encoded_draftId6}&curDrafter={encoded_curDrafter6}"

        response6 = test_client.post(url6)

        assert response6.status_code == 200
        data6 = json.loads(response6.data)
        assert data6 == {
            "allOptions": ["a", "c"],
            "pickedOption": "d",
            "curDrafter": "bc",
            "nextPicker": "cd",
        }

        encoded_curPickOption7 = parse.quote("c")
        encoded_draftId7 = parse.quote("1")
        encoded_curDrafter7 = parse.quote("cd")
        url7 = f"/api/update?curPickOption={encoded_curPickOption7}&draftId={encoded_draftId7}&curDrafter={encoded_curDrafter7}"

        response7 = test_client.post(url7)
        assert response7.status_code == 200
        data7 = json.loads(response7.data)
        assert data7 == {
            "allOptions": ["a"],
            "pickedOption": "c",
            "curDrafter": "cd",
            "nextPicker": "de",
        }

        encoded_curPickOption8 = parse.quote("a")
        encoded_draftId8 = parse.quote("1")
        encoded_curDrafter8 = parse.quote("de")
        url8 = f"/api/update?curPickOption={encoded_curPickOption8}&draftId={encoded_draftId8}&curDrafter={encoded_curDrafter8}"

        response8 = test_client.post(url8)
        assert response8.status_code == 200
        data8 = json.loads(response8.data)
        assert data8 == {
            "allOptions": [],
            "pickedOption": "a",
            "curDrafter": "de",
            "nextPicker": "COMPLETED!!!",
        }
