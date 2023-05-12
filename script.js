/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Vasu Bajaj",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 2803,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-11-25T06:04:23.907Z",
    "2022-11-25T14:18:46.235Z",
    "2022-11-05T16:33:06.386Z",
    "2022-11-10T14:43:26.374Z",
    "2022-11-15T18:49:59.371Z",
    "2022-11-16T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "en-IN", // de-DE
};

const account2 = {
  owner: "Daksh Chhipa",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1003,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-11-25T06:04:23.907Z",
    "2022-11-25T14:18:46.235Z",
    "2022-11-05T16:33:06.386Z",
    "2022-11-10T14:43:26.374Z",
    "2022-11-15T18:49:59.371Z",
    "2022-11-16T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "en-IN",
};
const account3 = {
  owner: "Ansh BHalla",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1102,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-11-25T06:04:23.907Z",
    "2022-11-25T14:18:46.235Z",
    "2022-11-05T16:33:06.386Z",
    "2022-11-10T14:43:26.374Z",
    "2022-11-15T18:49:59.371Z",
    "2022-11-16T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "en-IN",
};


const accounts = [account1, account2,account3];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatDates = function (date, locale) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const dayspassed = calcDayPassed(new Date(), date);

  if (dayspassed == 0) {
    return "today";
  } else if (dayspassed == 1) {
    return "yesterday";
  } else if (dayspassed <= 7) {
    return `${dayspassed} days ago`;
  } else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurr = function (mov) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(mov);
};

//sort
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  display(currentAccount, !sorted);
  sorted = !sorted;
});

//display movements
function display(acc, sort = false) {
  console.log(sort);
  containerMovements.innerHTML = "";
  //sort
  const movi = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movi.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displaydate = formatDates(date, acc.locale);
    const movrow = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displaydate}</div>
          <div class="movements__value">${formatCurr(mov)}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", movrow);
  });
}

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);

  labelBalance.textContent = `${formatCurr(acc.balance)}`;
};
//calc summary
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${formatCurr(income)}`;
  labelSumOut.textContent = `${formatCurr(out)}`;
  labelSumInterest.textContent = `${formatCurr(interest)}`;
};

const createusername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  }, 0);
};
createusername(accounts);

/////////////////////////////////////////////////
let currentAccount, timerr;
//event handlers
btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (accs) => accs.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //dates
    const now = new Date();
    const locale = navigator.language;
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );
    //clear input
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //display
    calcDisplayBalance(currentAccount);
    display(currentAccount);
    calcDisplaySummary(currentAccount);
    if (timerr) clearInterval(timerr);
    timerr = timer();
  }
});

//transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const transferto = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    transferto &&
    transferto.username != currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferto.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferto.movementsDates.push(new Date().toISOString());
    //upadate ui
    updateUI(currentAccount);
    //reset timer
    if (timerr) clearInterval(timerr);
    timerr = timer();
  }
});

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  display(acc);
  calcDisplaySummary(acc);
};

//close acc
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (username == currentAccount.username && pin == currentAccount.pin) {
    const index = accounts.findIndex(function (acc) {
      return acc.username == username;
    });

    //delete account
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

//take loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  setTimeout(function () {
    if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount * 0.1)
    ) {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      if (timerr) clearInterval(timerr);
      timerr = timer();
    }
    inputLoanAmount.value = "";
  }, 3000);
});

//create logout timer
const timer = function () {
  const start = () => {
    const min = `${Math.floor(time / 60)}`.padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}.`;

    if (time === 0) {
      clearInterval(clock);
      containerApp.style.opacity = "0";
      labelWelcome.textContent = `Login to Get started`;
    }
    time--;
  };

  let time = 300;
  start();
  const clock = setInterval(start, 1000);
  return clock;
};
