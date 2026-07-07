// --- GLOBAL STATE ---
let balance = Number(localStorage.getItem("balance")) || 150000;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let financeChart = null; 

// --- APP INITIALIZATION ---
window.onload = function(){
  // Splash screen transition
  setTimeout(()=>{
    document.getElementById('splash').style.opacity="0";
    setTimeout(()=>{
      document.getElementById('splash').style.display="none";
      document.getElementById('login').style.display="block";
    },1000);
  },2000);
  updateBalance();
  renderTransactions();
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
    setTimeout(()=> balanceEl.style.color = "#fff", 1000);
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

  if (amount
