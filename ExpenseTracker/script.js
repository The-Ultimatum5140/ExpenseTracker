// getting dom elements
const balanceEl = document.querySelector("#balance");
const incomeAmount = document.querySelector("#income-amount");
const expenseAmount = document.querySelector("#expense-amount");
const transactionListEl = document.querySelector("#transaction-list");
const transactionFormEl = document.querySelector("#transaction-form");
const descriptionEl = document.querySelector("#description");
const amountEl = document.querySelector("#amount");

// generation of functions

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

// initialize on load
document.addEventListener("DOMContentLoaded", () => {
  updateTransactionList();
  updateSummary();
});

function addTransaction(e) {
  e.preventDefault();

  // form values

  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList();
  updateSummary();
  transactionFormEl.reset();
}

// updation of the transactions

function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortTransactions = [...transactions].reverse();

  sortTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

// creating the transaction Element

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");
  // to do update the amount formatting
  li.innerHTML = `
      <span>${transaction.description}</span>
      <span>${formatCurrency(transaction.amount)}
       <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
      </span>
    `;
  return li;
}

// remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList();
  updateSummary();
}

// update Summary Method
function updateSummary() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = income - expense;

  balanceEl.textContent = formatCurrency(balance);
  incomeAmount.textContent = formatCurrency(income);
  expenseAmount.textContent = formatCurrency(expense);
}

// format function
function formatCurrency(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
}
