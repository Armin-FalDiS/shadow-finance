
from shadow import Shadow
from aleocrypto import AleoCrypto
import os
from statemanager import StateManager
from sys import argv
from callaleo import CallAleo
if (os.system("snarkos> {} 2>&1".format(os.devnull)) == 1):
    print("SnarkOS not detected")
    exit(1)


if StateManager.is_new_user():
    private_key = input("Welcome new user, Enter your private key: \n")
    view_key = input("Enter our View key now: \n")
    address = input("Enter your address now \n")

    record = input("thanks ,Now enter your lastest valid fee record: \n")
    print("Note that entering an invalid record or private key will make the program unable to process your requests, you can use 'reset' option to reset your state")
    state_manager = StateManager(record, private_key,view_key,address, new_user=True)
    exit(1)
selection = argv[1]
match selection:
    case "reset":
        StateManager.reset_state()
    case "mint_armin":
        state_manager = StateManager()
        aleo = AleoCrypto(state_manager.private_key,
                          state_manager.view_key)

        shadow = Shadow(state_manager.private_key, state_manager.view_key,
                        state_manager.address, state_manager.fee_record)
        transaction_id = shadow.mint_armin("10000", "1000u64")
        print(transaction_id)
        fee_ciphertext = CallAleo.get_fee_ciphertext(transaction_id)
        armin_ciphertext = CallAleo.get_record_ciphertext(transaction_id)
        new_fee_record = aleo.decrypt(fee_ciphertext)
        new_armin_record = aleo.decrypt(armin_ciphertext)
        state_manager.update_fee_record(new_fee_record)
        state_manager.update_armin_record(new_armin_record)
    case "mint_armout":
        state_manager = StateManager()
        aleo = AleoCrypto(state_manager.private_key,
                          state_manager.view_key)

        shadow = Shadow(state_manager.private_key, state_manager.view_key,
                        state_manager.address, state_manager.fee_record)
        transaction_id = shadow.mint_armout("10000", "1000u64")
        print(transaction_id)
        fee_ciphertext = CallAleo.get_fee_ciphertext(transaction_id)
        armout_ciphertext = CallAleo.get_record_ciphertext(transaction_id)
        new_fee_record = aleo.decrypt(fee_ciphertext)
        new_armout_record = aleo.decrypt(armout_ciphertext)
        state_manager.update_fee_record(new_fee_record)
        state_manager.update_armout_record(new_armout_record)
    case "init_lp":
        pass

    case "lp":
        pass

    case "armin_to_armout":
        pass

    case "armout_to_armin":
        pass

    case "help":
        pass
    case _:
        print("Wrong option")
