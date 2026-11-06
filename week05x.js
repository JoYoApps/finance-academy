// Week 5 adaptive layer: concepts (with a second explanation, a worked example, practice), glossary, quiz tags.
// Accruals build on Week 1's 'accrual' concept, where Mitch has started; each new idea gets generated practice.
(function(){
  const w = window.WEEKS.find(x => x.week === 5);
  w.concepts = [
    {id: 'debit-credit', name: 'Debits and credits (DEALER)', day: 1,
      explain: "<p>Forget 'good' and 'bad'. Picture every account as a page split down the middle: left is debit, right is credit. Each type of account has a 'home' side where increases go.</p><ul><li><b>Home on the left (debit)</b>: Drawings and dividends, Expenses, Assets.</li><li><b>Home on the right (credit)</b>: Liabilities, Equity, Revenue.</li></ul><p>To record a transaction: name the accounts that change, decide up or down for each, then use the home side to increase and the other side to decrease. Check the two sides add to the same amount.</p>",
      example: "<table><tr><th>Transaction</th><th>Account up/down</th><th>Entry</th></tr><tr><td>Borrow $15,000</td><td>Bank (asset) up; Loan (liability) up</td><td>Dr Bank, Cr Loan</td></tr><tr><td>Pay $3,000 wages</td><td>Wages (expense) up; Bank (asset) down</td><td>Dr Wages, Cr Bank</td></tr><tr><td>Repay $1,000 of loan</td><td>Loan (liability) down; Bank (asset) down</td><td>Dr Loan, Cr Bank</td></tr></table>",
      gens: ['drcrSide', 'drcrEntry'],
      pool: [
        {q: 'A business repays $2,000 of a bank loan. Which entry is correct?', o: ['Dr Bank 2,000, Cr Loan 2,000', 'Dr Loan 2,000, Cr Bank 2,000', 'Dr Interest expense 2,000, Cr Bank 2,000', 'Dr Loan 2,000, Cr Revenue 2,000'], a: 1, e: 'The liability falls (debit) and the asset Bank falls (credit). Repaying principal is not an expense.'},
        {q: 'Which account increases with a debit?', o: ['Accounts payable', 'Share capital', 'Rent expense', 'Sales revenue'], a: 2, e: 'Expenses increase with debits (the E in DEALER on the debit side).'},
        {q: 'An owner takes $1,500 from a sole trader business for personal use. The entry is:', o: ['Dr Drawings 1,500, Cr Bank 1,500', 'Dr Wages 1,500, Cr Bank 1,500', 'Dr Bank 1,500, Cr Drawings 1,500', 'Dr Capital 1,500, Cr Revenue 1,500'], a: 0, e: 'Drawings increase with a debit and reduce equity. They are not an expense of the business.'}
      ]},
    {id: 'gst-entries', name: 'GST in journal entries', day: 1,
      explain: "<p>GST passes through a registered business on its way to the ATO, so it never touches profit.</p><ul><li>On a <b>sale</b>, the GST you charge is a liability: <b>Cr GST payable</b>, worth one-eleventh of the GST-inclusive price.</li><li>On a <b>purchase</b>, the GST you paid is something the ATO owes you back: <b>Dr GST receivable</b> (input tax credit).</li></ul><p>Revenue and expenses are always the GST-exclusive amounts (divide by 1.1).</p>",
      example: "<table><tr><th>Purchase of supplies $1,100 incl GST on credit</th><th class='num'>Dr</th><th class='num'>Cr</th></tr><tr><td>Supplies expense</td><td class='num'>1,000</td><td></td></tr><tr><td>GST receivable</td><td class='num'>100</td><td></td></tr><tr><td>Accounts payable</td><td></td><td class='num'>1,100</td></tr></table><p class='note'>On the BAS, GST payable minus GST receivable is what you pay (or get refunded).</p>",
      gens: ['gstEntry', 'gstBas'],
      pool: [
        {q: 'A business buys a $4,400 laptop including GST. What amount is debited to the asset account?', o: ['$4,400', '$4,000', '$400', '$3,960'], a: 1, e: '$4,400 ÷ 1.1 = $4,000. The $400 GST is debited to GST receivable.'},
        {q: 'In a quarter a business charges $12,000 of GST on sales and pays $4,500 of GST on purchases. What is its net GST position?', o: ['Pays the ATO $7,500', 'Receives $7,500 from the ATO', 'Pays the ATO $16,500', 'Pays the ATO $12,000'], a: 0, e: 'GST collected $12,000 − GST credits $4,500 = $7,500 payable.'}
      ]},
    {id: 'journal-ledger', name: 'Journal and ledger', day: 2,
      explain: "<p>Think of the <b>journal</b> as a diary: every transaction once, in date order, with a note of why. Think of the <b>ledger</b> as a filing cabinet with one folder per account: each journal line is filed (posted) in its folder, so you can see any account's balance at a glance.</p><p>To balance an account, add each side and put the difference on the bigger side. That is the balance carried forward.</p>",
      example: "<table><tr><th colspan='2'>Bank: debits</th><th colspan='2'>Bank: credits</th></tr><tr><td>Capital</td><td class='num'>20,000</td><td>Van</td><td class='num'>33,000</td></tr><tr><td>Loan</td><td class='num'>15,000</td><td>Wages</td><td class='num'>3,000</td></tr><tr><td>Customer</td><td class='num'>5,500</td><td>Supplier</td><td class='num'>1,100</td></tr><tr><td><b>40,500</b></td><td></td><td><b>37,100</b></td><td></td></tr></table><p class='formula'>Balance: $3,400 debit</p>",
      gens: ['tBalance'],
      pool: [
        {q: 'Where do you first record a transaction, with a narration explaining it?', o: ['The trial balance', 'The general journal', 'The balance sheet', 'The chart of accounts'], a: 1, e: 'The journal is the book of original entry; entries are then posted to the ledger.'},
        {q: 'Accounts payable shows a debit balance of $1,100. What is the most likely explanation?', o: ['Normal: payables are debit balances', 'A supplier has probably been paid twice or a bill was missed', 'The business has an overdraft', 'GST was recorded'], a: 1, e: 'Payables normally carry credit balances. A debit balance usually means a payment without a matching bill, often a double payment.'}
      ]},
    {id: 'chart-accounts', name: 'Chart of accounts and subsidiary ledgers', day: 2,
      explain: "<p>The chart of accounts is the list of every account the business uses, grouped in the order the statements need: assets, liabilities, equity, revenue, expenses. Numbering (1 to 6 in MYOB style) keeps them in that order.</p><p>Where you need detail by person, a <b>subsidiary ledger</b> lists each customer or supplier, and its total must equal the single control account in the general ledger.</p>",
      example: "<table><tr><th>Customer</th><th class='num'>Owes</th></tr><tr><td>Harbour Dental</td><td class='num'>3,300</td></tr><tr><td>Bayside Real Estate</td><td class='num'>0</td></tr><tr><td><b>Total = Accounts receivable control</b></td><td class='num'><b>3,300</b></td></tr></table>",
      gens: [],
      pool: [
        {q: 'In an MYOB-style chart of accounts, which number range is used for liabilities?', o: ['1-xxxx', '2-xxxx', '3-xxxx', '4-xxxx'], a: 1, e: '1 assets, 2 liabilities, 3 equity, 4 revenue, 5 and 6 expenses.'},
        {q: 'The customer listing totals $14,250 but the Accounts receivable control account shows $14,750. What does that suggest?', o: ['Nothing: they never agree', 'Something was posted to one but not the other', 'GST is the difference', 'The trial balance will not balance'], a: 1, e: 'The subsidiary ledger and control account should agree. A $500 gap points to a posting that reached only one of them.'}
      ]},
    {id: 'trial-balance', name: 'The trial balance', day: 3,
      explain: "<p>Because every entry has equal debits and credits, adding up all debit balances and all credit balances must give the same total. Listing them is the trial balance.</p><p>It is a checkpoint, not a certificate. It also lays out every balance in one place, which is exactly what you need to prepare the profit and loss and balance sheet.</p>",
      example: "<table><tr><th>Account</th><th class='num'>Dr</th><th class='num'>Cr</th></tr><tr><td>Assets</td><td class='num'>39,800</td><td></td></tr><tr><td>Expenses</td><td class='num'>4,000</td><td></td></tr><tr><td>Liabilities</td><td></td><td class='num'>15,800</td></tr><tr><td>Equity</td><td></td><td class='num'>20,000</td></tr><tr><td>Revenue</td><td></td><td class='num'>8,000</td></tr><tr><td><b>Total</b></td><td class='num'><b>43,800</b></td><td class='num'><b>43,800</b></td></tr></table>",
      gens: ['tbMissing'],
      pool: [
        {q: 'Which of these appears in the debit column of a trial balance?', o: ['GST payable', 'Bank loan', 'Accounts receivable', 'Sales revenue'], a: 2, e: 'Receivables are an asset, so they carry a debit balance.'},
        {q: 'A trial balance is mainly used for:', o: ['Proving the books are error-free', 'Checking debits equal credits and preparing the statements', 'Calculating GST', 'Paying suppliers'], a: 1, e: 'It checks the arithmetic and is the starting point for adjustments and statements.'}
      ]},
    {id: 'tb-errors', name: 'Errors and the trial balance', day: 3,
      explain: "<p>Sort errors into two piles:</p><ul><li><b>Unbalancing</b>: one side posted, different amounts on each side, wrong addition, a balance in the wrong column. The trial balance shows these.</li><li><b>Balancing</b>: omission, commission, principle, original entry, reversal, compensating. Debits still equal credits, so the trial balance cannot show them.</li></ul><p>Clues to an unbalancing error: if the difference divides by 9, look for swapped digits. If it is double a known amount, look for that amount on the wrong side.</p>",
      example: "<table><tr><th>Difference</th><th>First suspect</th></tr><tr><td>$90 (= 9 × 10)</td><td>Transposition: $540 posted as $450 on one side</td></tr><tr><td>$1,100</td><td>A $1,100 entry posted to one side only</td></tr><tr><td>$2,200</td><td>A $1,100 amount posted on the wrong side</td></tr></table>",
      gens: ['transposition'],
      pool: [
        {q: 'A new $40,000 delivery van is recorded as repairs expense. What kind of error is this, and does the trial balance show it?', o: ['Commission; yes', 'Principle; no', 'Omission; yes', 'Transposition; no'], a: 1, e: 'An asset recorded as an expense is an error of principle. Both sides are equal, so the trial balance still balances.'},
        {q: 'A $1,250 payment is entered as Dr Bank 1,250, Cr Electricity 1,250 instead of the other way round. What is this error called?', o: ['Reversal of entries', 'Original entry', 'Compensating', 'Omission'], a: 0, e: 'Debit and credit swapped: a reversal. The trial balance still balances, but both accounts are wrong by $2,500.'}
      ]},
    {id: 'prepaid-accrued', name: 'Accrued and prepaid expenses', day: 4,
      explain: "<p>Ask one question at period end: <b>have we used it, and have we paid for it?</b></p><ul><li>Used but not paid or billed: accrue it. Dr Expense, Cr Accrued expenses (a liability).</li><li>Paid but not yet used: defer it. The unused part sits as Prepaid expenses (an asset), and each month the used part moves to expense.</li></ul><p>Both make the profit and loss show the cost of what was actually used in the period, which is the accrual idea from Week 1.</p>",
      example: "<table><tr><th>Item</th><th>Period-end entry</th><th>Balance sheet</th></tr><tr><td>$220 of power used, bill next month</td><td>Dr Electricity 220, Cr Accrued expenses 220</td><td>Liability 220</td></tr><tr><td>$2,400 insurance paid 1 Apr for 12 months; year end 30 Jun</td><td>Dr Insurance 600, Cr Prepaid insurance 600</td><td>Asset 1,800</td></tr></table>",
      gens: ['prepaidExpense', 'accruedInterest'],
      pool: [
        {q: 'A business pays a $6,000 annual software subscription on 1 January. Its year ends 30 June. What is the prepaid balance at 30 June?', o: ['$6,000', '$3,000', '$0', '$500'], a: 1, e: 'Six months used: $3,000 expense. Six months remain: $3,000 prepaid.'},
        {q: 'Wages of $4,000 were earned by staff in the last week of June but will be paid on 3 July. At 30 June the entry is:', o: ['No entry', 'Dr Wages expense 4,000, Cr Accrued wages 4,000', 'Dr Accrued wages 4,000, Cr Bank 4,000', 'Dr Prepaid wages 4,000, Cr Wages 4,000'], a: 1, e: 'The cost was incurred in June, so it is a June expense with a liability until paid.'}
      ]},
    {id: 'unearned', name: 'Accrued and unearned revenue', day: 4,
      explain: "<p>Revenue follows the <b>work</b>, not the cash (AASB 15 sets the detailed rules, covered next week).</p><ul><li>Work done, not yet invoiced: <b>accrued revenue</b>, an asset. Dr Accrued revenue, Cr Revenue.</li><li>Cash received, work not yet done: <b>unearned revenue</b> (also called a contract liability or income in advance), a liability. As the work is done, Dr Unearned revenue, Cr Revenue.</li></ul>",
      example: "<p>Gym: $1,200 annual membership received 1 March. Year end 30 June.</p><table><tr><th></th><th class='num'>Earned</th><th class='num'>Still owed</th></tr><tr><td>Months</td><td class='num'>4</td><td class='num'>8</td></tr><tr><td>Amount</td><td class='num'>$400 revenue</td><td class='num'>$800 liability</td></tr></table>",
      gens: ['unearnedRev'],
      pool: [
        {q: 'A builder receives a $10,000 deposit for a job that will start next month. How is it recorded on receipt?', o: ['Dr Bank, Cr Revenue', 'Dr Bank, Cr Unearned revenue (a liability)', 'Dr Revenue, Cr Bank', 'No entry until the job starts'], a: 1, e: 'The builder still owes the work, so the deposit is a liability until earned.'},
        {q: 'Work worth $3,000 was completed on 29 June but invoiced on 2 July. For the year ending 30 June:', o: ['No revenue: there is no invoice yet', '$3,000 revenue, with accrued revenue as an asset', '$3,000 revenue next year', 'A $3,000 liability'], a: 1, e: 'The work was done in June, so the revenue belongs to June.'}
      ]},
    {id: 'adjusting', name: 'Depreciation and other adjusting entries', day: 4,
      explain: "<p>Some costs build up just by time passing, with no invoice to remind you. Two common ones:</p><ul><li><b>Depreciation</b>: (cost − residual value) ÷ useful life, recorded each month as Dr Depreciation expense, Cr Accumulated depreciation.</li><li><b>Interest</b>: loan × rate × time, accrued as Dr Interest expense, Cr Interest payable until it is paid.</li></ul><p>Accumulated depreciation is a contra-asset: it reduces the asset's book value but keeps the original cost visible.</p>",
      example: "<table><tr><th>Item</th><th>Working</th><th class='num'>Monthly entry</th></tr><tr><td>Van $30,000, residual $6,000, 5 years</td><td>$24,000 ÷ 60 months</td><td class='num'>$400</td></tr><tr><td>Loan $15,000 at 8%</td><td>$15,000 × 8% ÷ 12</td><td class='num'>$100</td></tr></table>",
      gens: ['depMonthly', 'accruedInterest'],
      pool: [
        {q: 'Equipment cost $50,000, has no residual value and a 10-year life. After 3 years, what is its book value?', o: ['$50,000', '$35,000', '$15,000', '$45,000'], a: 1, e: '$5,000 a year × 3 = $15,000 accumulated depreciation. Book value $50,000 − $15,000 = $35,000.'},
        {q: 'Where does accumulated depreciation appear?', o: ['As an expense in the profit and loss', 'As a liability', 'In the balance sheet, deducted from the asset\'s cost', 'In equity'], a: 2, e: 'It is a contra-asset account shown against the asset\'s cost.'}
      ]},
    {id: 'closing', name: 'Closing entries and retained earnings', day: 5,
      explain: "<p>Revenue and expense accounts are like a scoreboard for one season: at the end you record the final score and reset the board. The final score is profit (or loss), and it is moved into <b>retained earnings</b> in equity.</p><p>Closing entry: debit each revenue account and credit each expense account to bring them to zero, and put the difference into retained earnings (credit for a profit, debit for a loss). Dividends then reduce retained earnings.</p>",
      example: "<table><tr><td>Opening retained earnings</td><td class='num'>50,000</td></tr><tr><td>Plus profit for the year</td><td class='num'>30,000</td></tr><tr><td>Less dividends</td><td class='num'>−12,000</td></tr><tr><td><b>Closing retained earnings</b></td><td class='num'><b>68,000</b></td></tr></table>",
      gens: ['retainedEarnings', 'closingProfit'],
      pool: [
        {q: 'After closing entries, which account will have a zero balance?', o: ['Bank', 'Retained earnings', 'Wages expense', 'Bank loan'], a: 2, e: 'Expenses and revenue are temporary accounts and are reset to zero.'},
        {q: 'A company makes a $20,000 loss. How is it closed?', o: ['Dr Retained earnings 20,000', 'Cr Retained earnings 20,000', 'Dr Bank 20,000', 'It is not closed'], a: 0, e: 'Expenses exceed revenue, so the balancing figure is a debit that reduces retained earnings.'}
      ]},
    {id: 'bank-rec', name: 'Bank reconciliation', day: 5,
      explain: "<p>Your Bank account and the bank's statement record the same money from different seats, and at different times. Reconcile in two halves:</p><ol><li><b>Fix your books</b> for things the bank knows and you don't: fees, interest, direct debits, dishonoured payments.</li><li><b>Adjust the statement</b> for things you know and the bank doesn't yet: deposits in transit (add), payments not yet cleared (subtract).</li></ol><p>When both corrected figures agree, you have proved the cash balance.</p>",
      example: "<table><tr><td>Cash book 12,400 − bank fee 35</td><td class='num'>12,365</td></tr><tr><td>Statement 11,815 + deposit in transit 1,200 − uncleared payment 650</td><td class='num'>12,365</td></tr></table>",
      gens: ['bankRec'],
      pool: [
        {q: 'Which item adjusts the cash book (your records), not the bank statement?', o: ['A deposit not yet credited by the bank', 'A payment not yet cleared', 'Bank interest earned that you have not recorded', 'A cheque in the mail'], a: 2, e: 'The bank has already recorded the interest; your books have not, so you correct the books.'},
        {q: 'Why does a large, long-unresolved difference in a bank reconciliation matter?', o: ['It does not matter if small', 'It may hide errors, missing transactions or fraud', 'It reduces GST', 'It changes the bank\'s records'], a: 1, e: 'Unexplained differences are a classic warning sign. Reconcile regularly and clear differences quickly.'}
      ]}
  ];
  w.days.forEach(d => { d.concepts = w.concepts.filter(c => c.day === d.n).map(c => c.id); });
  // tag quiz questions with concepts so results feed the mastery tracker
  const tags = ['debit-credit','debit-credit','gst-entries','debit-credit','journal-ledger','chart-accounts','tb-errors','tb-errors','trial-balance','prepaid-accrued','unearned','prepaid-accrued','adjusting','closing','bank-rec'];
  w.quiz.mc.forEach((q, i) => q.c = tags[i]);
  w.glossary = [
    ['Accrued expense', 'An expense incurred but not yet billed or paid; recorded as a liability.'],
    ['Accrued revenue', 'Revenue earned but not yet invoiced; recorded as an asset.'],
    ['Accumulated depreciation', 'The total depreciation charged on an asset so far, deducted from its cost on the balance sheet.'],
    ['Adjusting entry', 'An end-of-period journal that puts revenue and expenses in the right period.'],
    ['Bank reconciliation', 'A statement that explains the difference between the cash book and the bank statement.'],
    ['BAS', 'Business activity statement: the form used to report and pay GST, PAYG withholding and other taxes to the ATO.'],
    ['Chart of accounts', 'The list of all accounts a business uses, grouped as assets, liabilities, equity, revenue and expenses.'],
    ['Closing entry', 'A year-end journal that resets revenue and expense accounts to zero and moves profit into retained earnings.'],
    ['Contra account', 'An account that offsets another, such as accumulated depreciation against an asset.'],
    ['Control account', 'A general ledger account whose balance equals the total of a subsidiary ledger.'],
    ['Credit (Cr)', 'The right-hand side of an account. Increases liabilities, equity and revenue.'],
    ['DEALER', 'Memory aid: Drawings, Expenses, Assets increase with debits; Liabilities, Equity, Revenue with credits.'],
    ['Debit (Dr)', 'The left-hand side of an account. Increases assets, expenses and drawings.'],
    ['Deposit in transit', 'Money recorded in the cash book but not yet shown on the bank statement.'],
    ['Double-entry bookkeeping', 'Recording every transaction with equal debits and credits in at least two accounts.'],
    ['General journal', 'The book of original entry: transactions in date order with debits, credits and a narration.'],
    ['General ledger', 'The collection of all accounts, each showing its entries and balance.'],
    ['GST payable', 'GST charged on sales, owed to the ATO.'],
    ['GST receivable', 'GST paid on business purchases that can be claimed back as an input tax credit.'],
    ['Posting', 'Copying journal entries into the ledger accounts.'],
    ['Prepaid expense', 'An expense paid in advance; the unused part is an asset.'],
    ['Retained earnings', 'Accumulated profits kept in the business rather than paid out as dividends.'],
    ['Subsidiary ledger', 'A detailed ledger of individual customers or suppliers that supports a control account.'],
    ['Suspense account', 'A temporary account holding an unexplained difference until it is found.'],
    ['T-account', 'A simple drawing of a ledger account with debits on the left and credits on the right.'],
    ['Transposition error', 'Two digits swapped, e.g. $540 written as $450; the difference divides by 9.'],
    ['Trial balance', 'A list of all ledger balances to check total debits equal total credits.'],
    ['Unearned revenue', 'Cash received for goods or services not yet provided; a liability.']
  ].map(([t, d]) => ({t, d, week: 5}));
})();
