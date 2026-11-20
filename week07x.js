// Week 7 adaptive layer: concepts (with a second explanation, a worked example, practice), glossary, quiz tags.
// Leverage (Mitch's weak spot from Week 1) comes back as leases as hidden debt (Day 4) and ROE = ROA × equity multiplier (Day 5).
(function(){
  const w = window.WEEKS.find(x => x.week === 7);
  w.concepts = [
    {id: 'current-assets', name: 'Current assets and the snapshot', day: 1,
      explain: "<p>Picture the business frozen at midnight on 30 June. The balance sheet lists everything it owns at that instant, and who has a claim on it: lenders and suppliers first (liabilities), owners with whatever is left (equity).</p><p><b>Current</b> just means 'turns into cash or gets used up within about a year'. Cash, money customers owe, stock on the shelves and expenses paid in advance are all current.</p>",
      example: "<table><tr><th>Item at 30 June</th><th>Current?</th></tr><tr><td>Bank account</td><td>Yes: cash</td></tr><tr><td>2-month term deposit (when bought)</td><td>Yes: cash equivalent</td></tr><tr><td>12-month term deposit</td><td>Yes, but not a cash equivalent</td></tr><tr><td>Insurance paid for July to March</td><td>Yes: prepayment</td></tr><tr><td>Delivery van</td><td>No: non-current</td></tr></table>",
      gens: ['prepaymentCalc'],
      pool: [
        {q: 'The balance sheet shows a business:', o: ['Over a period, like a video', 'At one moment, like a photo', 'Only its cash', 'Only its profit'], a: 1, e: 'The balance sheet is a snapshot at the reporting date; the income statement covers a period.'},
        {q: 'An asset is classified as current if it is expected to be realised or used within:', o: ['3 months', '12 months (or the operating cycle)', '5 years', 'The life of the business'], a: 1, e: 'Twelve months after the reporting date, or the normal operating cycle.'},
        {q: 'Rent paid in advance for next quarter is:', o: ['An expense now', 'A prepayment (current asset)', 'A liability', 'Equity'], a: 1, e: 'The unused part of a payment in advance is an asset until it is used.'}
      ]},
    {id: 'receivables-ecl', name: 'Receivables and expected credit losses', day: 1,
      explain: "<p>Not every customer pays. Rather than wait for a customer to go broke, the business estimates now how much of what it is owed it will probably never collect, and shows receivables <b>net</b> of that estimate.</p><p>The older a debt, the less likely it is to be paid, so each age band gets a higher loss rate. Add up (amount × rate) for each band: that is the <b>allowance for expected credit losses</b>.</p>",
      example: "<table><tr><th>Age</th><th class='num'>Owed</th><th class='num'>Rate</th><th class='num'>Allowance</th></tr><tr><td>Not yet due</td><td class='num'>100,000</td><td class='num'>1%</td><td class='num'>1,000</td></tr><tr><td>1–30 overdue</td><td class='num'>40,000</td><td class='num'>5%</td><td class='num'>2,000</td></tr><tr><td>31–60 overdue</td><td class='num'>12,000</td><td class='num'>15%</td><td class='num'>1,800</td></tr><tr><td>60+ overdue</td><td class='num'>8,000</td><td class='num'>65%</td><td class='num'>5,200</td></tr><tr><td><b>Total</b></td><td class='num'>160,000</td><td></td><td class='num'><b>10,000</b></td></tr></table><p>Net receivables $150,000.</p>",
      gens: ['eclAllowance'],
      pool: [
        {q: 'Why do receivables more than 60 days overdue get a higher expected loss rate?', o: ['The law requires it', 'Older debts are less likely to be paid', 'They earn interest', 'GST applies'], a: 1, e: 'The longer a debt is overdue, the higher the chance it will never be collected.'},
        {q: 'An increase in the allowance for expected credit losses:', o: ['Increases profit', 'Is an expense that reduces profit', 'Increases cash', 'Has no effect on profit'], a: 1, e: 'Topping up the allowance is recorded as an expense (bad and doubtful debts).'},
        {q: 'Which accounting standard sets the expected credit loss model for receivables?', o: ['AASB 9', 'AASB 15', 'AASB 16', 'AASB 102'], a: 0, e: 'AASB 9 Financial Instruments.'}
      ]},
    {id: 'wc-days', name: 'Working capital days', day: 1,
      explain: "<p>Think of cash going round a loop: you pay for stock, the stock sits on the shelf, you sell it on credit, and the customer eventually pays. The <b>cash conversion cycle</b> measures how long your own money is tied up on that loop.</p><p class='formula'>Debtor days + inventory days − creditor days</p><p>Getting customers to pay faster, holding less stock, or paying suppliers later (within the terms) all shorten it and free up cash.</p>",
      example: "<p>Harbour: debtor days 30, inventory days 52, creditor days 41.</p><p class='formula'>30 + 52 − 41 = 41 days</p><p>If Harbour cut inventory days to 40, about $32,500 of cash would be released (12 days × $990,000 ÷ 365).</p>",
      gens: ['cashCycle'],
      pool: [
        {q: 'Debtor days 40, inventory days 30, creditor days 35. What is the cash conversion cycle?', o: ['105 days', '35 days', '45 days', '5 days'], a: 1, e: '40 + 30 − 35 = 35 days.'},
        {q: 'Which change shortens the cash conversion cycle?', o: ['Customers paying more slowly', 'Holding more stock', 'Collecting from customers faster', 'Paying suppliers sooner'], a: 2, e: 'Faster collection cuts debtor days.'},
        {q: 'Inventory days are usually calculated using:', o: ['Inventory ÷ cost of sales × 365', 'Inventory ÷ cash × 365', 'Cost of sales ÷ inventory', 'Inventory ÷ equity'], a: 0, e: 'Inventory is held at cost, so it is compared with cost of sales.'}
      ]},
    {id: 'ppe-capitalise', name: 'Property, plant and equipment', day: 2,
      explain: "<p>Ask one question: <b>does this spending create or improve something that will help the business for more than a year?</b> If yes, it is an asset (capitalised) and its cost is spread over its life. If it just keeps things running as they are, it is an expense now.</p><p>An asset's <b>carrying amount</b> is what is left of its cost after depreciation. It is not what you could sell it for.</p>",
      example: "<table><tr><th>Spending</th><th>Treatment</th></tr><tr><td>New van $45,000 + $2,000 signwriting</td><td>Asset $47,000</td></tr><tr><td>Van service $600</td><td>Expense</td></tr><tr><td>New engine that adds 5 years of life</td><td>Added to the asset</td></tr></table><p>A $47,000 van depreciated straight line over 5 years: carrying amount after 2 years = $47,000 − $18,800 = $28,200.</p>",
      gens: ['depreciation'],
      pool: [
        {q: 'Which is part of the cost of a new machine?', o: ['Freight to deliver it', 'Its annual service', 'Training staff to use it', 'Interest on general overdraft'], a: 0, e: 'Costs needed to get the asset to its location and working condition are capitalised.'},
        {q: 'A business records repairs as assets instead of expenses. What happens to this year\'s profit?', o: ['It is understated', 'It is overstated', 'No effect', 'Cash rises'], a: 1, e: 'Expenses are moved to the balance sheet, so profit looks higher.'},
        {q: 'Under the AASB 116 revaluation model, a revaluation increase usually goes to:', o: ['Revenue', 'An asset revaluation surplus in equity', 'Cost of sales', 'Retained earnings directly as profit'], a: 1, e: 'Increases go to other comprehensive income and the revaluation surplus, not to profit.'}
      ]},
    {id: 'impairment', name: 'Impairment of assets', day: 2,
      explain: "<p>An asset must not be shown at more than it can earn back. The business asks: <b>would I get more by selling it, or by keeping and using it?</b> Whichever is higher is the <b>recoverable amount</b>. If the book value is above that, the difference is written off as an impairment loss.</p><p>Think of it as a reality check on the balance sheet, triggered by bad news such as falling sales, damage or higher interest rates.</p>",
      example: "<table><tr><td>Carrying amount</td><td class='num'>60,000</td></tr><tr><td>Sell it: fair value less costs of disposal</td><td class='num'>25,000</td></tr><tr><td>Keep it: value in use</td><td class='num'>40,000</td></tr><tr><td>Recoverable amount (higher)</td><td class='num'>40,000</td></tr><tr><td><b>Impairment loss</b></td><td class='num'><b>20,000</b></td></tr></table>",
      gens: ['impairmentCalc'],
      pool: [
        {q: 'Recoverable amount is:', o: ['The lower of fair value less costs of disposal and value in use', 'The higher of fair value less costs of disposal and value in use', 'Always the market price', 'Original cost'], a: 1, e: 'AASB 136: the higher of the two.'},
        {q: 'Which is an indicator that an asset may be impaired?', o: ['Sales of its product rising', 'Interest rates falling', 'The asset being damaged', 'A new coat of paint'], a: 2, e: 'Physical damage is a classic indicator. Rising interest rates (not falling) are another.'},
        {q: 'After an impairment, future depreciation is based on:', o: ['The original cost', 'The new, lower carrying amount', 'Nothing: depreciation stops', 'The fair value only'], a: 1, e: 'The written-down carrying amount is spread over the remaining life.'}
      ]},
    {id: 'intangibles-goodwill', name: 'Intangibles and goodwill', day: 2,
      explain: "<p>The rule of thumb: <b>if you bought it, it can go on the balance sheet; if you grew it yourself, it usually cannot</b>. A purchased licence, software or customer list is an intangible asset. A brand you built up over twenty years is not, however valuable.</p><p>Goodwill is the extra you pay for a whole business above the value of its separate parts: its reputation, staff and customer loyalty. It only appears when a business is bought, is never amortised, and is tested for impairment every year.</p>",
      example: "<table><tr><td>Price paid for a café</td><td class='num'>400,000</td></tr><tr><td>Fair value of equipment, stock and lease, less its debts</td><td class='num'>250,000</td></tr><tr><td><b>Goodwill</b></td><td class='num'><b>150,000</b></td></tr></table>",
      gens: [],
      pool: [
        {q: 'A company pays $2m for a business whose net assets have a fair value of $1.4m. What is goodwill?', o: ['$2m', '$1.4m', '$600,000', '$3.4m'], a: 2, e: '$2m − $1.4m = $600,000.'},
        {q: 'Which is NOT recognised as an intangible asset?', o: ['Purchased software', 'A licence bought for five years', 'An internally generated brand', 'A customer list bought from a competitor'], a: 2, e: 'AASB 138 prohibits recognising internally generated brands, mastheads, publishing titles and customer lists.'},
        {q: 'Research costs (before a product is shown to be feasible) are:', o: ['Capitalised as an intangible', 'Expensed', 'Added to goodwill', 'Treated as inventory'], a: 1, e: 'Research is always expensed; only development meeting strict criteria can be capitalised.'}
      ]},
    {id: 'provisions', name: 'Provisions and contingent liabilities', day: 3,
      explain: "<p>A provision is an <b>IOU with a question mark</b>: the business definitely owes something because of something that has already happened, but the exact amount or timing is uncertain.</p><p>Three tests: a <b>present obligation</b> from a <b>past event</b>; payment is <b>probable</b> (more likely than not); a <b>reliable estimate</b> can be made. Pass all three and it goes on the balance sheet. If payment is only possible, it is a contingent liability, mentioned in the notes.</p>",
      example: "<table><tr><th>Situation</th><th>Treatment</th></tr><tr><td>Warranty on 50 machines sold, 4% fail, $500 each</td><td>Provision $1,000</td></tr><tr><td>Lawsuit, loss probable, about $20,000</td><td>Provision $20,000</td></tr><tr><td>Lawsuit, loss possible only</td><td>Contingent liability (note)</td></tr><tr><td>Plan to refit the café next year</td><td>Nothing: no obligation yet</td></tr></table>",
      gens: ['warrantyProvision'],
      pool: [
        {q: 'Which is NOT one of the three tests for recognising a provision?', o: ['Present obligation from a past event', 'Probable outflow', 'Reliable estimate', 'Board approval of next year\'s budget'], a: 3, e: 'AASB 137 needs a present obligation, a probable outflow and a reliable estimate.'},
        {q: 'Annual leave owed to staff at year end is:', o: ['Ignored until taken', 'An employee benefit provision (liability)', 'Equity', 'An asset'], a: 1, e: 'Employees have earned the leave, so the business owes it.'},
        {q: 'A business plans to retrain staff next year. Does it record a provision now?', o: ['Yes, for the full cost', 'No: there is no present obligation from a past event', 'Yes, as a contingent liability', 'Only if it is over $10,000'], a: 1, e: 'Future plans that the business can still avoid are not obligations.'}
      ]},
    {id: 'liquidity-ratios', name: 'Liquidity ratios and debt classification', day: 3,
      explain: "<p>The question a supplier or lender asks: <b>if the next year's bills all arrived, could the business pay them from what it will turn into cash this year?</b></p><ul><li><b>Current ratio</b>: all current assets against current liabilities.</li><li><b>Quick ratio</b>: the same, but leaving out stock and prepayments, which may not turn into cash quickly.</li></ul><p>Remember the trap: a loan covenant breach can make all of a 'long-term' loan current overnight.</p>",
      example: "<table><tr><td>Current ratio: 390 ÷ 348</td><td class='num'>1.12</td></tr><tr><td>Quick ratio: (85 + 150) ÷ 348</td><td class='num'>0.68</td></tr></table><p>If a covenant breach made Harbour's other $400,000 of debt current, the current ratio would fall to 390 ÷ 748 = 0.52.</p>",
      gens: ['currentRatioCalc', 'quickRatioCalc'],
      pool: [
        {q: 'Why does the quick ratio leave out inventory?', o: ['Inventory is not an asset', 'Inventory may take time to sell and turn into cash', 'Inventory is non-current', 'Inventory includes GST'], a: 1, e: 'Stock has to be sold, and often collected on credit, before it becomes cash.'},
        {q: 'A $1m loan is repayable at $200,000 a year. How much is a current liability?', o: ['$1m', '$800,000', '$200,000', 'Nil'], a: 2, e: 'The part due within 12 months is current.'},
        {q: 'A business breaches a loan covenant at year end and the bank can demand repayment. What usually happens to the loan on the balance sheet?', o: ['Nothing', 'It becomes a current liability', 'It becomes equity', 'It is removed'], a: 1, e: 'Without a right to defer payment for at least 12 months, the loan is current (AASB 101).'}
      ]},
    {id: 'lease-accounting', name: 'Leases under AASB 16', day: 4,
      explain: "<p>Think of a lease as <b>buying the right to use something, with borrowed money</b>. The right to use is an asset; the promise to pay rent is a loan. So the business records both at the present value of the rent payments.</p><p>Each year the asset is depreciated, and the 'loan' accrues interest and is paid down by the rent. Because interest is highest early, the total expense is higher in early years and lower later, though the five-year total equals the rent.</p><p>Leverage link: lease payments are fixed obligations, just like loan repayments.</p>",
      example: "<table><tr><td>Rent $60,000 a year × 5 years, 6%</td><td class='num'>Liability 252,742</td></tr><tr><td>Year 1 interest</td><td class='num'>15,165</td></tr><tr><td>Year 1 depreciation</td><td class='num'>50,548</td></tr><tr><td>Year 1 expense (vs $60,000 rent)</td><td class='num'>65,713</td></tr><tr><td>Liability at year end</td><td class='num'>207,907</td></tr></table>",
      gens: ['leaseLiability', 'leaseYear1Expense'],
      pool: [
        {q: 'Which leases can a lessee choose to keep off the balance sheet under AASB 16?', o: ['All property leases', 'Leases of 12 months or less, and leases of low-value assets', 'Any lease under 5 years', 'Leases with a related party'], a: 1, e: 'The short-term and low-value exemptions.'},
        {q: 'Under AASB 16, where does the lessee\'s rent payment go?', o: ['All to rent expense', 'It reduces the lease liability (interest plus principal)', 'To the right-of-use asset', 'To equity'], a: 1, e: 'Each payment covers interest on the liability and repays part of it.'},
        {q: 'From when did AASB 16 apply in Australia?', o: ['1 July 2005', 'Annual periods beginning on or after 1 January 2019', '1 January 2027', '1 July 2016'], a: 1, e: 'AASB 16 applies to annual periods beginning on or after 1 January 2019.'}
      ]},
    {id: 'equity-dividends', name: 'Equity, retained earnings and dividends', day: 5,
      explain: "<p>Equity is the owners' share: what would be left if every asset were realised at book value and every debt paid. It grows two ways: owners putting money in (share capital) and the business keeping its profits (retained earnings).</p><p>A dividend hands some retained profit back to owners. It is <b>not</b> an expense, and the law (s 254T) only allows it if the company stays solvent: assets must exceed liabilities by enough, it must be fair to shareholders, and creditors must not be materially prejudiced.</p>",
      example: "<table><tr><td>Opening retained earnings</td><td class='num'>69,000</td></tr><tr><td>+ Net profit</td><td class='num'>120,000</td></tr><tr><td>− Dividends</td><td class='num'>(60,000)</td></tr><tr><td><b>Closing</b></td><td class='num'><b>129,000</b></td></tr></table><p>Equity = share capital $100,000 + retained earnings $129,000 = $229,000.</p>",
      gens: ['retainedEarnings'],
      pool: [
        {q: 'A company pays a $50,000 dividend. Which statement shows it?', o: ['Income statement, as an expense', 'Statement of changes in equity, reducing retained earnings', 'It is not recorded', 'As revenue of the company'], a: 1, e: 'Dividends are distributions to owners, recorded in equity.'},
        {q: 'Under s 254T, which is a condition for paying a dividend?', o: ['The company made a profit this year', 'Assets exceed liabilities immediately before declaring it, by enough to pay it', 'The bank approves', 'The dividend is fully franked'], a: 1, e: 'The test is a net assets test, plus fairness to shareholders and no material prejudice to creditors.'},
        {q: 'Assets are $800,000 and liabilities $550,000. What is equity?', o: ['$1,350,000', '$250,000', '$550,000', '$800,000'], a: 1, e: 'Equity = assets − liabilities = $250,000.'}
      ]},
    {id: 'roe-dupont', name: 'ROE and the equity multiplier', day: 5,
      explain: "<p>Return on equity tells owners what their money earned. But a high ROE can come from a great business, or from a lot of borrowing. Split it to see which:</p><p class='formula'>ROE = ROA × equity multiplier</p><p>ROA shows how well the <b>assets</b> earn, whoever funded them. The equity multiplier (assets ÷ equity) shows how many dollars of assets each owner dollar controls. A multiplier of 5 means 4 of every 5 dollars are borrowed or owed: the leverage multiple from Week 3, which magnifies losses as well as gains.</p>",
      example: "<table><tr><td>ROA = 120 ÷ 1,152</td><td class='num'>10.4%</td></tr><tr><td>Equity multiplier = 1,152 ÷ 229</td><td class='num'>5.03×</td></tr><tr><td>ROE</td><td class='num'>52.4%</td></tr></table><p>If profit fell to $20,000, ROA would be 1.7% and ROE 8.7%. A loss of $50,000 would wipe out over a fifth of equity.</p>",
      gens: ['roeDupont', 'bookValuePS'],
      pool: [
        {q: 'Two companies have ROA of 6%. A has an equity multiplier of 2, B of 6. Which has the higher ROE, and why?', o: ['A, because it is safer', 'B, because more debt multiplies its return on assets', 'They are equal', 'Cannot tell'], a: 1, e: 'ROE = 6% × 2 = 12% for A and 6% × 6 = 36% for B. B is far more highly geared, so its risk is higher too.'},
        {q: 'Total assets $2m, equity $500,000. What is the equity multiplier?', o: ['0.25', '4', '1.5', '2.5'], a: 1, e: '$2m ÷ $0.5m = 4.'},
        {q: 'Net profit $90,000 and equity $600,000. What is ROE?', o: ['6.7%', '15%', '90%', '1.5%'], a: 1, e: '$90,000 ÷ $600,000 = 15%.'}
      ]}
  ];
  w.days.forEach(d => { d.concepts = w.concepts.filter(c => c.day === d.n).map(c => c.id); });
  const tags = ['current-assets','receivables-ecl','current-assets','wc-days','ppe-capitalise','intangibles-goodwill','impairment','intangibles-goodwill','provisions','provisions','liquidity-ratios','lease-accounting','lease-accounting','equity-dividends','roe-dupont'];
  w.quiz.mc.forEach((q, i) => q.c = tags[i]);
  w.glossary = [
    ['AASB 16', 'Leases: lessees recognise a right-of-use asset and a lease liability for most leases, from 1 January 2019.'],
    ['Accumulated depreciation', 'The total depreciation charged on an asset since it was acquired.'],
    ['Allowance for expected credit losses', 'An estimate of receivables that will not be collected, deducted from gross receivables (AASB 9).'],
    ['Balance sheet', 'The statement of financial position: assets, liabilities and equity at one date.'],
    ['Carrying amount', 'An asset\'s cost less accumulated depreciation and impairment; its book value.'],
    ['Cash equivalents', 'Short-term, highly liquid investments with insignificant risk of change in value, usually maturing within three months.'],
    ['Contingent liability', 'A possible obligation, or one not probable or not measurable, disclosed in the notes but not recognised.'],
    ['Current ratio', 'Current assets divided by current liabilities.'],
    ['Equity multiplier', 'Total assets divided by equity; a measure of leverage.'],
    ['Goodwill', 'The amount paid for a business above the fair value of its identifiable net assets; not amortised, tested for impairment annually.'],
    ['Impairment loss', 'The amount by which an asset\'s carrying amount exceeds its recoverable amount (AASB 136).'],
    ['Lease liability', 'The present value of lease payments not yet paid.'],
    ['Provision', 'A liability of uncertain timing or amount (AASB 137).'],
    ['Quick ratio', '(Current assets − inventory − prepayments) ÷ current liabilities; also called the acid test.'],
    ['Recoverable amount', 'The higher of an asset\'s fair value less costs of disposal and its value in use.'],
    ['Retained earnings', 'Accumulated profits kept in the business after dividends.'],
    ['Return on assets (ROA)', 'Net profit divided by total assets.'],
    ['Return on equity (ROE)', 'Net profit after tax divided by equity.'],
    ['Right-of-use asset', 'A lessee\'s right to use a leased asset over the lease term.'],
    ['Section 254T', 'Corporations Act rule that a company may pay a dividend only if net assets are sufficient, it is fair to shareholders and creditors are not materially prejudiced.'],
    ['Share capital', 'Money contributed by shareholders in exchange for shares.'],
    ['Statement of changes in equity', 'The statement showing movements in share capital, reserves and retained earnings.'],
    ['Value in use', 'The present value of future cash flows expected from an asset.'],
    ['Working capital', 'Current assets minus current liabilities.']
  ].map(([t, d]) => ({t, d, week: 7}));
})();
