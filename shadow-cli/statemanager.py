import json
import os


class StateManager:
    def __init__(self, fee_record=0, private_key=0, view_key=0,address=0,new_user=False,):

        if new_user == True:

            with open("./state.json", "x") as created_file:
                state = {"private_key": private_key, "fee_record": fee_record,"view_key":view_key,"address":address}
                created_file.write(json.dumps(state))
            print("New user created ")
        else:
            state = self.get_file()
            self.fee_record = state["fee_record"]
            self.private_key = state["private_key"]
            self.view_key= state["view_key"]
            self.address= state["address"]



    def update_armin_record(self, record):
        state = self.get_file()
        state["armin_record"] = record
        with open("./state.json", "r+",) as update_file:
            update_file.write(json.dumps(state))


    def update_armout_record(self, record):
        state = self.get_file()
        state["armout_record"] = record
        with open("./state.json", "r+",) as update_file:
            update_file.write(json.dumps(state))

    def update_fee_record(self, record):
        state = self.get_file()
        state["fee_record"] = record
        with open("./state.json", "r+",) as update_file:
            update_file.write(json.dumps(state))

    @staticmethod
    def is_new_user():
        return not os.path.isfile("./state.json")

    @staticmethod
    def reset_state():
        os.remove("./state.json")

    def get_file(self):
        file = open("./state.json", "r+")
        return json.load(file)
