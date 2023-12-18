class ExpenseCalculator extends HTMLElement {
    constructor() {
        super();

        this.expenses = [];
        this.total = 0;

        this.attachShadow({ mode: 'open' });

        this.render();
        this.attachEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div id="app">
                <div style="height:100px;background-image:linear-gradient(to bottom right, #475569, #4b5563, #52525b, #525252, #57534e);display:flex;justify-content:center;align-items:center;font-size:x-large;color:#f1f5f9;text;filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));font-weight:bold" class="total">Общая сумма: <span style="text-decoration:underline;margin:0 7px;"> ${this.total} </span> руб.</div>
                <form style="display:flex;justify-content:center;padding:50px;gap:20px;" id="expenseForm">
                    <input style="width:200px;height:30px;padding:0 5px;font-size:large;outline:none;border:solid 2px grey;color:grey" type="text" id="expenseName" placeholder="Название расхода" required>
                    <input style="width:200px;height:30px;padding:0 5px;font-size:large;outline:none;border:solid 2px grey;color:grey" type="number" id="expenseAmount" placeholder="Сумма" required>
                    <button style="width:100px;height:34px;background-color:white;border:solid 2px black;color:black;font-size:large" type="submit">Добавить</button>
                </form>
                <ul style="display:flex;flex-direction:column;align-items:center;gap:20px;list-style-type: none;" id="expenseList"></ul>
            </div>
        `;
    }

    attachEvents() {
        const expenseForm = this.shadowRoot.getElementById('expenseForm');
        const expenseNameInput = this.shadowRoot.getElementById('expenseName');
        const expenseAmountInput = this.shadowRoot.getElementById('expenseAmount');
        const expenseList = this.shadowRoot.getElementById('expenseList');

        expenseForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = expenseNameInput.value;
            const amount = parseFloat(expenseAmountInput.value);

            if (name && !isNaN(amount)) {
                this.addExpense(name, amount);
                this.updateTotal();
                this.renderExpenses();
                expenseNameInput.value = '';
                expenseAmountInput.value = '';
            }
        });

        expenseList.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const index = event.target.dataset.index;
                this.removeExpense(index);
                this.updateTotal();
                this.renderExpenses();
            }
        });
    }

    addExpense(name, amount) {
        this.expenses.push({ name, amount });
    }

    removeExpense(index) {
        this.expenses.splice(index, 1);
    }

    updateTotal() {
        this.total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    renderExpenses() {
        const expenseList = this.shadowRoot.getElementById('expenseList');
        expenseList.innerHTML = '';

        this.expenses.forEach((expense, index) => {
            const listItem = document.createElement('li');
            listItem.style = "border-top:1px solid lightgrey;padding:10px 0;width:30%;min-width:200px;text-align:center"
            listItem.innerHTML = `
                <span>${expense.name} - ${expense.amount} руб.</span>
                <button style="background-color:white;border:solid 1px black;color:black;font-size:small" class="delete-btn" data-index="${index}">Удалить</button>
            `;
            expenseList.appendChild(listItem);
        });

        const totalElement = this.shadowRoot.querySelector('.total');
        totalElement.innerHTML = `Общая сумма: <span style="text-decoration:underline;margin:0 7px;"> ${this.total} </span> руб.`;
    }
}

customElements.define('expense-calculator', ExpenseCalculator);
