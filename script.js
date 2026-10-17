const nameInput = document.getElementById("transaction-name");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const transactionForm = document.querySelector(".transaction-form form");
const transactionList = document.querySelector(".transaction-list");
const totalBalance = document.getElementById("total-balance");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");

class Transaction {
  constructor(name, amount, type, category, date) {
    this.name = name;
    this.amount = amount;
    this.type = type;
    this.category = category;
    this.date = date;
  }
  getDetails() {
    return `<p>${this.name} - Rs. ${this.amount}</p> <p>${this.type}</p> 
        <p>${this.category}</p> <p>${this.date}</p>
        <button class="delete-button">Delete</button>`;
  }
  getAmount() {
    return this.amount;
  }
  isIncome() {
    if (this.type === "income") {
        return true
    }else {
        return false
    }
  }
};
function displayTransaction(transaction) {
    const item = document.createElement("div");
    item.classList.add("transaction-item");
    item.innerHTML = transaction.getDetails()
    transactionList.appendChild(item)
    const deleteButton = item.querySelector(".delete-button");
    deleteButton.addEventListener("click", (event) => {
        item.remove();
        const index = transactions.indexOf(transaction);
        if (index === -1) {
        return;
        }
        transactions.splice(index, 1);
        saveTransactions();
        updateDashboard();
    });
}

const savedData = localStorage.getItem("transactions");

const transactions = savedData ? JSON.parse(savedData).map(item => {
    return new Transaction(
        item.name,
        item.amount,
        item.type,
        item.category,
        item.date
    );
}) : [];
transactions.forEach(transaction => {
    displayTransaction(transaction)
});
updateDashboard();
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  if (name.trim() === "" || amount <= 0 || !Number.isFinite(amount)) {
    alert("Please enter a valid name and amount.");
    return;
  }

  const transaction = new Transaction(name, amount, type, category, date);
  transactions.push(transaction);
  saveTransactions();
  displayTransaction(transaction)
  
  transactionForm.reset();
  updateDashboard();
});

function updateDashboard() {
  const incomeTotal = transactions.reduce((sum, transaction) => {
    if (transaction.isIncome()) {
      return sum + transaction.amount;
    } else {
      return sum;
    }
  }, 0);

  const expenseTotal = transactions.reduce((sum, transaction) => {
    if (transaction.type === "expense") {
      return sum + transaction.amount;
    } else {
      return sum;
    }
  }, 0);

  const balance = incomeTotal - expenseTotal;

  totalIncome.textContent = `Rs. ${incomeTotal}`;
  totalExpense.textContent = `Rs. ${expenseTotal}`;
  totalBalance.textContent = `Rs. ${balance}`;
}

function saveTransactions () {
    const saveData = JSON.stringify(transactions)
    localStorage.setItem("transactions", saveData)

}
