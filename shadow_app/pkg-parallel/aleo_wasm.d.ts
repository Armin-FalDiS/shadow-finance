/* tslint:disable */
/* eslint-disable */
/**
* @param {number} num_threads
* @returns {Promise<any>}
*/
export function initThreadPool(num_threads: number): Promise<any>;
/**
* @param {number} receiver
*/
export function wbg_rayon_start_worker(receiver: number): void;
/**
*/
export class Address {
  free(): void;
/**
* @param {PrivateKey} private_key
* @returns {Address}
*/
  static from_private_key(private_key: PrivateKey): Address;
/**
* @param {ViewKey} view_key
* @returns {Address}
*/
  static from_view_key(view_key: ViewKey): Address;
/**
* @param {string} address
* @returns {Address}
*/
  static from_string(address: string): Address;
/**
* @returns {string}
*/
  to_string(): string;
/**
* @param {Uint8Array} message
* @param {Signature} signature
* @returns {boolean}
*/
  verify(message: Uint8Array, signature: Signature): boolean;
}
/**
* Webassembly Representation of an Aleo function execution response
*
* This object is returned by the execution of an Aleo function off-chain. It provides methods for
* retrieving the outputs of the function execution.
*/
export class ExecutionResponse {
  free(): void;
/**
* Get the outputs of the executed function
* @returns {Array<any>}
*/
  getOutputs(): Array<any>;
}
/**
*/
export class KeyPair {
  free(): void;
/**
* Create new key pair from proving and verifying keys
* @param {ProvingKey} proving_key
* @param {VerifyingKey} verifying_key
*/
  constructor(proving_key: ProvingKey, verifying_key: VerifyingKey);
/**
* Get the proving key
* @returns {ProvingKey}
*/
  provingKey(): ProvingKey;
/**
* Get the verifying key
* @returns {VerifyingKey}
*/
  verifyingKey(): VerifyingKey;
}
/**
*/
export class PrivateKey {
  free(): void;
/**
* Generate a new private key
*/
  constructor();
/**
* Get a private key from a series of unchecked bytes
* @param {Uint8Array} seed
* @returns {PrivateKey}
*/
  static from_seed_unchecked(seed: Uint8Array): PrivateKey;
/**
* Create a private key from a string representation
*
* This function will fail if the text is not a valid private key
* @param {string} private_key
* @returns {PrivateKey}
*/
  static from_string(private_key: string): PrivateKey;
/**
* Get a string representation of the private key
*
* This function should be used very carefully as it exposes the private key plaintext
* @returns {string}
*/
  to_string(): string;
/**
* Get the view key corresponding to the private key
* @returns {ViewKey}
*/
  to_view_key(): ViewKey;
/**
* Get the address corresponding to the private key
* @returns {Address}
*/
  to_address(): Address;
/**
* Sign a message with the private key
* @param {Uint8Array} message
* @returns {Signature}
*/
  sign(message: Uint8Array): Signature;
/**
* Get a private key ciphertext using a secret.
*
* The secret is sensitive and will be needed to decrypt the private key later, so it should be stored securely
* @param {string} secret
* @returns {PrivateKeyCiphertext}
*/
  static newEncrypted(secret: string): PrivateKeyCiphertext;
/**
* Encrypt the private key with a secret.
*
* The secret is sensitive and will be needed to decrypt the private key later, so it should be stored securely
* @param {string} secret
* @returns {PrivateKeyCiphertext}
*/
  toCiphertext(secret: string): PrivateKeyCiphertext;
/**
* Get private key from a private key ciphertext using a secret.
* @param {PrivateKeyCiphertext} ciphertext
* @param {string} secret
* @returns {PrivateKey}
*/
  static fromPrivateKeyCiphertext(ciphertext: PrivateKeyCiphertext, secret: string): PrivateKey;
}
/**
* Private Key in ciphertext form
*/
export class PrivateKeyCiphertext {
  free(): void;
/**
* Encrypt a private key using a secret string.
*
* The secret is sensitive and will be needed to decrypt the private key later, so it should be stored securely.
* @param {PrivateKey} private_key
* @param {string} secret
* @returns {PrivateKeyCiphertext}
*/
  static encryptPrivateKey(private_key: PrivateKey, secret: string): PrivateKeyCiphertext;
/**
* Decrypts a private ciphertext using a secret string.
*
* This must be the same secret used to encrypt the private key
* @param {string} secret
* @returns {PrivateKey}
*/
  decryptToPrivateKey(secret: string): PrivateKey;
/**
* Returns the ciphertext string
* @returns {string}
*/
  toString(): string;
/**
* Creates a PrivateKeyCiphertext from a string
* @param {string} ciphertext
* @returns {PrivateKeyCiphertext}
*/
  static fromString(ciphertext: string): PrivateKeyCiphertext;
}
/**
* Webassembly Representation of an Aleo program
*
* This object is required to create an Execution or Deployment transaction. It includes several
* convenience methods for enumerating available functions and each functions' inputs in a
* javascript object for usage in creation of web forms for input capture.
*/
export class Program {
  free(): void;
/**
* Create a program from a program string
* @param {string} program
* @returns {Program}
*/
  static fromString(program: string): Program;
/**
* Get a string representation of the program
* @returns {string}
*/
  toString(): string;
/**
* Get javascript array of functions names in the program
* @returns {Array<any>}
*/
  getFunctions(): Array<any>;
/**
* Get a javascript object representation of the function inputs and types. This can be used
* to generate a webform to capture user inputs for an execution of a function.
* @param {string} function_name
* @returns {Array<any>}
*/
  getFunctionInputs(function_name: string): Array<any>;
/**
* Get a the list of a program's mappings and the names/types of their keys and values.
*
* @returns {Array} - An array of objects representing the mappings in the program
* @example
* const expected_mappings = [
*    {
*       name: "account",
*       key_name: "owner",
*       key_type: "address",
*       value_name: "microcredits",
*       value_type: "u64"
*    }
* ]
*
* const credits_program = aleo_wasm.Program.getCreditsProgram();
* const credits_mappings = credits_program.getMappings();
* console.log(credits_mappings === expected_mappings); // Output should be "true"
* @returns {Array<any>}
*/
  getMappings(): Array<any>;
/**
* Get a javascript object representation of a program record and its types
* @param {string} record_name
* @returns {object}
*/
  getRecordMembers(record_name: string): object;
/**
* Get a javascript object representation of a program struct and its types
* @param {string} struct_name
* @returns {Array<any>}
*/
  getStructMembers(struct_name: string): Array<any>;
/**
* Get the credits.aleo program
* @returns {Program}
*/
  static getCreditsProgram(): Program;
/**
* Get the id of the program
* @returns {string}
*/
  id(): string;
/**
* Determine equality with another program
* @param {Program} other
* @returns {boolean}
*/
  isEqual(other: Program): boolean;
/**
* Get program_imports
* @returns {Array<any>}
*/
  getImports(): Array<any>;
}
/**
*/
export class ProgramManager {
  free(): void;
/**
* Execute an arbitrary function locally
*
* @param private_key The private key of the sender
* @param program The source code of the program being executed
* @param function The name of the function to execute
* @param inputs A javascript array of inputs to the function
* @param amount_record The record to fund the amount from
* @param fee_credits The amount of credits to pay as a fee
* @param fee_record The record to spend the fee from
* @param url The url of the Aleo network node to send the transaction to
* @param cache Cache the proving and verifying keys in the ProgramManager's memory.
* If this is set to 'true' the keys synthesized (or passed in as optional parameters via the
* `proving_key` and `verifying_key` arguments) will be stored in the ProgramManager's memory
* and used for subsequent transactions. If this is set to 'false' the proving and verifying
* keys will be deallocated from memory after the transaction is executed.
* @param imports (optional) Provide a list of imports to use for the function execution in the
* form of a javascript object where the keys are a string of the program name and the values
* are a string representing the program source code { "hello.aleo": "hello.aleo source code" }
* @param proving_key (optional) Provide a verifying key to use for the function execution
* @param verifying_key (optional) Provide a verifying key to use for the function execution
* @param {PrivateKey} private_key
* @param {string} program
* @param {string} _function
* @param {Array<any>} inputs
* @param {boolean} cache
* @param {object | undefined} imports
* @param {ProvingKey | undefined} proving_key
* @param {VerifyingKey | undefined} verifying_key
* @returns {ExecutionResponse}
*/
  execute_local(private_key: PrivateKey, program: string, _function: string, inputs: Array<any>, cache: boolean, imports?: object, proving_key?: ProvingKey, verifying_key?: VerifyingKey): ExecutionResponse;
/**
* Execute Aleo function and create an Aleo execution transaction
*
* @param private_key The private key of the sender
* @param program The source code of the program being executed
* @param function The name of the function to execute
* @param inputs A javascript array of inputs to the function
* @param fee_credits The amount of credits to pay as a fee
* @param fee_record The record to spend the fee from
* @param url The url of the Aleo network node to send the transaction to
* @param cache Cache the proving and verifying keys in the ProgramManager's memory.
* If this is set to 'true' the keys synthesized (or passed in as optional parameters via the
* `proving_key` and `verifying_key` arguments) will be stored in the ProgramManager's memory
* and used for subsequent transactions. If this is set to 'false' the proving and verifying
* keys will be deallocated from memory after the transaction is executed.
* @param imports (optional) Provide a list of imports to use for the function execution in the
* form of a javascript object where the keys are a string of the program name and the values
* are a string representing the program source code { "hello.aleo": "hello.aleo source code" }
* @param proving_key (optional) Provide a verifying key to use for the function execution
* @param verifying_key (optional) Provide a verifying key to use for the function execution
* @param fee_proving_key (optional) Provide a proving key to use for the fee execution
* @param fee_verifying_key (optional) Provide a verifying key to use for the fee execution
* @param {PrivateKey} private_key
* @param {string} program
* @param {string} _function
* @param {Array<any>} inputs
* @param {number} fee_credits
* @param {RecordPlaintext} fee_record
* @param {string} url
* @param {boolean} cache
* @param {object | undefined} imports
* @param {ProvingKey | undefined} proving_key
* @param {VerifyingKey | undefined} verifying_key
* @param {ProvingKey | undefined} fee_proving_key
* @param {VerifyingKey | undefined} fee_verifying_key
* @returns {Promise<Transaction>}
*/
  execute(private_key: PrivateKey, program: string, _function: string, inputs: Array<any>, fee_credits: number, fee_record: RecordPlaintext, url: string, cache: boolean, imports?: object, proving_key?: ProvingKey, verifying_key?: VerifyingKey, fee_proving_key?: ProvingKey, fee_verifying_key?: VerifyingKey): Promise<Transaction>;
/**
* Estimate Fee for Aleo function execution. Note if "cache" is set to true, the proving and
* verifying keys will be stored in the ProgramManager's memory and used for subsequent
* program executions.
*
* Disclaimer: Fee estimation is experimental and may not represent a correct estimate on any current or future network
*
* @param private_key The private key of the sender
* @param program The source code of the program to estimate the execution fee for
* @param function The name of the function to execute
* @param inputs A javascript array of inputs to the function
* @param url The url of the Aleo network node to send the transaction to
* @param cache Cache the proving and verifying keys in the ProgramManager's memory.
* @param imports (optional) Provide a list of imports to use for the fee estimation in the
* form of a javascript object where the keys are a string of the program name and the values
* are a string representing the program source code { "hello.aleo": "hello.aleo source code" }
* @param proving_key (optional) Provide a verifying key to use for the fee estimation
* @param verifying_key (optional) Provide a verifying key to use for the fee estimation
* @param {PrivateKey} private_key
* @param {string} program
* @param {string} _function
* @param {Array<any>} inputs
* @param {string} url
* @param {boolean} cache
* @param {object | undefined} imports
* @param {ProvingKey | undefined} proving_key
* @param {VerifyingKey | undefined} verifying_key
* @returns {Promise<bigint>}
*/
  estimateExecutionFee(private_key: PrivateKey, program: string, _function: string, inputs: Array<any>, url: string, cache: boolean, imports?: object, proving_key?: ProvingKey, verifying_key?: VerifyingKey): Promise<bigint>;
/**
* Estimate the finalize fee component for executing a function. This fee is additional to the
* size of the execution of the program in bytes. If the function does not have a finalize
* step, then the finalize fee is 0.
*
* Disclaimer: Fee estimation is experimental and may not represent a correct estimate on any current or future network
*
* @param program The program containing the function to estimate the finalize fee for
* @param function The function to estimate the finalize fee for
* @param {string} program
* @param {string} _function
* @returns {bigint}
*/
  estimateFinalizeFee(program: string, _function: string): bigint;
/**
* Send credits from one Aleo account to another
*
* @param private_key The private key of the sender
* @param amount_credits The amount of credits to send
* @param recipient The recipient of the transaction
* @param transfer_type The type of the transfer (options: "private", "public", "private_to_public", "public_to_private")
* @param amount_record The record to fund the amount from
* @param fee_credits The amount of credits to pay as a fee
* @param fee_record The record to spend the fee from
* @param url The url of the Aleo network node to send the transaction to
* @param cache Cache the proving and verifying keys in the ProgramManager memory. If this is
* set to `true` the keys synthesized (or passed in as optional parameters via the
* `transfer_proving_key` and `transfer_verifying_key` arguments) will be stored in the
* ProgramManager's memory and used for subsequent transactions. If this is set to `false` the
* proving and verifying keys will be deallocated from memory after the transaction is executed
* @param transfer_proving_key (optional) Provide a proving key to use for the transfer
* function
* @param transfer_verifying_key (optional) Provide a verifying key to use for the transfer
* function
* @param fee_proving_key (optional) Provide a proving key to use for the fee execution
* @param fee_verifying_key (optional) Provide a verifying key to use for the fee execution
* @param {PrivateKey} private_key
* @param {number} amount_credits
* @param {string} recipient
* @param {string} transfer_type
* @param {RecordPlaintext | undefined} amount_record
* @param {number} fee_credits
* @param {RecordPlaintext} fee_record
* @param {string} url
* @param {boolean} cache
* @param {ProvingKey | undefined} transfer_proving_key
* @param {VerifyingKey | undefined} transfer_verifying_key
* @param {ProvingKey | undefined} fee_proving_key
* @param {VerifyingKey | undefined} fee_verifying_key
* @returns {Promise<Transaction>}
*/
  transfer(private_key: PrivateKey, amount_credits: number, recipient: string, transfer_type: string, amount_record: RecordPlaintext | undefined, fee_credits: number, fee_record: RecordPlaintext, url: string, cache: boolean, transfer_proving_key?: ProvingKey, transfer_verifying_key?: VerifyingKey, fee_proving_key?: ProvingKey, fee_verifying_key?: VerifyingKey): Promise<Transaction>;
/**
* Join two records together to create a new record with an amount of credits equal to the sum
* of the credits of the two original records
*
* @param private_key The private key of the sender
* @param record_1 The first record to combine
* @param record_2 The second record to combine
* @param fee_credits The amount of credits to pay as a fee
* @param fee_record The record to spend the fee from
* @param url The url of the Aleo network node to send the transaction to
* @param cache Cache the proving and verifying keys in the ProgramManager memory. If this is
* set to `true` the keys synthesized (or passed in as optional parameters via the
* `join_proving_key` and `join_verifying_key` arguments) will be stored in the
* ProgramManager's memory and used for subsequent transactions. If this is set to `false` the
* proving and verifying keys will be deallocated from memory after the transaction is executed
* @param join_proving_key (optional) Provide a proving key to use for the join function
* @param join_verifying_key (optional) Provide a verifying key to use for the join function
* @param fee_proving_key (optional) Provide a proving key to use for the fee execution
* @param fee_verifying_key (optional) Provide a verifying key to use for the fee execution
* @param {PrivateKey} private_key
* @param {RecordPlaintext} record_1
* @param {RecordPlaintext} record_2
* @param {number} fee_credits
* @param {RecordPlaintext} fee_record
* @param {string} url
* @param {boolean} cache
* @param {ProvingKey | undefined} join_proving_key
* @param {VerifyingKey | undefined} join_verifying_key
* @param {ProvingKey | undefined} fee_proving_key
* @param {VerifyingKey | undefined} fee_verifying_key
* @returns {Promise<Transaction>}
*/
  join(private_key: PrivateKey, record_1: RecordPlaintext, record_2: RecordPlaintext, fee_credits: number, fee_record: RecordPlaintext, url: string, cache: boolean, join_proving_key?: ProvingKey, join_verifying_key?: VerifyingKey, fee_proving_key?: ProvingKey, fee_verifying_key?: VerifyingKey): Promise<Transaction>;
/**
*/
  constructor();
/**
* Cache the proving and verifying keys for a program function in WASM memory. This method
* will take a verifying and proving key and store them in the program manager's internal
* in-memory cache. This memory is allocated in WebAssembly, so it is important to be mindful
* of the amount of memory being used. This method will return an error if the keys are already
* cached in memory.
*
* @param program_id The name of the program containing the desired function
* @param function The name of the function to store the keys for
* @param proving_key The proving key of the function
* @param verifying_key The verifying key of the function
* @param {string} program
* @param {string} _function
* @param {ProvingKey} proving_key
* @param {VerifyingKey} verifying_key
*/
  cacheKeypairInWasmMemory(program: string, _function: string, proving_key: ProvingKey, verifying_key: VerifyingKey): void;
/**
* Get the proving & verifying keys cached in WASM memory for a specific function
*
* @param program_id The name of the program containing the desired function
* @param function_id The name of the function to retrieve the keys for
* @param {string} program_id
* @param {string} _function
* @returns {KeyPair}
*/
  getCachedKeypair(program_id: string, _function: string): KeyPair;
/**
* Synthesize a proving and verifying key for a program function. This method should be used
* when there is a need to pre-synthesize keys (i.e. for caching purposes, etc.)
*
* @param program The source code of the program containing the desired function
* @param function The name of the function to synthesize the key for
* @param {string} program
* @param {string} _function
* @returns {KeyPair}
*/
  synthesizeKeypair(program: string, _function: string): KeyPair;
/**
* Clear key cache in wasm memory.
*
* This method will clear the key cache in wasm memory. It is important to note that this will
* not DE-allocate the memory assigned to wasm as wasm memory cannot be shrunk. The total
* memory allocated to wasm will remain constant but will be available for other usage after
* calling this method.
*/
  clearKeyCache(): void;
/**
* Check if the cache contains a keypair for a specific function
*
* @param program_id The name of the program containing the desired function
* @param function_id The name of the function to retrieve the keys for
* @param {string} program_id
* @param {string} function_id
* @returns {boolean}
*/
  keyExists(program_id: string, function_id: string): boolean;
/**
* Split an Aleo credits record into two separate records. This function does not require a fee.
*
* @param private_key The private key of the sender
* @param split_amount The amount of the credit split. This amount will be subtracted from the
* value of the record and two new records will be created with the split amount and the remainder
* @param amount_record The record to split
* @param url The url of the Aleo network node to send the transaction to
* @param cache Cache the proving and verifying keys in the ProgramManager memory. If this is
* set to `true` the keys synthesized (or passed in as optional parameters via the
* `split_proving_key` and `split_verifying_key` arguments) will be stored in the
* ProgramManager's memory and used for subsequent transactions. If this is set to `false` the
* proving and verifying keys will be deallocated from memory after the transaction is executed
* @param split_proving_key (optional) Provide a proving key to use for the split function
* @param split_verifying_key (optional) Provide a verifying key to use for the split function
* @param {PrivateKey} private_key
* @param {number} split_amount
* @param {RecordPlaintext} amount_record
* @param {string} url
* @param {boolean} cache
* @param {ProvingKey | undefined} split_proving_key
* @param {VerifyingKey | undefined} split_verifying_key
* @returns {Promise<Transaction>}
*/
  split(private_key: PrivateKey, split_amount: number, amount_record: RecordPlaintext, url: string, cache: boolean, split_proving_key?: ProvingKey, split_verifying_key?: VerifyingKey): Promise<Transaction>;
/**
* Deploy an Aleo program
*
* @param private_key The private key of the sender
* @param program The source code of the program being deployed
* @param imports A javascript object holding the source code of any imported programs in the
* form {"program_name1": "program_source_code", "program_name2": "program_source_code", ..}.
* Note that all imported programs must be deployed on chain before the main program in order
* for the deployment to succeed
* @param fee_credits The amount of credits to pay as a fee
* @param fee_record The record to spend the fee from
* @param url The url of the Aleo network node to send the transaction to
* @param cache Cache the synthesized keys for future use
* @param imports (optional) Provide a list of imports to use for the program deployment in the
* form of a javascript object where the keys are a string of the program name and the values
* are a string representing the program source code { "hello.aleo": "hello.aleo source code" }
* @param fee_proving_key (optional) Provide a proving key to use for the fee execution
* @param fee_verifying_key (optional) Provide a verifying key to use for the fee execution
* @param {PrivateKey} private_key
* @param {string} program
* @param {number} fee_credits
* @param {RecordPlaintext} fee_record
* @param {string} url
* @param {boolean} cache
* @param {object | undefined} imports
* @param {ProvingKey | undefined} fee_proving_key
* @param {VerifyingKey | undefined} fee_verifying_key
* @returns {Promise<Transaction>}
*/
  deploy(private_key: PrivateKey, program: string, fee_credits: number, fee_record: RecordPlaintext, url: string, cache: boolean, imports?: object, fee_proving_key?: ProvingKey, fee_verifying_key?: VerifyingKey): Promise<Transaction>;
/**
* Estimate the fee for a program deployment
*
* Disclaimer: Fee estimation is experimental and may not represent a correct estimate on any current or future network
*
* @param program The source code of the program being deployed
* @param cache Cache the synthesized keys for future use
* @param imports (optional) Provide a list of imports to use for the deployment fee estimation
* in the form of a javascript object where the keys are a string of the program name and the values
* are a string representing the program source code { "hello.aleo": "hello.aleo source code" }
* @param {string} program
* @param {boolean} cache
* @param {object | undefined} imports
* @returns {Promise<bigint>}
*/
  estimateDeploymentFee(program: string, cache: boolean, imports?: object): Promise<bigint>;
/**
* Estimate the component of the deployment cost which comes from the fee for the program name.
* Note that this cost does not represent the entire cost of deployment. It is additional to
* the cost of the size (in bytes) of the deployment.
*
* Disclaimer: Fee estimation is experimental and may not represent a correct estimate on any current or future network
*
* @param name The name of the program to be deployed
* @param {string} name
* @returns {bigint}
*/
  estimateProgramNameCost(name: string): bigint;
}
/**
*/
export class ProvingKey {
  free(): void;
/**
* Construct a new proving key from a byte array
* @param {Uint8Array} bytes
* @returns {ProvingKey}
*/
  static fromBytes(bytes: Uint8Array): ProvingKey;
/**
* Create a byte array from a proving key
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
}
/**
* Encrypted Aleo record
*/
export class RecordCiphertext {
  free(): void;
/**
* Return a record ciphertext from a string.
* @param {string} record
* @returns {RecordCiphertext}
*/
  static fromString(record: string): RecordCiphertext;
/**
* Return the record ciphertext string.
* @returns {string}
*/
  toString(): string;
/**
* Decrypt the record ciphertext into plaintext using the view key.
* @param {ViewKey} view_key
* @returns {RecordPlaintext}
*/
  decrypt(view_key: ViewKey): RecordPlaintext;
/**
* Returns `true` if the view key can decrypt the record ciphertext.
* @param {ViewKey} view_key
* @returns {boolean}
*/
  isOwner(view_key: ViewKey): boolean;
}
/**
* Aleo record plaintext
*/
export class RecordPlaintext {
  free(): void;
/**
* Return a record plaintext from a string.
* @param {string} record
* @returns {RecordPlaintext}
*/
  static fromString(record: string): RecordPlaintext;
/**
* Returns the record plaintext string
* @returns {string}
*/
  toString(): string;
/**
* Returns the amount of microcredits in the record
* @returns {bigint}
*/
  microcredits(): bigint;
/**
* Attempt to get the serial number of a record to determine whether or not is has been spent
* @param {PrivateKey} private_key
* @param {string} program_id
* @param {string} record_name
* @returns {string}
*/
  serialNumberString(private_key: PrivateKey, program_id: string, record_name: string): string;
}
/**
*/
export class Signature {
  free(): void;
/**
* @param {PrivateKey} private_key
* @param {Uint8Array} message
* @returns {Signature}
*/
  static sign(private_key: PrivateKey, message: Uint8Array): Signature;
/**
* @param {Address} address
* @param {Uint8Array} message
* @returns {boolean}
*/
  verify(address: Address, message: Uint8Array): boolean;
/**
* @param {string} signature
* @returns {Signature}
*/
  static from_string(signature: string): Signature;
/**
* @returns {string}
*/
  to_string(): string;
}
/**
* Webassembly Representation of an Aleo transaction
*
* This object is created when generating an on-chain function deployment or execution and is the
* object that should be submitted to the Aleo Network in order to deploy or execute a function.
*/
export class Transaction {
  free(): void;
/**
* Create a transaction from a string
* @param {string} transaction
* @returns {Transaction}
*/
  static fromString(transaction: string): Transaction;
/**
* Get the transaction as a string. If you want to submit this transaction to the Aleo Network
* this function will create the string that should be submitted in the `POST` data.
* @returns {string}
*/
  toString(): string;
/**
* Get the id of the transaction. This is the merkle root of the transaction's inclusion proof.
*
* This value can be used to query the status of the transaction on the Aleo Network to see
* if it was successful. If successful, the transaction will be included in a block and this
* value can be used to lookup the transaction data on-chain.
* @returns {string}
*/
  transactionId(): string;
/**
* Get the type of the transaction (will return "deploy" or "execute")
* @returns {string}
*/
  transactionType(): string;
}
/**
*/
export class VerifyingKey {
  free(): void;
/**
* Construct a new verifying key from a byte array
* @param {Uint8Array} bytes
* @returns {VerifyingKey}
*/
  static fromBytes(bytes: Uint8Array): VerifyingKey;
/**
* Create a byte array from a verifying key
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
}
/**
*/
export class ViewKey {
  free(): void;
/**
* @param {PrivateKey} private_key
* @returns {ViewKey}
*/
  static from_private_key(private_key: PrivateKey): ViewKey;
/**
* @param {string} view_key
* @returns {ViewKey}
*/
  static from_string(view_key: string): ViewKey;
/**
* @returns {string}
*/
  to_string(): string;
/**
* @returns {Address}
*/
  to_address(): Address;
/**
* @param {string} ciphertext
* @returns {string}
*/
  decrypt(ciphertext: string): string;
}
/**
*/
export class wbg_rayon_PoolBuilder {
  free(): void;
/**
* @returns {number}
*/
  numThreads(): number;
/**
* @returns {number}
*/
  receiver(): number;
/**
*/
  build(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly programmanager_execute_local: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
  readonly programmanager_execute: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number) => number;
  readonly programmanager_estimateExecutionFee: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => number;
  readonly programmanager_estimateFinalizeFee: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbg_verifyingkey_free: (a: number) => void;
  readonly verifyingkey_fromBytes: (a: number, b: number, c: number) => void;
  readonly verifyingkey_toBytes: (a: number, b: number) => void;
  readonly __wbg_address_free: (a: number) => void;
  readonly address_from_private_key: (a: number) => number;
  readonly address_from_view_key: (a: number) => number;
  readonly address_from_string: (a: number, b: number) => number;
  readonly address_to_string: (a: number, b: number) => void;
  readonly address_verify: (a: number, b: number, c: number, d: number) => number;
  readonly programmanager_transfer: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number) => number;
  readonly programmanager_join: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => number;
  readonly __wbg_recordplaintext_free: (a: number) => void;
  readonly recordplaintext_fromString: (a: number, b: number, c: number) => void;
  readonly recordplaintext_toString: (a: number, b: number) => void;
  readonly recordplaintext_microcredits: (a: number) => number;
  readonly recordplaintext_serialNumberString: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly __wbg_provingkey_free: (a: number) => void;
  readonly provingkey_fromBytes: (a: number, b: number, c: number) => void;
  readonly provingkey_toBytes: (a: number, b: number) => void;
  readonly __wbg_keypair_free: (a: number) => void;
  readonly keypair_new: (a: number, b: number) => number;
  readonly keypair_provingKey: (a: number, b: number) => void;
  readonly keypair_verifyingKey: (a: number, b: number) => void;
  readonly __wbg_privatekey_free: (a: number) => void;
  readonly privatekey_new: () => number;
  readonly privatekey_from_seed_unchecked: (a: number, b: number) => number;
  readonly privatekey_from_string: (a: number, b: number, c: number) => void;
  readonly privatekey_to_string: (a: number, b: number) => void;
  readonly privatekey_to_view_key: (a: number) => number;
  readonly privatekey_to_address: (a: number) => number;
  readonly privatekey_sign: (a: number, b: number, c: number) => number;
  readonly privatekey_newEncrypted: (a: number, b: number, c: number) => void;
  readonly privatekey_toCiphertext: (a: number, b: number, c: number, d: number) => void;
  readonly privatekey_fromPrivateKeyCiphertext: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_program_free: (a: number) => void;
  readonly program_fromString: (a: number, b: number, c: number) => void;
  readonly program_toString: (a: number, b: number) => void;
  readonly program_getFunctions: (a: number) => number;
  readonly program_getFunctionInputs: (a: number, b: number, c: number, d: number) => void;
  readonly program_getMappings: (a: number, b: number) => void;
  readonly program_getRecordMembers: (a: number, b: number, c: number, d: number) => void;
  readonly program_getStructMembers: (a: number, b: number, c: number, d: number) => void;
  readonly program_getCreditsProgram: () => number;
  readonly program_id: (a: number, b: number) => void;
  readonly program_isEqual: (a: number, b: number) => number;
  readonly program_getImports: (a: number) => number;
  readonly __wbg_transaction_free: (a: number) => void;
  readonly transaction_fromString: (a: number, b: number, c: number) => void;
  readonly transaction_toString: (a: number, b: number) => void;
  readonly transaction_transactionId: (a: number, b: number) => void;
  readonly transaction_transactionType: (a: number, b: number) => void;
  readonly __wbg_privatekeyciphertext_free: (a: number) => void;
  readonly privatekeyciphertext_encryptPrivateKey: (a: number, b: number, c: number, d: number) => void;
  readonly privatekeyciphertext_decryptToPrivateKey: (a: number, b: number, c: number, d: number) => void;
  readonly privatekeyciphertext_toString: (a: number, b: number) => void;
  readonly privatekeyciphertext_fromString: (a: number, b: number, c: number) => void;
  readonly __wbg_programmanager_free: (a: number) => void;
  readonly programmanager_new: () => number;
  readonly programmanager_cacheKeypairInWasmMemory: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly programmanager_getCachedKeypair: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly programmanager_synthesizeKeypair: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly programmanager_clearKeyCache: (a: number) => void;
  readonly programmanager_keyExists: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbg_signature_free: (a: number) => void;
  readonly signature_sign: (a: number, b: number, c: number) => number;
  readonly signature_verify: (a: number, b: number, c: number, d: number) => number;
  readonly signature_from_string: (a: number, b: number) => number;
  readonly signature_to_string: (a: number, b: number) => void;
  readonly programmanager_split: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly __wbg_viewkey_free: (a: number) => void;
  readonly viewkey_from_private_key: (a: number) => number;
  readonly viewkey_from_string: (a: number, b: number) => number;
  readonly viewkey_to_string: (a: number, b: number) => void;
  readonly viewkey_to_address: (a: number) => number;
  readonly viewkey_decrypt: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_recordciphertext_free: (a: number) => void;
  readonly recordciphertext_fromString: (a: number, b: number, c: number) => void;
  readonly recordciphertext_toString: (a: number, b: number) => void;
  readonly recordciphertext_decrypt: (a: number, b: number, c: number) => void;
  readonly recordciphertext_isOwner: (a: number, b: number) => number;
  readonly programmanager_deploy: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => number;
  readonly programmanager_estimateDeploymentFee: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly programmanager_estimateProgramNameCost: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_executionresponse_free: (a: number) => void;
  readonly executionresponse_getOutputs: (a: number) => number;
  readonly __wbg_wbg_rayon_poolbuilder_free: (a: number) => void;
  readonly wbg_rayon_poolbuilder_numThreads: (a: number) => number;
  readonly wbg_rayon_poolbuilder_receiver: (a: number) => number;
  readonly wbg_rayon_poolbuilder_build: (a: number) => void;
  readonly wbg_rayon_start_worker: (a: number) => void;
  readonly initThreadPool: (a: number) => number;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h2da4142fc877add4: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h2a17a0354144b786: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_thread_destroy: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
