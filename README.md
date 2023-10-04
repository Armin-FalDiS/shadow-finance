# Shadow Finance


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://shadowfi.xyz/">
    <img src="https://github.com/Armin-FalDiS/shadow-finance/assets/20294274/f95820fc-d300-4ac6-aa9d-c05587771cd0" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Shadow Finance</h3>

  <p align="center">
    Private Swap along with tokens for Aleo deploy incentives program !
    <br />
    <a href="https://github.com/Armin-FalDis/shadow-finance"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://shadowfi.xyz/">View Demo</a>
    ·
    <a href="https://github.com/Armin-FalDis/shadow-finance">Report Bug</a>
    ·
    <a href="https://github.com/Armin-FalDis/shadow-finance">Request Feature</a>
  </p>
</div>

Link to our Website : https://shadowfi.xyz/

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#Getting Started">Getting Started</a></li>
    <li>
      <a href="#About The Project">About The Project</a>
            <ul>
        <li><a href="#Our Vision">Our Vision</a></li>
      </ul>
    </li>
<li><a href="#Token Mappings">Token Mappings </a></li>
<li><a href="#Swap Mappings">Swap Mappings </a></li>
<li><a href="#Token Functions">Token Functions</a></li>
<li><a href="#Swap Functions">Swap Functions</a></li>

  </ol>
</details>

## Getting Started
You can find the frontend [here](https://shadowfi.xyz). You can also execute all of the functions directly with Aleo SDK/SnarkOS and tools like aleo.tools.

There is also [this video](https://drive.google.com/file/d/1X_f8PVwt4QtFoVI6dcATeXuhPtdEsbkU/view) that you may watch which showcases the project.

## About The Project

ShadowFi is a decentralized private liquidity marketplace built on Aleo, designed to function as its Base liquidity layer. As a privacy-first liquidity exchange, our primary objective is to address prevalent issues around incentivizing liquidity provision and availability faced by both protocols and users, while simultaneously offering end users a secure, feature-rich  application with a user-friendly interface.
At present, the project supports a limited selection of two premade tokens, primarily designed for demonstration purposes. Each token has a set of functions that users can engage with. This setup allows for experimentation and exploration of the token functionalities within the project's framework. both tokens have a total supply limit of one hundred billion (100000000000).

You can read more our [medium](https://medium.com/@shadowfi.xyz/shadowfi-a-decentralized-liquidity-marketplace-on-aleo-d84ebe299d48) article for more information 

<p align="right">(<a href="#top">back to top</a>)</p>


## Our Vision
Our vision for ShadowFi is for it to become a central private liquidity hub on Aleo, helping to address the cold start liquidity problem that projects often face and enhance liquidity provision by incentivizing fee generation instead of inefficient liquidity distribution. We aim to achieve this by aligning the incentives of voters, traders, liquidity providers, and protocols. Our goal is to enable users to trade and swap anonymously, without any interference or control from ShadowFi. We have designed the platform in such a way that ShadowFi has no access to user addresses and all trades are completely trustless and private.


## Token Mappings

### Token Supply
supply_$token: u8 => u64;

To maintain a record of the overall token supply, a mapping has been implemented. Given the current absence of alternative public state types, a mapping with an input value of 0 (0u8) has been used. The maximum limit for both token supplies has been set at 100,000,000,000 units. Please note that the token supply cannot exceed this value.


### Program Supply
programs_$token: field => u64

ShadowFi utilizes a bhp256 hashed field of the Program ID, which is temporarily substituted with a placeholder until the Aleo platform incorporates the self.parent feature. This hashed field is then mapped to an integer, allowing programs to efficiently escrow. By implementing this mechanism, ShadowFi empowers programs to securely use tokens in liquidity pools and other relevant use cases.

## Token Functions

To use the swap , you must first mint tokens from the token programs or receive tokens from another account. Here is a list of token functions and their descriptions (both tokens have identical functions):

### Mint
mint(owner: address, amount: u64)  

This function serves as a mechanism to assign a user an arbitrary number of tokens, effectively creating a record of ownership. Currently, anyone can utilize the mint function. Once the mint process is finalized, the total supply of the token will be adjusted accordingly, reflecting the newly issued tokens. mint has an upper limit of 100000 for its input
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
function variants are: <br>
transfer_armin_from_program  
transfer_armout_from_program  

<p align="right">(<a href="#top">back to top</a>)</p>

## Swap Mappings
### Reserves Shadow

reserves_shadow: u8 => u64

ShadowFi uses a mapping to keep a record of the current token reserves. Due to the lack of alternative public state types, a mapping with input values of 0 and 1 (0u8, 1u8) is utilized. These variables are updated whenever there is an interaction that impacts the overall balance of tokens in the Swap.

### Supply Shadow

supply_shadow: u8 => u64;

This mapping is responsible for keeping track of the total supply of LP Tokens issued by ShadowFi. This information then can be used in determining the proportionate ownership of users in a liquidity pool. The Total Supply value is continuously updated whenever new LP Tokens are issued or when liquidity is withdrawn from the pool.


### LP Tokens Shadow 

lp_tokens_shadow: field => u64;

ShadowFi uses a bhp256 hashed field of the user address, which is mapped to an integer, to securely and privately track the LP tokens issued to users.



## Swap Functions

### Mint LP Init Shadow
mint_lp_init_shadow(receiver: address, token0: armin_token.leo/ArminToken, amount0: u64, token1: armout_token.leo/ArmoutToken, amount1: u64)  

This function initializes the liquidity pool and allows you to set the initial price for the tokens. The price is set based on the proportion of tokens you deposit into the pool.
Upon finalization of the process, the reserves for both tokens will be adjusted accordingly, and LP tokens will be issued to the liquidity provider. All of this information is stored in mappings.To avoid excessive appreciation of a single LP token, the initial issuance of LP tokens will be reduced by 1000.  

### Mint LP Shadow  
mint_lp_shadow(receiver: address, token0: armin_token.leo/ArminToken, amount0: u64, token1: armout_token.leo/ArmoutToken, amount1: u64)  

This function enables any user to deposit tokens in proportion to the current price into the pool. The reserves for the tokens will be adjusted accordingly, and LP tokens will be generated and issued to the liquidity provider. Additionally, the total supply of LP tokens will be updated.  

### Burn LP Shadow
(receiver: address, amount0: u64, amount1: u64)  
    
This function allows the owner of an address  to burn their LP tokens and receive Liquidity in exchange. The proportion of tokens returned will depend on the current price in the pool. Once finalized, the token reserves and LP token mappings will be updated accordingly.  

### Swap To Shadow  
By utilizing this function, the user can trade tokens according to the present exchange ratio in the pool. The exchange ratio is determined by the constant product ratio (k = x * y).
Upon completion, the token reserve mappings are updated.

function variatns are :
transition swap_to_0_shadow(receiver: address, token1In: armout_token.leo/ArmoutToken, amount1In: u64, amount0Out: u64)  
transition swap_to_1_shadow(receiver: address, token0In: armin_token.leo/ArminToken, amount0In: u64, amount1Out: u64)  



<p align="right">(<a href="#top">back to top</a>)</p>
