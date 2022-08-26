import { ethers } from "hardhat";

const contractAddress = "0x2ADb5ecbfd7fc56BC5Fa7fB4e83b3c27d49E07AB";

async function main() {
  let contract;

  const [signer] = await ethers.getSigners();

  const infoAbi = ["function info() pure returns (string)"];
  contract = new ethers.Contract(contractAddress, infoAbi, signer);
  const info = await contract.info();
  console.log(info);

  const info1Abi = ["function info1() pure returns (string)"];
  contract = new ethers.Contract(contractAddress, info1Abi, signer);
  const info1 = await contract.info1();
  console.log(info1);

  const info2Abi = ["function info2(string) pure returns (string)"];
  contract = new ethers.Contract(contractAddress, info2Abi, signer);
  const info2 = await contract.info2("hello");
  console.log(info2);

  const infoNumAbi = ["function infoNum() pure returns (uint)"];
  contract = new ethers.Contract(contractAddress, infoNumAbi, signer);
  const infoNum = await contract.infoNum();
  console.log(infoNum);

  const info42Abi = ["function info42() pure returns (string)"];
  contract = new ethers.Contract(contractAddress, info42Abi, signer);
  const info42 = await contract.info42();
  console.log(info42);

  const theMethodNameAbi = ["function theMethodName() pure returns (string)"];
  contract = new ethers.Contract(contractAddress, theMethodNameAbi, signer);
  const theMethodName = await contract.theMethodName();
  console.log(theMethodName);

  const method7123949Abi = ["function method7123949() pure returns (string)"];
  contract = new ethers.Contract(contractAddress, method7123949Abi, signer);
  const method7123949 = await contract.method7123949();
  console.log(method7123949);

  const passwordAbi = ["function password() pure returns (string)"];
  contract = new ethers.Contract(contractAddress, passwordAbi, signer);
  const password = await contract.password();
  console.log(password);

  const authenticateAbi = ["function authenticate(string)"];
  contract = new ethers.Contract(contractAddress, authenticateAbi, signer);
  const authenticate = await contract.authenticate(password);
  await authenticate.wait();
  console.log("challenge solved!");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
