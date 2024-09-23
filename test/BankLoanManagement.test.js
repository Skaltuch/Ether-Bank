const BankLoanManagement = artifacts.require("BankLoanManagement");
import { expect } from "chai";
const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');

contract("BankLoanManagement", function (accounts) {
    const [owner, borrower1, borrower2] = accounts;
    let bankLoanManagement;

    const loanAmount = new BN(web3.utils.toWei("1", "ether"));
    const loanDuration = new BN(time.duration.days(30));
    const collateralAmount = new BN(web3.utils.toWei("2", "ether"));

    beforeEach(async function () {
        bankLoanManagement = await BankLoanManagement.new({ from: owner });
    });

    describe("Loan Application", function () {
        it("should allow a borrower to apply for a loan", async function () {
            const tx = await bankLoanManagement.applyForLoan(loanAmount, loanDuration, { from: borrower1 });
            expectEvent(tx, "LoanCreated", { borrower: borrower1 });
        });

        it("should not allow applying for a loan with zero amount", async function () {
            await expectRevert(
                bankLoanManagement.applyForLoan(0, loanDuration, { from: borrower1 }),
                "Loan amount must be greater than 0"
            );
        });
    });

    describe("Loan Approval", function () {
        let loanId;

        beforeEach(async function () {
            const tx = await bankLoanManagement.applyForLoan(loanAmount, loanDuration, { from: borrower1 });
            loanId = tx.logs[0].args.loanId;
        });

        it("should allow the owner to approve a loan", async function () {
            const tx = await bankLoanManagement.approveLoan(loanId, { from: owner });
            expectEvent(tx, "LoanApproved", { loanId: loanId });
        });

        it("should not allow non-owners to approve a loan", async function () {
            await expectRevert(
                bankLoanManagement.approveLoan(loanId, { from: borrower1 }),
                "Ownable: caller is not the owner"
            );
        });
    });

    describe("Collateral Deposit", function () {
        let loanId;

        beforeEach(async function () {
            const tx = await bankLoanManagement.applyForLoan(loanAmount, loanDuration, { from: borrower1 });
            loanId = tx.logs[0].args.loanId;
            await bankLoanManagement.approveLoan(loanId, { from: owner });
        });

        it("should allow the borrower to deposit collateral", async function () {
            const tx = await bankLoanManagement.depositCollateral(loanId, { from: borrower1, value: collateralAmount });
            expectEvent(tx, "CollateralDeposited", { loanId: loanId, amount: collateralAmount });
        });

        it("should not allow insufficient collateral", async function () {
            const insufficientCollateral = collateralAmount.div(new BN(4));
            await expectRevert(
                bankLoanManagement.depositCollateral(loanId, { from: borrower1, value: insufficientCollateral }),
                "Insufficient collateral"
            );
        });
    });

    describe("Loan Repayment", function () {
        let loanId;

        beforeEach(async function () {
            const tx = await bankLoanManagement.applyForLoan(loanAmount, loanDuration, { from: borrower1 });
            loanId = tx.logs[0].args.loanId;
            await bankLoanManagement.approveLoan(loanId, { from: owner });
            await bankLoanManagement.depositCollateral(loanId, { from: borrower1, value: collateralAmount });
        });

        it("should allow the borrower to make a repayment", async function () {
            const repaymentAmount = loanAmount.div(new BN(2));
            const tx = await bankLoanManagement.makeRepayment(loanId, { from: borrower1, value: repaymentAmount });
            expectEvent(tx, "RepaymentMade", { loanId: loanId, amount: repaymentAmount });
        });

        it("should not allow repayment more than the total due", async function () {
            const totalDue = await bankLoanManagement._calculateTotalDue(loanId);
            const excessiveRepayment = totalDue.add(new BN(1));
            await expectRevert(
                bankLoanManagement.makeRepayment(loanId, { from: borrower1, value: excessiveRepayment }),
                "Repayment amount exceeds total due"
            );
        });
    });
     it("should change loan status to Completed after full repayment", async function () {
        const totalDue = await bankLoanManagement._calculateTotalDue(loanId);
        await bankLoanManagement.makeRepayment(loanId, { from: borrower1, value: totalDue });

        const loan = await bankLoanManagement.loans(loanId);
        expect(loan.status.toString()).to.equal('3'); // 3 represents LoanStatus.Completed
    });

     describe("Collateral Withdrawal", function () {
    let loanId;

    beforeEach(async function () {
      const tx = await bankLoanManagement.applyForLoan(loanAmount, loanDuration, { from: borrower1 });
      loanId = tx.logs[0].args.loanId;
      await bankLoanManagement.approveLoan(loanId, { from: owner });
      await bankLoanManagement.depositCollateral(loanId, { from: borrower1, value: collateralAmount });
    });

     it("should allow the borrower to withdraw collateral after full repayment", async function () {
         let loanId;
        const totalDue = await bankLoanManagement._calculateTotalDue(loanId);
        await bankLoanManagement.makeRepayment(loanId, { from: borrower1, value: totalDue });

        const borrowerBalanceBefore = new BN(await web3.eth.getBalance(borrower1));
        const contractBalanceBefore = new BN(await web3.eth.getBalance(bankLoanManagement.address));

        const tx = await bankLoanManagement.withdrawCollateral(loanId, { from: borrower1 });
        
        const borrowerBalanceAfter = new BN(await web3.eth.getBalance(borrower1));
        const contractBalanceAfter = new BN(await web3.eth.getBalance(bankLoanManagement.address));

        const gasUsed = new BN(tx.receipt.gasUsed);
        const gasPrice = new BN(await web3.eth.getGasPrice());
        const gasCost = gasUsed.mul(gasPrice);

        const expectedBalance = borrowerBalanceBefore.add(collateralAmount).sub(gasCost);

        expect(borrowerBalanceAfter).to.be.bignumber.closeTo(expectedBalance, new BN(web3.utils.toWei('0.01', 'ether')));
        expect(contractBalanceAfter).to.be.bignumber.equal(contractBalanceBefore.sub(collateralAmount));
        expectEvent(tx, "CollateralWithdrawn", { loanId: loanId, amount: collateralAmount });
    });

    it("should not allow collateral withdrawal before loan completion", async function () {
      await expectRevert(
        bankLoanManagement.withdrawCollateral(loanId, { from: borrower1 }),
        "Loan must be completed to perform Collateral withdraw"
      );
    });
  });

    
});
