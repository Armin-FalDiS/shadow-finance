import requests


class CallAleo:
    def init(self):
        pass

    @staticmethod
    def get_fee_ciphertext(transaction_id):
        request = requests.get(
            "https://vm.aleo.org/api/testnet3/transaction/{}".format(transaction_id))
        return request.json()["fee"]["transition"]["outputs"][0]["value"]

    @staticmethod
    def get_record_ciphertext(transaction_id):
        request = requests.get(
            "https://vm.aleo.org/api/testnet3/transaction/{}".format(transaction_id))
        return request.json()["execution"]["transitions"][0]["outputs"][0]["value"]

    @staticmethod
    def get_mapping_value(program_id, mapping_name, mapping_key):
        request = requests.get(
            "https://vm.aleo.org/api/testnet3/program/{}/mappings/{}/{}".format(program_id, mapping_name, mapping_key))
        return request.json()


