// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./LoanBase.sol";

contract BankLoanManagement is LoanBase, ILoanApplication, ILoanApproval, ILoanRepayment, ILoanCollateral,IDisburseLoan {
    uint256 public constant COLLATERAL_RATIO = 200; 
    event EtherReceived(address indexed sender, uint256 amount);

    constructor() LoanBase() {}

    // ILoanApplication
    function applyForLoan(uint256 amount, uint256 duration) external override returns(uint256) {
        require(amount > 0, "Loan amount must be greater than 0");
        require(duration > 0, "Loan duration must be greater than 0");
        uint256 loanId= _createLoan(msg.sender, amount, duration);
		emit LoanApplicationSubmitted(loanId, msg.sender, amount, duration);
		return loanId;
		
		
    }

   function cancelApplication(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.borrower, "Only the borrower can cancel this loan");
        require(loan.status == LoanStatus.Applied, "You can't cancel an already active loan");
        loan.status = LoanStatus.Cancelled;
        emit ApplicationCancelled(loanId);
    }

    // ILoanApproval
    function approveLoan(uint256 loanId) external override onlyOwner {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Applied, "Loan is not in applied status");

        loan.status = LoanStatus.Approved;
        emit LoanApproved(loanId);
    }

    function rejectLoan(uint256 loanId) external override onlyOwner {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Applied, "Loan is not in applied status");

        loan.status = LoanStatus.Defaulted;
        emit LoanRejected(loanId);
    }

    // ILoanRepayment
    function makeRepayment(uint256 loanId) external payable nonReentrant override {
    Loan storage loan = loans[loanId];
    require(loan.status == LoanStatus.Active, "Loan is not active");
    require(msg.sender == loan.borrower, "Only borrower can make repayments");

    uint256 totalDue = _calculateTotalDue(loanId);
    require(msg.value <= totalDue, "Repayment amount exceeds total due");

    loan.repaidAmount += msg.value;

    if (loan.repaidAmount >= totalDue) {
        loan.status = LoanStatus.Completed;
        _withdrawCollateral(loanId);
      
    } else {
        loan.nextRepaymentDate = block.timestamp + 30 days;
    }

    emit RepaymentMade(loanId, msg.value);
}

    // ILoanCollateral
   function depositCollateral(uint256 loanId) external payable {
    Loan storage loan = loans[loanId];

    require(loan.status == LoanStatus.Approved, "Loan must be approved");
    require(msg.sender == loan.borrower, "Only borrower can deposit collateral");

    uint256 requiredCollateral = (loan.amount * COLLATERAL_RATIO) / 100;
    require(msg.value >= requiredCollateral, "Insufficient collateral");

    loan.collateralAmount += msg.value;  // Accumulate collateral
    loan.status = LoanStatus.Active;
    loan.nextRepaymentDate = block.timestamp + 30 days;

    emit CollateralDeposited(loanId, msg.value);
}

// New function to disburse the loan amount
function disburseLoan(uint256 loanId) external onlyOwner {
    Loan storage loan = loans[loanId];
    require(loan.status == LoanStatus.Active, "Loan must be active");

    // Transfer the loan amount to the borrower
    payable(loan.borrower).transfer(loan.amount);
    loan.status = LoanStatus.Active; // Ensure status reflects the active loan
    emit LoanDisbursed(loanId, loan.amount);
}



  function withdrawCollateral(uint256 loanId) external nonReentrant {
    Loan storage loan = loans[loanId];
    require(msg.sender == loan.borrower, "Only borrower can withdraw collateral");
    require(loan.status == LoanStatus.Completed, "Loan must be completed to perform Collateral withdraw");
    
    _withdrawCollateral(loanId);
}

    // Internal functions
    function _calculateInterestRate(uint256 amount, uint256 duration) internal pure override returns (uint256) {
       
        return 5 + (amount / 1e18) + (duration / 365 days);
    }

    function _calculateTotalDue(uint256 loanId) public view returns (uint256) {
        Loan storage loan = loans[loanId];
        uint256 interest = (loan.amount * loan.interestRate * loan.duration) / (365 days * 100);
        return loan.amount + interest;
    }

   function _withdrawCollateral(uint256 loanId) internal {
    Loan storage loan = loans[loanId];
    uint256 collateralAmount = loan.collateralAmount;
    
    require(collateralAmount > 0, "No collateral to withdraw");
    require(address(this).balance >= collateralAmount, "Insufficient contract balance");
     uint256 amountToSend = collateralAmount;
    

    // Attempt to send the stored amount
    (bool sent, ) = payable(loan.borrower).call{value: amountToSend}("");
    require(sent, "Failed to send Ether");

    emit CollateralWithdrawn(loanId, amountToSend);
   }

   
}