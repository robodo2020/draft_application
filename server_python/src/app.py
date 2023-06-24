from flask import Flask, request, jsonify
from .draft import Draft
from typing import Dict

INIT_DRAFT_ID = 0
draft_map: Dict[int, Draft] = {}

app = Flask(__name__)


@app.route("/api/health", methods=["GET"])
def health():
    return "OK"


# TODO: should method be both get and post?
@app.route("/api/add", methods=["GET", "POST"])
def add_draft():
    global INIT_DRAFT_ID
    print(request)
    # a = request.json.get("rounds")
    # print(a)

    rounds = request.args.get("rounds")
    if rounds == None or type(rounds) != str:
        return f"missing {rounds} parameter", 400

    options = request.args.get("options")
    if options == None or type(options) != str:
        return f"missing {options} parameter", 400

    drafters = request.args.get("drafters")
    if drafters == None or type(drafters) != str:
        return f"missing {drafters} parameter", 400

    draft = Draft.make_draft(rounds, options, drafters)
    if draft == None:
        return "Error happens when creating draft object"

    draft_map[INIT_DRAFT_ID] = draft

    # Send data to the client side
    response_data = {
        "draftId": INIT_DRAFT_ID,
        "pickedOptions": draft.picked_options,
        "rounds": draft.rounds,
        "allOptions": draft.all_options,
        "drafters": draft.drafters,
        "nextPicker": draft.pick_queue[0],
    }
    print(response_data)

    INIT_DRAFT_ID += 1

    return jsonify(response_data)


@app.route("/api/load", methods=["GET"])
def load_exist_drafts():
    return "okkk"
    pass


@app.route("/api/update", methods=["POST"])
def update_draft():
    pass


if __name__ == "__main__":
    app.run(debug=True)
