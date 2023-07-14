import subprocess


class Shadow:
    def __init__(self, private_key, view_key, address, fee_record: str):
        self.private_key = private_key
        self.view_key = view_key
        self.address = address
        self.fee_record = fee_record.replace(
            "\\n", "").replace("\n", "").replace(" ", "")
        print(self.fee_record)

    def mint_armin(self, fee, amount):
        mint_command = self.__create_string_mint_armin(fee, amount)
        print(mint_command)
        stdout = subprocess.run(mint_command, text=True,
                                capture_output=True).stdout
        transaction_index = stdout.find("broadcast.\nat")
        transaction_id = stdout[transaction_index+11:transaction_index+73]
        return transaction_id

    def mint_armout(self, fee, amount):
        mint_command = self.__create_string_mint_armout(fee, amount)
        subprocess.run(mint_command)

    def init_shadow(self):
        pass

    def __create_string_mint_armin(self, fee, amount):
        print(type(self.fee_record))
        return 'snarkos developer  execute -p  {} -q "https://vm.aleo.org/api" --record "{}" --broadcast "https://vm.aleo.org/api/testnet3/transaction/broadcast" -f {} "armin_token.aleo" "mint_armin" {} {}'.format(self.private_key, self.fee_record, fee, self.address, amount)

    def __create_string_mint_armout(self, fee, amount):
        return 'snarkos developer  execute -p  {} -q "https://vm.aleo.org/api" --record {} --broadcast "https://vm.aleo.org/api/testnet3/transaction/broadcast" -f {} "armout_token.aleo" "mint_armout" {} {}'.format(self.private_key, self.fee_record, fee, self.address, amount)
    