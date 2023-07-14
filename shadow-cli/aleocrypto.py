
import subprocess

class AleoCrypto:
    def __init__(self,private_key,view_key):
        self.private_key = private_key
        self.view_key = view_key
      
    
    def decrypt(self,record):
        decrypt_command = "snarkos developer decrypt --ciphertext {} --view-key {}".format(record,self.view_key)
        return subprocess.run(decrypt_command,text=True,capture_output=True).stdout






