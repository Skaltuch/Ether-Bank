let web3;
let account;
let bankLoanContract;
const contractAddress = '0xe7110Ad3d4f991E9EF6C06eCc468e9D0AA5Cf3b0'; //  deployed contract address
const bankLoanABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "ApplicationCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "CollateralDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "CollateralWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "EtherReceived",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "LoanApplicationSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "LoanApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "LoanCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "LoanDisbursed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "LoanRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RepaymentMade",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "COLLATERAL_RATIO",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "loanToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "loans",
      "outputs": [
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestRate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "collateralAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "repaidAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nextRepaymentDate",
          "type": "uint256"
        },
        {
          "internalType": "enum LoanBase.LoanStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "nextLoanId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "applyForLoan",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "cancelApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "approveLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "rejectLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "makeRepayment",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "depositCollateral",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "disburseLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "withdrawCollateral",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "_calculateTotalDue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];


async function init() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                account = accounts[0];
                bankLoanContract = new web3.eth.Contract(bankLoanABI, contractAddress);
                updateUI();
               updateEtherBalance();
            }
        } catch (error) {
            console.error("Failed to load web3, accounts, or contract:", error);
            showNotification('Failed to load web3, accounts, or contract. Check console for details.', 'error');
        }
    } else {
        console.error('MetaMask is not installed');
        showNotification('MetaMask is not installed. Please install it to continue', 'error');
    }
}


function updateUI() {
    const connectedAccountElement = document.getElementById('connectedAccount');
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    const connectButton = document.getElementById('connectButton');
    const refreshButton = document.getElementById('refreshBalanceBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const balanceElement = document.getElementById('etherBalance');

    if (account) {
        const truncatedAddress = `${account.slice(0, 6)}...${account.slice(-4)}`;
        connectedAccountElement.innerText = truncatedAddress;
        copyAddressBtn.style.display = 'inline-block';
        connectButton.style.display = 'none';
        refreshButton.style.display = 'inline-block';
        
        // Update connection status icon
        connectionStatus.classList.remove('disconnected');
        connectionStatus.classList.add('connected');
        
        // Set up the copy address functionality
        copyAddressBtn.onclick = () => copyToClipboard(account);
        
        // Update the Ether balance
        updateEtherBalance();
    } else {
        connectedAccountElement.innerText = 'Not connected';
        copyAddressBtn.style.display = 'none';
        connectButton.style.display = 'inline-block';
        refreshButton.style.display = 'none';
        
        // Update connection status icon
        connectionStatus.classList.remove('connected');
        connectionStatus.classList.add('disconnected');
        
        // Reset Ether balance display when not connected
        balanceElement.innerText = '0';
    }
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Function to update Ether balance
async function updateEtherBalance() {
    if (account && web3) {
        try {
            const balance = await web3.eth.getBalance(account);
            const etherBalance = web3.utils.fromWei(balance, 'ether');
            document.getElementById('etherBalance').innerText = parseFloat(etherBalance).toFixed(4);
        } catch (error) {
            console.error('Error fetching balance:', error);
            document.getElementById('etherBalance').innerText = 'Error';
        }
    }
}
function showNotification(message, type = 'info',duration=3000) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.error('Notification container not found');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    icon.className = getIconClass(type);
    
    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    notification.appendChild(icon);
    notification.appendChild(textSpan);
    notificationContainer.appendChild(notification);

    // Use setTimeout to ensure the transition works
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        },500);
    }, duration);
}

function getIconClass(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
}

// The rest of your JavaScript remains the same

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Address copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy address: ', err);
        showNotification('Failed to copy address. Please try again.', 'error');
    });
}
async function updateEtherBalance() {
    const balanceElement = document.getElementById('etherBalance'); // Change here
    const refreshButton = document.getElementById('refreshBalanceBtn');

    refreshButton.disabled = true;
    balanceElement.innerHTML = 'Updating...';

    try {
        const balance = await web3.eth.getBalance(account);
        const formattedBalance = web3.utils.fromWei(balance, 'ether');

        balanceElement.style.opacity = '0';
        setTimeout(() => {
            balanceElement.innerHTML = `${formattedBalance} ETH`;
            balanceElement.style.opacity = '1';
            refreshButton.disabled = false;
        }, 1000);
    } catch (error) {
        console.error('Error fetching balance:', error);
        balanceElement.innerHTML = 'Error fetching balance';
        refreshButton.disabled = false;
    }
}



async function connectToMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        showNotification('MetaMask is not installed. Please install it to continue', 'error');
        return;
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        
        bankLoanContract = new web3.eth.Contract(bankLoanABI, contractAddress);
        updateUI();
       updateEtherBalance();
        showNotification('Connected to MetaMask successfully', 'success');
    } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
        showNotification('Failed to connect to MetaMask. Please try again.', 'error');
    }
}
//EVENT LISTENERS
function setupEventListeners() {
    document.getElementById('connectButton').addEventListener('click', connectToMetaMask);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('applyLoanForm').addEventListener('submit', applyForLoan);
    document.getElementById('repaymentForm').addEventListener('submit', makeRepayment);
    document.getElementById('depositCollateralBtn').addEventListener('click', depositCollateral);
    document.getElementById('withdrawCollateralBtn').addEventListener('click', withdrawCollateral);
    document.getElementById('getLoanInfoBtn').addEventListener('click', getLoanInfo);
    document.getElementById('refreshBalanceBtn').addEventListener('click', updateEtherBalance);
}


async function applyForLoan(event) {
    event.preventDefault();
    showLoader();
    const amount = document.getElementById('loanAmount').value;
    const duration = document.getElementById('loanDuration').value;
    
    try {
        const result = await bankLoanContract.methods.applyForLoan(web3.utils.toWei(amount, 'ether'), duration)
            .send({ from: account });
        
        // Extract the loan ID from the transaction receipt
        const loanAppliedEvent = result.events.LoanApplicationSubmitted;
        if (loanAppliedEvent) {
            const loanId = loanAppliedEvent.returnValues.loanId;
            showNotification(`Loan application submitted successfully! 
                        Loan ID: ${loanId}`, 'success', 15000);
        } else {
            showNotification('Loan application submitted successfully, but loan ID could not be retrieved.', 'success');
        }

    } catch (error) {
        console.error("Error applying for loan:", error);
        showNotification(`Error: ${error.message}`, 'error');
    }
    hideLoader();
}
document.getElementById('approveLoanForm').addEventListener('submit', approveLoan);
document.getElementById('rejectLoanBtn').addEventListener('click', rejectLoan);

async function approveLoan(event) {
    event.preventDefault();
    showLoader();
    const loanId = document.getElementById('approveLoanId').value;

    try {
        await bankLoanContract.methods.approveLoan(loanId)
            .send({ from: account });
        showNotification('Loan approved successfully!', 'success');
    } catch (error) {
        console.error("Error approving loan:", error);
        showNotification(`Error: ${error.message}`, 'error');
    }
    hideLoader();
}

async function rejectLoan(event) {
    const loanId = document.getElementById('approveLoanId').value;

    try {
        await bankLoanContract.methods.rejectLoan(loanId)
            .send({ from: account });
        showNotification('Loan rejected successfully!', 'success');
    } catch (error) {
        console.error("Error rejecting loan:", error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}



async function makeRepayment(event) {
    event.preventDefault();
    showLoader();
    
    const loanId = document.getElementById('repaymentLoanId').value;
    const amount = document.getElementById('repaymentAmount').value;
    
    try {
        // Convert the amount to Wei
        const amountInWei = web3.utils.toWei(amount, 'ether');
        
        // Call the smart contract's makeRepayment function with the loanId and amountInWei
        await bankLoanContract.methods.makeRepayment(loanId)
            .send({ from: account, value: amountInWei }); // Include the repayment amount in the transaction
        
        showNotification('Repayment made successfully!', 'success');
    } catch (error) {
        console.error("Error making repayment:", error);
        showNotification(`Error: ${error.message}`, 'error');
    }
    
    hideLoader();
}


async function depositCollateral() {
    const loanId = document.getElementById('collateralLoanId').value;
    const collateralAmount = document.getElementById('collateralAmount').value;

    if (!loanId || !collateralAmount) {
        showNotification('Please enter both Loan ID and Collateral Amount.', 'warning');
        return;
    }

    showLoader();

    try {
        const amountInWei = web3.utils.toWei(collateralAmount.toString(), 'ether');

        await bankLoanContract.methods.depositCollateral(loanId)
            .send({ from: account, value: amountInWei });

        showNotification('Collateral deposited successfully!', 'success');
    } catch (error) {
        console.error("Error depositing collateral:", error);
        showNotification(`Error: ${error.message}`, 'error');
    }

    hideLoader();
}

document.getElementById('depositCollateralBtn').addEventListener('click', depositCollateral);


async function withdrawCollateral() {
    showLoader();
    const loanId = document.getElementById('collateralLoanId').value;
    
    try {
        await bankLoanContract.methods.withdrawCollateral(loanId).send({ from: account });
        showNotification('Collateral withdrawn successfully!', 'success');
    } catch (error) {
        console.error("Error withdrawing collateral:", error);
        showNotification(`Error: ${error.message}`, 'error');
    }
    hideLoader();
}

async function getLoanInfo() {
    showLoader();
    const loanId = document.getElementById('infoLoanId').value;
    const loanInfoDisplay = document.getElementById('loanInfoDisplay');
    
    const statusColors = {
        0: 'blue',       // Applied
        1: 'gold',    // Approved
        2: 'green',      // Active
        3: 'purple',     // Completed
        4: 'red'         // Defaulted
    };

    try {
        const loan = await bankLoanContract.methods.loans(loanId).call();
        
        // Explicitly convert BigInt values to strings for use in fromWei
        const amount = web3.utils.fromWei(loan.amount.toString(), 'ether');
        const collateralAmount = web3.utils.fromWei(loan.collateralAmount.toString(), 'ether');
        const repaidAmount = web3.utils.fromWei(loan.repaidAmount.toString(), 'ether');

        // Get status text and color
        const statusIndex = Number(loan.status);
        const statusText = ['Applied', 'Approved', 'Active', 'Completed', 'Defaulted'][statusIndex];
        const statusColor = statusColors[statusIndex];

        // Ensure all values are properly converted to strings
        loanInfoDisplay.innerHTML = `
            <p>Borrower: ${loan.borrower}</p>
            <p>Amount: ${amount} ETH</p>
            <p>Duration: ${Number(loan.duration).toString()} days</p>
            <p>Interest Rate: ${Number(loan.interestRate).toString()}%</p>
            <p>Collateral Amount: ${collateralAmount} ETH</p>
            <p>Repaid Amount: ${repaidAmount} ETH</p>
            <p>Next Repayment Date: ${new Date(Number(loan.nextRepaymentDate) * 1000).toLocaleString()}</p>
            <p style="color: ${statusColor}">Status: ${statusText}</p>
        `;
    } catch (error) {
        console.error("Error getting loan info:", error);
        loanInfoDisplay.innerHTML = `<p>Error: ${error.message}</p>`;
    }
    hideLoader();
}




function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        account = null;
        showNotification('Please connect to MetaMask', 'warning');
    } else if (accounts[0] !== account) {
        account = accounts[0];
    }
    updateUI();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function applyStoredDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

function setupEventListeners() {
    document.getElementById('connectButton').addEventListener('click', connectToMetaMask);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('applyLoanForm').addEventListener('submit', applyForLoan);
    document.getElementById('repaymentForm').addEventListener('submit', makeRepayment);
    document.getElementById('depositCollateralBtn').addEventListener('click', depositCollateral);
    document.getElementById('withdrawCollateralBtn').addEventListener('click', withdrawCollateral);
    document.getElementById('getLoanInfoBtn').addEventListener('click', getLoanInfo);
    document.getElementById('refreshBalanceBtn').addEventListener('click',updateEtherBalance);
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}



window.addEventListener('load', () => {
    init();
    setupEventListeners();
    applyStoredDarkMode();
});

// Listen for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
}