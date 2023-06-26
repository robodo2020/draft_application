from typing import List, Tuple


class Draft:
    def __init__(
        self,
        rounds: int,
        all_options: List[str],
        drafters: List[str],
        picked_options: List[Tuple[str, str]],
        pick_queue: List[str],
    ):
        self.rounds = rounds
        self.all_options = all_options
        self.drafters = drafters
        self.picked_options = picked_options  # option, drafter
        self.pick_queue = pick_queue

    def print_parameters(self):
        print(self.rounds)
        print(self.all_options)
        print(self.drafters)
        print(self.picked_options)
        print(self.pick_queue)

    def check_next_picker(self):
        next_picker = ""
        if len(self.pick_queue) > 0:
            next_picker = self.pick_queue[0]
        else:
            next_picker = "COMPLETED!!!"
        return next_picker

    @staticmethod
    def to_list(items_str: str) -> List[str]:
        items_list = items_str.split("\n")
        items_list = [item.strip() for item in items_list]
        items_list = [item for item in items_list if item]

        return items_list

    @staticmethod
    def check_all_item_valid(items_list: List[str]) -> bool:
        for item in items_list:
            if item == "COMPLETED!!!":
                return False
        return True

    @classmethod
    def make_draft(cls, rounds, all_options, drafters):
        all_options_list = Draft.to_list(all_options)
        all_drafters_list = Draft.to_list(drafters)
        rounds_num = int(rounds)

        if len(all_drafters_list) * rounds_num > len(all_options_list):
            print("Error: drafters cannot less than options")
            return None

        if not Draft.check_all_item_valid(all_drafters_list):
            print("Error: the Drafters contains invalid words")
            return None

        draft = cls(
            rounds=rounds_num,
            all_options=all_options_list,
            drafters=all_drafters_list,
            picked_options=[],
            pick_queue=[],
        )

        for _ in range(rounds_num):
            for drafter in draft.drafters:
                draft.pick_queue.append(drafter)

        return draft
