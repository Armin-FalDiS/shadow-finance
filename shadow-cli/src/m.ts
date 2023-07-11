import { AleoNetworkClient } from "@aleohq/sdk";
import { DevelopmentClient } from "@aleohq/sdk";
import {Account} from "@aleohq/sdk"
let net = new AleoNetworkClient("https://vm.aleo.org/api")
let dev = new DevelopmentClient("https://vm.aleo.org/api")
let account = new Account({privateKey:"APrivateKey1zkpBjhQwzqSg78vYQjVz7nXeKSQJi4PRghN9sRRwfiGHQQE"})
console.log(account.address())
// dev.executeProgram("armin_token.aleo","mint_armin",1,account.address() as string)  will add fee-records etc 
