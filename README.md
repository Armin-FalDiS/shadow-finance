# Shadow Finance

Shadow Finance is a privacy-focused automated market maker (AMM) swap built on the Aleo blockchain. It leverages Aleo's zero-knowledge snark technology to enable trustless private trading.

At present, the project supports a limited selection of two premade tokens, primarily designed for demonstration purposes. Each token has a set of functions that users can engage with. This setup allows for experimentation and exploration of the token functionalities within the project's framework. both tokens have a total supply limit of one hundred billion (100000000000).


## How To Get Started



## Token Functions
To use the swap , you must first mint tokens from the token programs or receive tokens from another account. Here is a list of token functions and their descriptions (both tokens have identical functions):


### Mint
mint(owner: address, amount: u64) 
this function serves as a mechanism to assign a user an arbitrary number of tokens, effectively creating a record of ownership. Currently, anyone can utilize the mint function. Once the mint process is finalized, the total supply of the token will be adjusted accordingly, reflecting the newly issued tokens. mint has an upper limit of 100000 for its input
the two variants of this functions for the tokens are:
mint_armin
mint_armout

### Transfer
transfer(token: Token, receiver: address, amount: u64)
this function allows you to transfer any amount of tokens from your account to the recipient's account by specifying their account address and the desired amount of tokens to be transferred.
the two variants of this function for the tokens are:
transfer_armin
transfer_armout

### Transfer To Program
transfer_token_to_program(token: Token, amount: u64)
To transfer tokens from a user account to a program, you can utilize the transfer to program function. This function enables the transfer of any amount of tokens from the user's account to the program's account by specifying program id and the desired amount of tokens to be transferred. Currently, the program's id is hard-coded as 0u8, but it will be replaced by self.parent as proposed by ARC-0030 in the future. Once the transfer is finalized, the program's balance mapping will be updated accordingly.
function variants are:
transfer_armin_to_program
transfer_armout_to_program



### Transfer From Program
transfer_token_from_program(receiver: address, amount: u64)
This function enables the transfer of any amount of tokens from the program's account to the user's account by specifying user address and the desired amount of tokens to be transferred. Currently, the program's id is hard-coded as 0u8, but it will be replaced by self.parent as proposed by ARC-0030 in the future. Once the transfer is finalized, the program's balance mapping will be updated accordingly.
function variants are:
transfer_armin_from_program
transfer_armout_from_program

