const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateUI() {
  transactionList.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach((trx) => {
    const li = document.createElement("li");
    li.className = trx.type;
    li.innerHTML = `
      ${trx.name} - $${trx.amount.toFixed(2)} (${new Date(trx.date).toLocaleDateString()})
      <button onclick="deleteTransaction('${trx.id}')">✖</button>
    `;
    transactionList.appendChild(li);

    if (trx.type === "income") income += trx.amount;
    else expense += trx.amount;
  });

  balanceEl.textContent = `$${(income - expense).toFixed(2)}`;
  incomeEl.textContent = `$${income.toFixed(2)}`;
  expenseEl.textContent = `$${expense.toFixed(2)}`;
}

function deleteTransaction(id) {
  transactions = transactions.filter((trx) => trx.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
}

transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;

  if (!name || isNaN(amount) || !date) {
    alert("Fill all fields");
    return;
  }

  const newTransaction = {
    id: Date.now().toString(),
    name,
    amount,
    date,
    type,
  };

  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  transactionForm.reset();
  updateUI();
});

function downloadCSV() {
  if (transactions.length === 0) {
    alert("No transactions to download!");
    return;
  }

  const headers = "Name,Amount,Date,Type\n";
  const rows = transactions
    .map((trx) => `${trx.name},${trx.amount},${trx.date},${trx.type}`)
    .join("\n");

  const csvData = headers + rows;
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
}

updateUI();