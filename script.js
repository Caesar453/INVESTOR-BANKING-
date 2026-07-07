// --- GLOBAL STATE ---
let balance = 150000;
let transactions = [];

// Safely load data from localStorage
try {
  const savedBalance = localStorage.getItem("balance");
  if (savedBalance !== null) {
    balance = Number(savedBalance);
  }
  
  const savedTransactions = localStorage.getItem("transactions");
  if (savedTransactions !== null) {
    transactions = JSON.parse(savedTransactions);
  }
} catch (error) {
  console.error("Error loading localStorage data:", error);
}

let financeChart = null; 

// --- APP INITIALIZATION ---
window.onload = function(){
  // Ensure elements exist before updating them
  updateBalance();
  renderTransactions();

  // Handle splash screen fade out safely
  const splashEl = document.getElementById('splash');
  const loginEl = document.getElementById('login');

  if (splashEl && loginEl) {
    setTimeout(() => {
      splashEl.style.opacity = "0";
      setTimeout(() => {
        splashEl.style.display = "none";
        loginEl.style.display = "block";
      }, 1000);
    }, 2000);
  } else {
    // Fallback if elements aren't found to prevent complete locking
    if (loginEl) loginEl.style.display = "block";
  }
}

// --- AUTHENTICATION ---
function login(){
  let name = document.getElementById('name').value;
  let pin = document.getElementById('pin').value;
  if(name === "" || pin === ""){
    alert("Fill all fields");
    return;
  }
  if(pin !== "1234"){ 
    alert("Invalid PIN");
    return;
  }
  document.getElementById('welcome').innerText = "Welcome " + name;
  document.getElementById('profileName').innerText = "Name: " + name;
  document.getElementById('login').style.display="none";
  document.getElementById('dashboard').style.display="block";
}

function logout(){
  document.getElementById('dashboard').style.display="none";
  document.getElementById('profile').style.display="none";
  document.getElementById('finance').style.display="none";
  document.getElementById('login').style.display="block";
}

// --- BANKING CORE LOGIC ---
function updateBalance(color="#fff"){
  let balanceEl = document.getElementById('balance');
  if(balanceEl) {
    balanceEl.innerText = balance;
    balanceEl.style.color = color;
    setTimeout(()=> {
      if(balanceEl) balanceEl.style.color = "#fff";
    }, 1000);
  }
}

function deposit() {
  let amount = prompt("Enter the amount to deposit:");
  amount = Number(amount);

  if (amount > 0) {
    balance += amount;
    updateBalance("#4cd137"); 
    localStorage.setItem("balance", balance);
    
    transactions.unshift({ type: "Deposit", amount: amount, date: new Date().toLocaleDateString() });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
  } else {
    alert("Please enter a valid amount.");
  }
}

function withdraw() {
  let amount = prompt("Enter the amount to withdraw:");
  amount = Number(amount);

  if (amount <= 0 || isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
  }

  if (amount > balance) {
    alert("Insufficient funds!");
  } else {
    balance -= amount;
    updateBalance("#ff3b3b"); 
    localStorage.setItem("balance", balance);
    
    transactions.unshift({ type: "Withdrawal", amount: amount, date: new Date().toLocaleDateString() });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
  }
}

// --- UTILITY SERVICES ---
function buyUtility(serviceName) {
  let amount = prompt(`Enter amount for ${serviceName}:`);
  amount = Number(amount);

  if (amount <= 0 || isNaN(amount)) {
    alert("Invalid amount.");
    return;
  }

  if (amount > balance) {
    alert("Insufficient funds to complete this payment.");
  } else {
    balance -= amount;
    updateBalance("#ff3b3b");
    localStorage.setItem("balance", balance);

    transactions.unshift({ type: serviceName, amount: amount, date: new Date().toLocaleDateString() });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    alert(`${serviceName} purchase of ₦${amount} was successful!`);
  }
}

// --- NAVIGATION & VIEWS ---
function showPage(pageId) {
  const pages = ['dashboard', 'profile', 'finance'];
  
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.style.display = "block";

  if (pageId === 'finance') {
    initChart();
  }
}

function renderTransactions() {
  let historyEl = document.getElementById('history');
  if (!historyEl) return;
  
  historyEl.innerHTML = ""; 
  transactions.slice(0, 5).forEach(tx => { 
    let txDiv = document.createElement('div');
    txDiv.className = "tx";
    txDiv.innerHTML = `<strong>${tx.type}</strong>: ₦${tx.amount} <br> <small>${tx.date}</small>`;
    historyEl.appendChild(txDiv);
  });
}

// --- CHART.JS INTEGRATION ---
function initChart() {
  let canvas = document.getElementById('financeChart');
  if (!canvas) return;
  
  let ctx = canvas.getContext('2d');
  
  let totalDeposits = transactions.filter(t => t.type === "Deposit").reduce((sum, t) => sum + t.amount, 0);
  let totalExpenses = transactions.filter(t => t.type !== "Deposit").reduce((sum, t) => sum + t.amount, 0);

  if (financeChart) {
    financeChart.destroy(); 
  }

  // Ensure Chart.js library is loaded before creating instance
  if (typeof Chart !== 'undefined') {
    financeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: [totalDeposits || 1, totalExpenses || 0], 
          backgroundColor: ['#4cd137', '#ff3b3b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#fff' } }
        }
      }
    });
  }
}
