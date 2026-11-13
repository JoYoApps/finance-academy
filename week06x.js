// Week 6 adaptive layer: concepts (with a second explanation, a worked example, practice), glossary, quiz tags.
// Leverage (Mitch's weak spot from Week 1) comes back twice: operating leverage (Day 3) and debt in the bottom line (Day 5).
(function(){
  const w = window.WEEKS.find(x => x.week === 6);
  w.concepts = [
    {id: 'rev-recognition', name: 'Revenue recognition (AASB 15)', day: 1,
      explain: "<p>Think of revenue as a scoreboard for <b>promises kept</b>. Each time the business hands over what it promised (a bag of beans, a month of service), it scores the revenue for that promise. Cash is a separate scoreboard.</p><ul><li>Delivered all at once: revenue at that point in time.</li><li>Delivered bit by bit (subscriptions, service plans, construction): revenue over time.</li><li>Paid but not yet delivered: a contract liability.</li></ul><p>And if the business only arranges a sale for someone else (an agent), its 'promise' is the arranging, so only the commission is revenue.</p>",
      example: "<table><tr><th>Deal</th><th>Revenue this year (year end 30 June)</th></tr><tr><td>$360 bean subscription paid 1 April, 12 months</td><td class='num'>$90</td></tr><tr><td>$100 gift card sold 20 June, unused</td><td class='num'>$0</td></tr><tr><td>Kitchen finished 28 June, invoiced 3 July, $20,000</td><td class='num'>$20,000</td></tr><tr><td>Agent sells $5,000 holiday, keeps $500</td><td class='num'>$500</td></tr></table>",
      gens: ['subscriptionRev'],
      pool: [
        {q: 'A store sells a $200 gift card on 25 June. Its year ends 30 June. How much revenue does it record this year?', o: ['$200', '$0', '$100', '$181.82'], a: 1, e: 'The store still owes goods worth $200, so it is a liability until the card is used.'},
        {q: 'Which of these is the first step of the AASB 15 five-step model?', o: ['Allocate the price', 'Identify the contract with the customer', 'Recognise revenue', 'Issue an invoice'], a: 1, e: 'Contract, performance obligations, transaction price, allocation, recognition.'},
        {q: 'A retailer buys stock, holds it, and sells it for $1,000. Is it principal or agent, and what revenue does it report?', o: ['Agent, its margin only', 'Principal, $1,000', 'Agent, $1,000', 'Principal, nil'], a: 1, e: 'It controls the goods before sale, so it is the principal and reports the gross sale.'}
      ]},
    {id: 'rev-allocation', name: 'Allocating a bundled price', day: 1,
      explain: "<p>When several things are sold for one price, share the price out in proportion to what each would sell for on its own (its <b>stand-alone selling price</b>). Then recognise each part when that part is delivered.</p><p class='formula'>Part's share = bundle price × part's stand-alone price ÷ total stand-alone prices</p>",
      example: "<table><tr><th>Item</th><th class='num'>Stand-alone</th><th class='num'>Allocated</th><th>When</th></tr><tr><td>Machine</td><td class='num'>2,400</td><td class='num'>2,160</td><td>On delivery</td></tr><tr><td>12-month service</td><td class='num'>600</td><td class='num'>540</td><td>$45 a month</td></tr><tr><td><b>Total</b></td><td class='num'><b>3,000</b></td><td class='num'><b>2,700</b></td><td></td></tr></table>",
      gens: ['revAllocate'],
      pool: [
        {q: 'A phone (stand-alone $1,200) and 12 months of service (stand-alone $600) are sold together for $1,440. How much is allocated to the phone?', o: ['$1,200', '$960', '$1,440', '$840'], a: 1, e: '$1,440 × 1,200 ÷ 1,800 = $960. The service gets $480, recognised over 12 months.'},
        {q: 'Why does it matter how a bundle price is allocated?', o: ['It changes the total revenue', 'It changes when revenue is recognised', 'It changes GST', 'It does not matter'], a: 1, e: 'The total is the same, but parts delivered now are recognised now and parts delivered over time are spread.'}
      ]},
    {id: 'cogs', name: 'Cost of sales and inventory', day: 2,
      explain: "<p>Picture a coffee roaster's storeroom. At the start of the year it holds some beans. During the year more arrive. At the end, some are still on the shelf. Whatever is <b>not</b> on the shelf at the end was used up: that is the cost of sales.</p><p class='formula'>What you started with + what came in − what is left = what was used</p><p>So the closing stocktake drives profit directly: count too much stock and profit is overstated.</p>",
      example: "<table><tr><td>Opening inventory</td><td class='num'>120,000</td></tr><tr><td>+ Purchases and roasting costs</td><td class='num'>1,010,000</td></tr><tr><td>− Closing inventory</td><td class='num'>140,000</td></tr><tr><td><b>Cost of sales</b></td><td class='num'><b>990,000</b></td></tr></table>",
      gens: ['cogsFormula', 'grossMarginCalc'],
      pool: [
        {q: 'Closing stock is overstated by $10,000 because a pallet was counted twice. What is the effect on gross profit?', o: ['Understated by $10,000', 'Overstated by $10,000', 'No effect', 'Overstated by $20,000'], a: 1, e: 'Higher closing stock means lower cost of sales, so gross profit is overstated by $10,000.'},
        {q: 'Which is part of cost of sales for a coffee roaster?', o: ['Head office rent', 'Green beans used in roasting', 'Marketing', 'Interest on the bank loan'], a: 1, e: 'The direct cost of the goods sold. Rent for head office and marketing are operating expenses; interest is below EBIT.'}
      ]},
    {id: 'inventory-methods', name: 'FIFO, weighted average and NRV', day: 2,
      explain: "<p>When identical items are bought at different prices, you need a rule for which cost goes to the sale.</p><ul><li><b>FIFO</b>: the oldest cost goes out first; closing stock is at the newest prices.</li><li><b>Weighted average</b>: every unit carries the average cost.</li><li><b>LIFO</b> is not allowed in Australia (AASB 102).</li></ul><p>Then a check: if stock will sell for less than it cost (net of selling costs), write it down to <b>net realisable value</b>.</p>",
      example: "<table><tr><th>1,000 @ $20 then 1,000 @ $24; 1,500 sold</th><th class='num'>COGS</th><th class='num'>Closing</th></tr><tr><td>FIFO</td><td class='num'>32,000</td><td class='num'>12,000</td></tr><tr><td>Weighted average</td><td class='num'>33,000</td><td class='num'>11,000</td></tr></table>",
      gens: ['fifoWavg'],
      pool: [
        {q: 'Stock cost $8,000 but can only be sold for $3,500, with $500 of selling costs. What is the write-down?', o: ['$4,500', '$5,000', '$4,000', 'Nil'], a: 1, e: 'Net realisable value = $3,500 − $500 = $3,000. Write down $8,000 − $3,000 = $5,000.'},
        {q: 'When purchase prices are rising, which method gives the higher reported profit?', o: ['Weighted average', 'FIFO', 'They are always equal', 'LIFO'], a: 1, e: 'FIFO charges the older, cheaper costs to cost of sales.'}
      ]},
    {id: 'opex-ebitda', name: 'Operating expenses and EBITDA', day: 3,
      explain: "<p>Peel the income statement like an onion. Under gross profit come the costs of running the business: people, premises, marketing, admin. What is left is <b>EBITDA</b>: the earnings from operations before how the business is funded (interest), what tax it pays, and the accounting for its past asset purchases (D&A).</p><p>Use it to compare businesses. Never mistake it for cash or profit: the assets still need replacing, and the lenders and the ATO still need paying.</p>",
      example: "<table><tr><td>Gross profit</td><td class='num'>810,000</td></tr><tr><td>− Operating expenses</td><td class='num'>540,000</td></tr><tr><td><b>EBITDA</b></td><td class='num'><b>270,000</b> (15%)</td></tr></table>",
      gens: ['ebitdaCalc', 'operatingLeverage'],
      pool: [
        {q: 'Why do buyers often value small businesses on a multiple of EBITDA?', o: ['It is the same as cash flow', 'It compares operating earnings regardless of funding and tax', 'It is required by the ATO', 'It includes depreciation'], a: 1, e: 'It strips out financing, tax and D&A so different businesses can be compared. It still needs adjusting for capital spending.'},
        {q: 'A business has high fixed operating costs. If sales fall 10%, EBITDA will most likely fall:', o: ['Less than 10%', 'Exactly 10%', 'More than 10%', 'Not at all'], a: 2, e: 'Fixed costs do not fall with sales, so earnings fall faster: operating leverage.'}
      ]},
    {id: 'non-ifrs', name: 'EBITDA, adjustments and non-IFRS numbers', day: 3,
      explain: "<p>Statutory profit follows the accounting standards. 'Underlying', 'adjusted' or 'normalised' numbers are chosen by management. ASIC's RG 230 asks listed companies to show statutory profit at least as prominently, explain the measure and reconcile it. AASB 18 (from 2027) brings similar rules into the financial statements themselves.</p><p>Your job as a reader: list every add-back and ask, is it really one-off? A cost that appears every year is a cost.</p>",
      example: "<table><tr><td>Statutory EBITDA</td><td class='num'>9.0m</td></tr><tr><td>+ Restructuring (3rd year running)</td><td class='num'>1.5m</td></tr><tr><td>+ Share-based pay</td><td class='num'>1.5m</td></tr><tr><td>'Underlying EBITDA'</td><td class='num'>12.0m</td></tr></table>",
      gens: [],
      pool: [
        {q: 'A company adds back "one-off" restructuring costs that have appeared in each of the last four years. The best response is:', o: ['Accept the adjusted figure', 'Treat them as a recurring cost', 'Ignore statutory profit', 'Add them back twice'], a: 1, e: 'Costs that recur are part of running the business.'},
        {q: 'EBITDA is best described as:', o: ['An accounting standard measure of profit', 'Non-IFRS financial information', 'Cash flow from operations', 'Taxable income'], a: 1, e: 'No accounting standard defines EBITDA. It is non-IFRS information under ASIC RG 230.'}
      ]},
    {id: 'dep-methods', name: 'Depreciation methods and estimates', day: 4,
      explain: "<p>Depreciation is an estimate of how much of an asset was used up. Three choices change it: useful life, residual value and method.</p><ul><li><b>Straight line</b>: the same amount every year.</li><li><b>Diminishing value</b>: a fixed % of what is left, so big early, small later. ATO rate = 200% ÷ effective life.</li></ul><p>Longer lives and higher residual values lower depreciation and raise profit, without any change in the real business.</p>",
      example: "<table><tr><th>$50,000, 5 years</th><th class='num'>Yr 1</th><th class='num'>Yr 2</th><th class='num'>Yr 3</th></tr><tr><td>Straight line</td><td class='num'>10,000</td><td class='num'>10,000</td><td class='num'>10,000</td></tr><tr><td>Diminishing value 40%</td><td class='num'>20,000</td><td class='num'>12,000</td><td class='num'>7,200</td></tr></table>",
      gens: ['dvDep', 'depreciation'],
      pool: [
        {q: 'What diminishing value rate does the ATO formula give for an asset with an 8-year effective life?', o: ['12.5%', '25%', '8%', '16%'], a: 1, e: '200% ÷ 8 = 25%.'},
        {q: 'Which change would increase reported profit?', o: ['Shortening useful lives', 'Lowering residual values', 'Lengthening useful lives', 'Switching from straight line to diminishing value on new assets'], a: 2, e: 'A longer life spreads the cost over more years, lowering annual depreciation.'}
      ]},
    {id: 'amortisation-intangibles', name: 'Amortisation and EBIT', day: 4,
      explain: "<p>Amortisation is depreciation for intangible assets with a limited life: software, licences, customer lists bought with a business. Goodwill and other indefinite-life intangibles are not amortised; they are tested for impairment instead.</p><p>Take depreciation and amortisation off EBITDA and you get <b>EBIT</b>, also called operating profit: the earnings of the operations after the cost of using up assets.</p>",
      example: "<table><tr><td>EBITDA</td><td class='num'>270,000</td></tr><tr><td>− Depreciation</td><td class='num'>60,000</td></tr><tr><td>− Amortisation</td><td class='num'>10,000</td></tr><tr><td><b>EBIT</b></td><td class='num'><b>200,000</b></td></tr></table>",
      gens: [],
      pool: [
        {q: 'Which of these is amortised rather than depreciated?', o: ['A delivery van', 'A three-year software licence', 'Land', 'A coffee roaster'], a: 1, e: 'Intangible assets with finite lives are amortised. Land is not depreciated at all.'},
        {q: 'Goodwill from buying a business is:', o: ['Amortised over 20 years', 'Depreciated straight line', 'Not amortised, but tested for impairment', 'Expensed immediately'], a: 2, e: 'Under AASB 3 and AASB 136, goodwill is not amortised; it is tested for impairment at least annually.'}
      ]},
    {id: 'interest-cover', name: 'Interest, leverage and interest cover', day: 5,
      explain: "<p>Interest is a fixed charge that sits between operating profit and the owners. That gives two lessons:</p><ol><li><b>Interest cover</b> = EBIT ÷ interest: how many times over the business can pay its interest. Lenders watch it closely.</li><li><b>Financial leverage</b>: because interest does not fall when profits fall, net profit moves by a bigger percentage than EBIT. Debt magnifies good years and bad years, the same idea as a home deposit in Week 3.</li></ol>",
      example: "<table><tr><th>EBIT</th><th class='num'>Interest</th><th class='num'>Cover</th><th class='num'>Net profit (25% tax)</th></tr><tr><td>200,000</td><td class='num'>40,000</td><td class='num'>5.0×</td><td class='num'>120,000</td></tr><tr><td>120,000</td><td class='num'>40,000</td><td class='num'>3.0×</td><td class='num'>60,000</td></tr></table>",
      gens: ['interestCover', 'gearingROE', 'leverage'],
      pool: [
        {q: 'EBIT falls 40% and interest stays the same. Net profit will fall by:', o: ['Less than 40%', 'Exactly 40%', 'More than 40%', 'It will rise'], a: 2, e: 'Fixed interest magnifies the fall: financial leverage.'},
        {q: 'A loan covenant requires interest cover of at least 2.5×. EBIT is $300,000. What is the most interest the business can carry?', o: ['$750,000', '$120,000', '$75,000', '$300,000'], a: 1, e: '$300,000 ÷ 2.5 = $120,000.'}
      ]},
    {id: 'tax-npat', name: 'Tax, net profit and EPS', day: 5,
      explain: "<p>After interest comes income tax. Australian companies pay 25% (base rate entities) or 30%. The tax line is income tax <b>expense</b>, which can differ from the tax actually payable this year because of timing differences such as different tax depreciation (deferred tax).</p><p>What is left is <b>net profit after tax</b>, which belongs to the shareholders. Divide by the number of shares for <b>earnings per share</b>. Dividends come out of this profit; they are not an expense.</p>",
      example: "<table><tr><td>Profit before tax</td><td class='num'>160,000</td></tr><tr><td>Tax at 25%</td><td class='num'>−40,000</td></tr><tr><td>Net profit after tax</td><td class='num'>120,000</td></tr><tr><td>EPS (100,000 shares)</td><td class='num'>$1.20</td></tr></table>",
      gens: ['npatCalc', 'epsCalc'],
      pool: [
        {q: 'A company with $40m turnover and mainly trading income has profit before tax of $1m. Roughly what tax expense would you expect?', o: ['$300,000', '$250,000', '$450,000', '$150,000'], a: 1, e: 'Turnover under $50m with no more than 80% passive income: base rate entity at 25%. Differences between accounting and taxable income could move the actual figure.'},
        {q: 'Where do dividends appear?', o: ['As an expense above net profit', 'As a reduction of retained earnings, out of net profit', 'In cost of sales', 'They do not appear anywhere'], a: 1, e: 'Dividends are distributions to owners, not expenses.'}
      ]},
    {id: 'common-size', name: 'Reading an income statement', day: 5,
      explain: "<p>Turn every line into a percentage of revenue. Suddenly a $1.8m café-roaster and a $40m chain can be compared, and this year can sit next to last year. Then ask the six questions: revenue trend, gross margin, overheads, D&A weight, interest cover, and every 'one-off'.</p>",
      example: "<table><tr><th></th><th class='num'>Last year</th><th class='num'>This year</th></tr><tr><td>Gross margin</td><td class='num'>48.0%</td><td class='num'>45.0%</td></tr><tr><td>EBITDA margin</td><td class='num'>16.5%</td><td class='num'>15.0%</td></tr><tr><td>Net margin</td><td class='num'>7.5%</td><td class='num'>6.7%</td></tr></table><p class='note'>First question: why did gross margin fall 3 points? Bean prices, discounting, or product mix?</p>",
      gens: ['grossMarginCalc'],
      pool: [
        {q: 'Revenue grew 20% but gross margin fell from 50% to 40%. Gross profit:', o: ['Rose 20%', 'Fell about 4%', 'Rose about 4%', 'Was unchanged'], a: 1, e: 'Old GP = 0.5R. New GP = 0.4 × 1.2R = 0.48R. Down 4%.'},
        {q: 'In a common-size income statement, every line is shown as a percentage of:', o: ['Total assets', 'Net profit', 'Revenue', 'Equity'], a: 2, e: 'Revenue is 100%, and each line is a share of it.'}
      ]}
  ];
  w.days.forEach(d => { d.concepts = w.concepts.filter(c => c.day === d.n).map(c => c.id); });
  // tag quiz questions with concepts so results feed the mastery tracker
  const tags = ['rev-recognition','rev-recognition','rev-allocation','rev-recognition','cogs','inventory-methods','inventory-methods','cogs','opex-ebitda','non-ifrs','dep-methods','dep-methods','dep-methods','interest-cover','tax-npat'];
  w.quiz.mc.forEach((q, i) => q.c = tags[i]);
  w.glossary = [
    ['AASB 15', 'Revenue from Contracts with Customers: the standard on when and how much revenue to recognise.'],
    ['AASB 18', 'Presentation and Disclosure in Financial Statements: replaces AASB 101 for for-profit entities for years starting on or after 1 January 2027 (not-for-profits from 2028).'],
    ['Amortisation', 'Spreading the cost of an intangible asset with a finite life over that life.'],
    ['Common-size statement', 'A financial statement with every line expressed as a percentage of revenue (or total assets).'],
    ['Contract liability', 'Cash received for goods or services not yet delivered; also called unearned revenue.'],
    ['Cost of sales', 'The cost of the goods or services sold in the period; also called cost of goods sold (COGS).'],
    ['Diminishing value', 'Depreciation at a fixed percentage of the remaining book value each year.'],
    ['EBIT', 'Earnings before interest and tax; often called operating profit.'],
    ['EBITDA', 'Earnings before interest, tax, depreciation and amortisation. Non-IFRS.'],
    ['Earnings per share (EPS)', 'Net profit after tax divided by the number of ordinary shares.'],
    ['FIFO', 'First in, first out: the oldest inventory costs are charged to cost of sales first.'],
    ['Gross margin', 'Gross profit as a percentage of revenue.'],
    ['Gross profit', 'Revenue minus cost of sales.'],
    ['Income statement', 'The statement of profit or loss: revenue less expenses for a period.'],
    ['Interest cover', 'EBIT divided by interest expense: how many times profit covers interest.'],
    ['Net profit after tax (NPAT)', 'Profit left for shareholders after all expenses, interest and tax.'],
    ['Net realisable value', 'Expected selling price less the costs to complete and sell.'],
    ['Non-IFRS information', 'Measures such as EBITDA or underlying profit that are not defined by accounting standards (ASIC RG 230).'],
    ['Operating leverage', 'The magnifying effect of fixed costs on earnings when sales change.'],
    ['Performance obligation', 'A distinct good or service promised to a customer in a contract.'],
    ['Principal vs agent', 'A principal controls goods before sale and reports gross revenue; an agent reports its commission only.'],
    ['Stand-alone selling price', 'The price at which a good or service would be sold separately; used to allocate bundle prices.'],
    ['Straight-line depreciation', 'Equal depreciation each year: (cost − residual) ÷ useful life.'],
    ['Weighted average cost', 'Inventory method using the average cost of all units available.']
  ].map(([t, d]) => ({t, d, week: 6}));
})();
