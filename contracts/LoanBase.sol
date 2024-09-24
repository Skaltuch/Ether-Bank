// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Interfaces 

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface ILoanApplication {
    function applyForLoan(uint256 amount, uint256 duration) external returns(uint256);
    function cancelApplication(uint256 loanId) external;
}

interface ILoanApproval {
    function approveLoan(uint256 loanId) external;
    function rejectLoan(uint256 loanId) external;
}

interface ILoanRepayment {
    function makeRepayment(uint256 loanId) external payable;
}

interface ILoanCollateral {
    function depositCollateral(uint256 loanId) external payable;
    function withdrawCollateral(uint256 loanId) external;
}
interface IDisburseLoan{
    function disburseLoan(uint256 loanId) external ;
}

// Abstract contracts

abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

abstract contract LoanBase is Ownable, ReentrancyGuard {
    enum LoanStatus { Applied, Approved,Active, Completed, Defaulted,Cancelled }

    struct Loan {
        address borrower;
        uint256 amount;
        uint256 duration;
        uint256 interestRate;
        uint256 collateralAmount;
        uint256 repaidAmount;
        uint256 nextRepaymentDate;
        LoanStatus status;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public nextLoanId;

    IERC20 public loanToken;

    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanApproved(uint256 indexed loanId);
    event ApplicationCancelled(uint256 indexed loanId);
    event LoanDisbursed(uint256 indexed loanId, uint256 amount);
    event LoanRejected(uint256 indexed loanId);
    event RepaymentMade(uint256 indexed loanId, uint256 amount);
    event CollateralDeposited(uint256 indexed loanId, uint256 amount);
    event CollateralWithdrawn(uint256 indexed loanId, uint256 amount);
	event LoanApplicationSubmitted(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 duration);

    constructor()  Ownable() ReentrancyGuard() {}

    function _createLoan(address borrower, uint256 amount, uint256 duration) internal returns (uint256) {
        uint256 loanId = nextLoanId++;
        loans[loanId] = Loan({
            borrower: borrower,
            amount: amount,
            duration: duration,
            interestRate: _calculateInterestRate(amount, duration),
            collateralAmount: 0,
            repaidAmount: 0,
            nextRepaymentDate: 0,
            status: LoanStatus.Applied
        });

        emit LoanCreated(loanId, borrower, amount);
        return loanId;
    }

    function _calculateInterestRate(uint256 amount, uint256 duration) internal pure virtual returns (uint256);
}