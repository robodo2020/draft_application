from typing import Dict
from flask import Flask, request, jsonify
from .draft import Draft

INIT_DRAFT_ID: int = 0
draft_map: Dict[int, Draft] = {}

app = Flask(__name__)


@app.route("/api/health", methods=["GET"])
def health():
    return "OK"


@app.route("/api/add", methods=["GET", "POST"])
def add_draft():
    global INIT_DRAFT_ID

    rounds = request.args.get("rounds")
    if rounds is None or not isinstance(rounds, str):
        print(f"Error: missing {rounds} parameter")
        return f"missing {rounds} parameter", 400

    options = request.args.get("options")
    if options is None or not isinstance(options, str):
        print(f"Error: missing {options} parameter")
        return f"missing {options} parameter", 400

    drafters = request.args.get("drafters")
    if drafters is None or not isinstance(drafters, str):
        print(f"Error: missing {drafters} parameter")
        return f"missing {drafters} parameter", 400
    print("----- options & drafters -----")
    print(options)
    print(drafters)
    print("----- options & drafters -----")

    draft = Draft.make_draft(rounds, options, drafters)
    if draft is None:
        print("Error: Error happens when creating draft object")
        return "Error happens when creating draft object", 400

    draft_map[INIT_DRAFT_ID] = draft

    print("********************")
    print(draft_map)
    print("********************")

    # Send data to the client side
    response_data = {
        "draftId": INIT_DRAFT_ID,
        "pickedOptions": draft.picked_options,
        "rounds": draft.rounds,
        "allOptions": draft.all_options,
        "drafters": draft.drafters,
        "nextPicker": draft.pick_queue[0],
    }

    INIT_DRAFT_ID += 1

    return jsonify(response_data)


@app.route("/api/load", methods=["GET"])
def load_exist_drafts():
    cur_drafter_name = request.args.get("curDrafterName")
    if cur_drafter_name is None or not isinstance(cur_drafter_name, str):
        print(f"Error: missing {cur_drafter_name} parameter")
        return f"missing {cur_drafter_name} parameter", 400

    draft_id_str = request.args.get("draftId")
    if draft_id_str is None or not isinstance(draft_id_str, str):
        print(f"Error: missing {draft_id_str} parameter")
        return f"missing {draft_id_str} parameter", 400

    draft_id = int(draft_id_str)

    print("----------")
    print(draft_map)
    print("----------")
    # check if curDrafter exist in map
    # currently assume id definitely exists
    # currently assume curDrafter definitely exists
    cur_draft = draft_map.get(draft_id)
    if cur_draft is None:
        print("Error: draftId doesn't exist")
        return "draftId doesn't exist", 400

    cur_draft.print_parameters()

    next_picker = cur_draft.check_next_picker()

    response_data = {
        "draftId": draft_id,
        "pickedOptions": cur_draft.picked_options,
        "rounds": cur_draft.rounds,
        "allOptions": cur_draft.all_options,
        "drafters": cur_draft.drafters,
        "nextPicker": next_picker,
    }

    return jsonify(response_data)


@app.route("/api/update", methods=["GET", "POST"])
def update_draft():
    cur_pick_option = request.args.get("curPickOption")
    if cur_pick_option is None or not isinstance(cur_pick_option, str):
        print(f"Error: missing {cur_pick_option} parameter")
        return f"missing {cur_pick_option} parameter", 400

    draft_id_str = request.args.get("draftId")
    if draft_id_str is None or not isinstance(draft_id_str, str):
        print(f"Error: missing {draft_id_str} parameter")
        return f"missing {draft_id_str} parameter", 400

    cur_drafter = request.args.get("curDrafter")
    if cur_drafter is None or not isinstance(cur_drafter, str):
        print(f"Error: missing {cur_drafter} parameter")
        return f"missing {cur_drafter} parameter", 400

    print("----- draft_map -----")
    print(draft_map)
    print("----- draft_map -----")

    draft_id = int(draft_id_str)
    cur_draft = draft_map.get(draft_id)
    if cur_draft is None:
        print("Error: draftId doesn't exist")
        return "draftId doesn't exist", 400

    cur_draft.picked_options.append([cur_pick_option, cur_drafter])
    try:
        item_idx = cur_draft.all_options.index(cur_pick_option)
    except ValueError:
        print("Error: cur_pick_option doesn't exist in all_options")
        return "cur_pick_option doesn't exist in all_options", 400

    cur_draft.all_options.pop(item_idx)
    cur_draft.pick_queue.pop(0)

    next_picker = cur_draft.check_next_picker()

    response_data = {
        "allOptions": cur_draft.all_options,
        "pickedOption": cur_pick_option,
        "curDrafter": cur_drafter,
        "nextPicker": next_picker,
    }

    return jsonify(response_data)


if __name__ == "__main__":
    app.run(debug=True)
