const BankLoanManagement = artifacts.require("BankLoanManagement");

module.exports = async function(deployer, network, accounts) {
  // Use the first account as the deployer
  const deployerAccount = accounts[0];

  console.log(`Deploying from account: ${deployerAccount}`);

  // Deploy BankLoanManagement
  await deployer.deploy(BankLoanManagement, { from: deployerAccount });
  
  const bankLoanManagement = await BankLoanManagement.deployed();

  console.log(`BankLoanManagement deployed at: ${bankLoanManagement.address}`);

  
    const newOwner = accounts[1];
    await bankLoanManagement.transferOwnership(newOwner, { from: deployerAccount });
    console.log(`Ownership transferred to: ${newOwner}`);
};
