# Bank Loan Management Smart Contract

This project implements a Bank Loan Management system using Ethereum smart contracts. It allows users to apply for loans, deposit collateral, make repayments, and withdraw collateral upon successful loan completion.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Smart Contract Overview](#smart-contract-overview)
6. [Testing](#testing)
7. [Security Considerations](#security-considerations)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- Loan application
- Loan approval by contract owner
- Collateral deposit
- Loan repayment
- Collateral withdrawal
- Loan cancellation

## Prerequisites

- Node.js v12.0.0 
- Truffle v5.0.11
- Ganache (for local blockchain)

## Installation

1. Clone the repository:
"bash
 
 git clone https://github.com/Skaltuch/Ether-Bank.git
 
cd bank-loan-management
2. Install dependencies:
## Usage

### Compile Contracts
truffle compile
### Run Tests
truffle test
### Deploy to Local Blockchain

1. Start Ganache
2. Run migrations:

 truffle migrate

## Smart Contract Overview

The main contract is `BankLoanManagement.sol`, which includes the following key functions:

- `applyForLoan(uint256 amount, uint256 duration)`: Allows a user to apply for a loan
- `approveLoan(uint256 loanId)`: Allows the contract owner to approve a loan
- `depositCollateral(uint256 loanId)`: Allows the borrower to deposit collateral
- `makeRepayment(uint256 loanId)`: Allows the borrower to make loan repayments
- `withdrawCollateral(uint256 loanId)`: Allows the borrower to withdraw collateral after loan completion
- `cancelLoan(uint256 loanId)`: Allows the borrower to cancel a loan application

### Loan States

Loans can be in the following states:

1. `Pending`: Initial state when a loan is applied for
2. `Approved`: After the owner approves the loan
3. `Active`: When collateral is deposited
4. `Completed`: When the loan is fully repaid
5. `Cancelled`: If the borrower cancels the loan application

## Testing

The project includes comprehensive tests for all main functionalities. The test file `BankLoanManagement.test.js` covers the following scenarios:

1. Loan Application
- Successful loan application
- Preventing zero amount loan applications

2. Loan Approval
- Owner approving a loan
- Preventing non-owners from approving loans

3. Collateral Deposit
- Successful collateral deposit
- Preventing insufficient collateral deposits

4. Loan Repayment
- Successful loan repayment
- Preventing overpayment

5. Collateral Withdrawal
- Successful collateral withdrawal after full repayment
- Preventing premature collateral withdrawal

6. Loan Cancellation
- Successful loan cancellation
- Preventing cancellation of approved loans

Run the tests using:
truffle test
## Security Considerations
- The contract uses  `ReentrancyGuard` to prevent reentrancy attacks
- Access control is implemented to ensure only authorized users can perform certain actions
- The `withdrawCollateral` function ensures that the collateral amount is only set to zero after a successful transfer
## Contributing  
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
----------------

For any questions or support, please open an issue in the GitHub repository.
   
