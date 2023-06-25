import json

from src.app import app


def test_health():
    with app.test_client() as test_client:
        response = test_client.get("/api/health")
        assert response.status_code == 200
        assert response.data == b"OK"


def test_end_to_end():
    with app.test_client() as test_client:
        response = test_client.post("/api/add?rounds=1&options=z&drafters=x")
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

        response1 = test_client.get("/api/load?curDrafterName=x&draftId=0")
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

        response2 = test_client.post(
            "/api/update?curPickOption=z&draftId=0&curDrafter=x"
        )
        assert response2.status_code == 200
        data2 = json.loads(response2.data)
        assert data2 == {
            "allOptions": [],
            "pickedOption": "z",
            "curDrafter": "x",
            "nextPicker": "COMPLETED!!!",
        }

        response3 = test_client.post(
            "/api/add?curDrafterName=ab&rounds=1&options=a\nb\nc\nd&drafters=ab\nbc\ncd\nde"
        )
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

        response4 = test_client.post(
            "/api/update?curPickOption=b&draftId=1&curDrafter=ab"
        )
        assert response4.status_code == 200
        data4 = json.loads(response4.data)
        assert data4 == {
            "allOptions": ["a", "c", "d"],
            "pickedOption": "b",
            "curDrafter": "ab",
            "nextPicker": "bc",
        }

        response5 = test_client.post(
            "/api/add?curDrafterName=y&rounds=2&options=option1\noption2\noption3\noption4\noption5\noption6\noption7&drafters=drafter1\ndrafter2\ndrafter3\n"
        )
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

        response6 = test_client.post(
            "/api/update?curPickOption=d&draftId=1&curDrafter=bc"
        )

        assert response6.status_code == 200
        data6 = json.loads(response6.data)
        assert data6 == {
            "allOptions": ["a", "c"],
            "pickedOption": "d",
            "curDrafter": "bc",
            "nextPicker": "cd",
        }

        response7 = test_client.post(
            "/api/update?curPickOption=c&draftId=1&curDrafter=cd"
        )
        assert response7.status_code == 200
        data7 = json.loads(response7.data)
        assert data7 == {
            "allOptions": ["a"],
            "pickedOption": "c",
            "curDrafter": "cd",
            "nextPicker": "de",
        }

        response8 = test_client.post(
            "/api/update?curPickOption=a&draftId=1&curDrafter=de"
        )
        assert response8.status_code == 200
        data8 = json.loads(response8.data)
        assert data8 == {
            "allOptions": [],
            "pickedOption": "a",
            "curDrafter": "de",
            "nextPicker": "COMPLETED!!!",
        }
