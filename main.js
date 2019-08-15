// TODO:
/*
- take text and amount num, if they fufill the requirements, on submit or on enter.
expense constructor:
income contructor:

- Add the input to the "Net" Object

- HTML display works off the NET Object, anytime something changes, have it be displayed to the HTML.

- Expense Calculation (percentage)
*/

const textInput = document.getElementById("text-input");
const numInput = document.getElementById("num-input");
const submitForm = document.getElementById("submit-field");
const formElement = document.getElementById("input-field");

const graphBox = document.getElementById("net-graph-field");
const netIncome = document.getElementById("net-income");
const netExpenses = document.getElementById("net-expense");

const incomeListBlock = document.getElementById("income-list");
const expensesListBlock = document.getElementById("expenses-list");

const netBudget = document.getElementById("net-budget");
const netPercentage = document.getElementById("net-expense-percentage");
const budgetDate = document.querySelector(".budget-date");

// Set the budget date;
const dates = new Date();
budgetDate.innerHTML = `Available Budget for ${months(dates.getMonth())}:`;


// Place this into an object that only uses getters and setters
let expensesArray = [];
let incomeArray = [];
let netBudgetValue = 0.00;
let netIncomeValue = 0.00;
let netExpensesValue = 0.00;
let netExpensesPercentage = 0;
//#############################

class Budget {
  constructor(name, value) {
    this._name = name;
    this._value = value;
  }
  static updateNetTotalHTML() {
    // update the value
    netBudgetValue = netIncomeValue + netExpensesValue;

    // update the html
    if (netBudgetValue > 0) {
      netBudget.innerText = `+ $${netBudgetValue}`;
      netBudget.classList.add("income");
      netBudget.classList.remove("expense");
    } else if (netBudgetValue === 0) {
      netBudget.innerText = `${netBudgetValue}`;
      netBudget.classList.add("income");
      netBudget.classList.remove("expense");
    } else {
      netBudget.innerText = `- $${-1 * netBudgetValue}`;
      netBudget.classList.add("expense");
      netBudget.classList.remove("income");
    }
  }
}

class Income extends Budget {
  constructor(name, value) {
    super(name, value);
  }
  // Using a static method, so you can use it on the class, but not the instances.
  static updateIncomeHTML() {
    // Net Income
    let netTotalIncome = 0;
    incomeArray.forEach(element => {
      netTotalIncome += element._value;
    });
    netIncomeValue = netTotalIncome;
    netIncome.innerHTML = `+ $${netTotalIncome}`;

    // Income HTML list
    let fake2 = "";
    incomeArray.forEach(element => {
      fake2 += `
      <div class="incomeListItem">
        <div class="income formBlock">
          ${element._name}
        </div>
        <div class="income formBlock">
          $${element._value}
          <i class="fas fa-trash-alt woop"></i>
        </div>
      </div>`;
    });
    incomeListBlock.innerHTML = fake2;
    Expenses.updateExpensesHTML();
  }
}

class Expenses extends Budget {
  constructor(name, value) {
    super(name, value);
    this._percentage = 0;
  }
  static updateExpensesHTML() {
    // Net Expenses
    let netTotalExpenses = 0;
    let newNetExpPercentage = 0;
    if(netIncomeValue > 0){
      expensesArray.forEach(element => {
        netTotalExpenses += element._value;

        // Update Expense Item percentage
        // Divide expenses with income * 100
        element._percentage = parseInt((  element._value / netIncomeValue )* 100);
        if(element._percentage < 0){
          element._percentage *= -1;
        }
        newNetExpPercentage += element._percentage;
      });
    } else {
      newNetExpPercentage = 0;
      netTotalExpenses = 0;
    }
    netExpensesPercentage = newNetExpPercentage;
    netPercentage.innerHTML = `${netExpensesPercentage}%`

    netExpensesValue = netTotalExpenses;
    netExpenses.innerHTML = `- $${-1 * netTotalExpenses}`;

    


    // Expenses HTML list
    let fake = "";
    expensesArray.forEach(element => {
      fake += `
      <div class="expenseListItem">
        <div class="expense formBlock">
          ${element._name}
        </div> 

        <div class="expense formBlock expensePercentageContainer">
          $${element._value}

          <div class="expensePercentage">
            ${element._percentage}%
          </div>
          <i class="fas fa-trash-alt woop"></i>
        </div>
      </div>`;
    });
    expensesListBlock.innerHTML = fake;
  }
}


submitForm.addEventListener("click", (event) => {
  event.preventDefault();

  // Check to make sure the fields have something to submit.
  if (textInput.value !== "" && numInput.value !== "") {

    // Takes form inputs, give it to a contructor based on
    // Creates either expense or income
    if (typeof textInput.value == "string" && typeof Number.parseFloat(numInput.value) == "number") {
      // Based on => expense < 0; Income > 0;
      if (Number.parseFloat(numInput.value) > 0) {
        incomeArray.push(new Income(textInput.value, Number.parseFloat(numInput.value)));
      } else {
        expensesArray.push(new Expenses(textInput.value, Number.parseFloat(numInput.value)/*add percentage here */));
      }
    }

    // Clears form
    document.forms["input-field"].reset();

    // Updates HTML
    Income.updateIncomeHTML();
    Expenses.updateExpensesHTML();
    Budget.updateNetTotalHTML();
  }
});


graphBox.addEventListener("click", (element) => {
  if (element.target.className == "fas fa-trash-alt woop") {
    // Update our values first, from.. the html.. God thats so bad.

    // Update the netBudget using the data from the array
    expensesArray.forEach(e => {
      if (e._name === element.target.parentElement.innerText.toLowerCase() || parseFloat(e._value) === parseFloat(parseSentenceForNumber(element.target.parentElement.innerText))) {
        netBudgetValue -= (e._value);
 
        // Remove the data from the array
        expensesArray.splice(e, 1);
      }
    });

    // update the income array too
    incomeArray.forEach(e => {
      if (e._name === element.target.parentElement.innerText.toLowerCase() || parseFloat(e._value) === parseFloat(parseSentenceForNumber(element.target.parentElement.innerText))) {
        netBudgetValue -= (e._value);

        // Remove the data from the array
        incomeArray.splice(e, 1);
      }
    });

    // Remove the html 
    element.target.parentElement.remove();

    // Update the HTML
    Income.updateIncomeHTML();
    Expenses.updateExpensesHTML();
    Budget.updateNetTotalHTML();

  }

  // <i class="fas fa-trash-alt"></i>
});

/*
incomeListBlock.addEventListener("click", element => {
  if (element.target.className === "fas fa-trash-alt") {
    // Update our values first, from.. the html.. God thats so bad.
    console.log(parseFloat(element.target.innerText));
    element.target.parentElement.remove();

    // Update the netBudget using the data from the array


    // Remove the html 
    element.target.parentElement.remove();

    // Update the HTML
    Income.updateIncomeHTML();
    Expenses.updateExpensesHTML();
    Budget.updateNetTotalHTML();
  }
});

*/




// Stole this, handy lil thing to parse dollar signs n such out of strings.
function parseSentenceForNumber(sentence) {
  var matches = sentence.match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
  return matches && matches[0] || null;
}


function months(num){
  switch (num) {
    case 0:
      return "January";

    case 1:
      return "Febuary";

    case 2:
      return "March";

    case 3:
      return "April";

    case 4:
      return "May";
    
    case 5:
      return "June";
    
    case 6:
      return "July";
    
    case 7:
      return "August";
    
    case 8:
      return "September";
      
    case 9:
      return "October";
    
    case 10:
      return "November";
    
    case 11:
      return "December";

    
  }
}
