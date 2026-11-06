// Week 4 adaptive layer: concepts (with a second explanation, a worked example, practice), glossary, quiz tags.
// Leverage (Mitch's weak spot from Week 1) reappears in bank-leverage and gearing, with generators for both.
(function(){
  const w = window.WEEKS.find(x => x.week === 4);
  w.concepts = [
    {id: 'credit-creation', name: 'How banks create money', day: 1,
      explain: "<p>Think of a bank's ledger as a scoreboard. When it lends you $500,000, it writes +$500,000 on your loan account (you owe it) and +$500,000 on a deposit account (it owes the seller). Two new entries, both created at once. No saver's money was moved.</p><p>What limits the scoreboard is not deposits but <b>capital</b> (losses must be covered by shareholders' money), <b>liquidity</b> (cash to meet withdrawals) and finding borrowers who can repay.</p>",
      example: "<table><tr><th>Bank's books after a $500k home loan</th><th>Assets</th><th>Liabilities</th></tr><tr><td>New loan to buyer</td><td class='num'>+$500,000</td><td></td></tr><tr><td>New deposit for seller</td><td></td><td class='num'>+$500,000</td></tr></table>",
      gens: [],
      pool: [
        {q: 'What is the binding limit on bank lending in Australia?', o: ['A reserve requirement set by the RBA', 'Capital and liquidity standards set by APRA', 'The amount of banknotes printed', 'There is no limit'], a: 1, e: 'Australia has no reserve requirement; APRA capital and liquidity rules, profitability and borrower demand limit lending.'},
        {q: 'When a home loan is fully repaid, the money involved:', o: ['Goes to the RBA', 'Disappears from the money supply', 'Becomes a new loan automatically', 'Is paid to the government'], a: 1, e: 'Repayment cancels both the loan and the deposit used to repay it.'}
      ]},
    {id: 'bank-leverage', name: 'Bank leverage and the business model', day: 1,
      explain: "<p>A bank is the leverage idea from Week 3 taken to the extreme. A home buyer with a 20% deposit is 5× leveraged. A bank with 6% equity is about 17× leveraged.</p><ol><li>Multiple = assets ÷ equity.</li><li>Loss that wipes out equity = equity ÷ assets.</li><li>Profit = margin × assets − costs − bad debts − tax; ÷ equity = ROE.</li></ol><p>That is why a tiny margin can give a healthy return, and why a small rise in bad debts can sink a bank.</p>",
      example: "<table><tr><th>Equity ÷ assets</th><th>Multiple</th><th>Loss that wipes equity</th><th>ROE on $0.7bn profit, $100bn bank</th></tr><tr><td>5%</td><td class='num'>20×</td><td class='num'>5%</td><td class='num'>14.0%</td></tr><tr><td>6%</td><td class='num'>16.7×</td><td class='num'>6%</td><td class='num'>11.7%</td></tr><tr><td>8%</td><td class='num'>12.5×</td><td class='num'>8%</td><td class='num'>8.75%</td></tr></table>",
      gens: ['bankLeverage', 'bankROE', 'leverage'],
      pool: [
        {q: 'A bank with equity of 5% of assets has a leverage multiple of:', o: ['5×', '20×', '95×', '1.05×'], a: 1, e: '100 ÷ 5 = 20.'},
        {q: 'Why can a bank earn a double-digit return on equity from a 2% margin?', o: ['Banks pay no tax', 'Leverage: the margin is earned on assets many times larger than equity', 'Deposits cost nothing', 'The RBA subsidises banks'], a: 1, e: 'A 2% margin on $100bn of assets, funded with $6bn of equity, is magnified about 17 times before costs.'},
        {q: 'Holding more capital makes a bank:', o: ['Riskier, with a higher ROE', 'Safer, with a lower ROE', 'Safer, with a higher ROE', 'No different'], a: 1, e: 'More equity absorbs more losses, but profit is spread over more equity.'}
      ]},
    {id: 'fcs', name: 'Deposit protection', day: 1,
      explain: "<p>The Financial Claims Scheme is a government guarantee on deposits: up to $250,000 per person, per licensed bank, building society or credit union. Count licences, not brands, and remember that a fund or non-bank lender is never a deposit, however safe it sounds.</p>",
      example: "<table><tr><td>$400,000 at one bank</td><td class='num'>$250,000 covered</td></tr><tr><td>$200,000 at each of two licensed banks</td><td class='num'>$400,000 covered</td></tr><tr><td>$100,000 in a private credit fund</td><td class='num'>$0 covered</td></tr></table>",
      gens: ['fcsCover'],
      pool: [
        {q: 'Two bank brands share one banking licence. You hold $200,000 with each. How much is guaranteed?', o: ['$400,000', '$250,000', '$200,000', '$500,000'], a: 1, e: 'One licence, one $250,000 limit.'}
      ]},
    {id: 'debt-equity', name: 'Debt vs equity', day: 2,
      explain: "<p>Debt is a <b>promise</b>: fixed payments, a legal right to be paid, capped upside. Equity is a <b>share of what is left</b>: no promise, unlimited upside, first to absorb losses.</p><p>Because lenders take less risk, debt is cheaper. Interest is also tax deductible, so 7% costs a company 4.9% after 30% tax. Dividends are not deductible.</p>",
      example: "<table><tr><th>Source</th><th>Typical cost</th><th>After 30% tax</th></tr><tr><td>Bank loan</td><td class='num'>7%</td><td class='num'>4.9%</td></tr><tr><td>Shareholders' required return</td><td class='num'>10–12%+</td><td class='num'>not deductible</td></tr></table>",
      gens: ['afterTaxDebt'],
      pool: [
        {q: 'Which is a feature of equity rather than debt?', o: ['A legal right to fixed payments', 'Repayment on a set date', 'A claim on whatever is left after creditors', 'Tax-deductible payments'], a: 2, e: 'Shareholders are residual claimants.'},
        {q: 'A preference share usually ranks:', o: ['Ahead of secured lenders', 'Ahead of ordinary shares but behind all creditors', 'Equal with employees', 'Behind ordinary shares'], a: 1, e: 'Preference shares sit between creditors and ordinary shareholders.'}
      ]},
    {id: 'gearing', name: 'Gearing a company', day: 2,
      explain: "<p>This is the same see-saw as your property example, inside a company. Swap some of the owners' money for a loan and each dollar of equity now controls more assets.</p><ol><li>Find EBIT (operating profit).</li><li>Take off interest on the debt.</li><li>Take off tax.</li><li>Divide by the equity that remains.</li></ol><p>If the assets earn more than the loan rate, ROE rises. If they earn less, ROE falls, and interest still has to be paid.</p>",
      example: "<table><tr><th>$10m assets, 50% debt at 7%</th><th>All equity ROE</th><th>Geared ROE</th></tr><tr><td>Assets earn 20%</td><td class='num'>14.0%</td><td class='num'>23.1%</td></tr><tr><td>Assets earn 12%</td><td class='num'>8.4%</td><td class='num'>11.9%</td></tr><tr><td>Assets earn 4%</td><td class='num'>2.8%</td><td class='num'>0.7%</td></tr></table>",
      gens: ['gearingROE', 'gearedReturn'],
      pool: [
        {q: 'A company\'s assets earn 5% before tax and it borrows at 8%. Adding more debt will:', o: ['Raise ROE', 'Lower ROE', 'Not change ROE', 'Eliminate tax'], a: 1, e: 'Debt costs more than the assets earn, so each borrowed dollar loses money for owners.'},
        {q: 'Which business can usually carry the most debt safely?', o: ['A pre-profit tech start-up', 'A utility with stable cash flows and hard assets', 'A restaurant in its first year', 'A biotech awaiting trial results'], a: 1, e: 'Stable cash flows and assets lenders can take as security support more debt.'}
      ]},
    {id: 'waterfall', name: 'Who gets paid first', day: 2,
      explain: "<p>Picture a line of buckets stacked down a hill. Money from selling the assets fills the top bucket first and only spills down when it is full: secured lenders (from their own security), liquidation costs, employees, unsecured creditors, and finally shareholders at the bottom, who are usually left dry.</p>",
      example: "<table><tr><td>Building $6m − mortgage $5m</td><td class='num'>$1m surplus</td></tr><tr><td>+ other assets</td><td class='num'>$4m → pool $5m</td></tr><tr><td>− costs $0.5m − employees $1m</td><td class='num'>$3.5m</td></tr><tr><td>÷ unsecured debts $5m</td><td class='num'>70c in the dollar</td></tr></table>",
      gens: ['waterfall'],
      pool: [
        {q: 'For circulating assets such as stock and debtors, who ranks ahead of a secured lender?', o: ['Shareholders', 'Employee entitlements', 'Unsecured suppliers', 'Nobody'], a: 1, e: 'Employee entitlements are paid ahead of circulating security interests.'},
        {q: 'Which step moves a supplier up the queue?', o: ['Offering longer payment terms', 'Registering a retention of title interest on the PPSR', 'Buying shares in the customer', 'Charging a higher price'], a: 1, e: 'A registered security interest makes the supplier secured over its goods.'}
      ]},
    {id: 'markets', name: 'How markets work', day: 3,
      explain: "<p>The <b>primary</b> market is the shop where new securities are sold and the issuer gets the money. The <b>secondary</b> market is the second-hand market where investors swap them, and the issuer gets nothing, but a busy second-hand market is what makes buyers happy to shop in the first place.</p><p>On the ASX, trades settle two business days later (T+2). Market cap = price × shares on issue.</p>",
      example: "<table><tr><td>IPO, placement, rights issue</td><td>Primary</td></tr><tr><td>Buying BHP shares on the ASX today</td><td>Secondary</td></tr><tr><td>1bn shares × $25</td><td class='num'>$25bn market cap</td></tr></table>",
      gens: ['marketCap'],
      pool: [
        {q: 'You buy 1,000 shares on the ASX on Monday. When does settlement normally occur?', o: ['Monday', 'Wednesday', 'Friday', 'The following Monday'], a: 1, e: 'T+2: two business days after the trade.'},
        {q: 'A rights issue is:', o: ['A secondary market trade', 'An offer of new shares to existing holders in proportion to their holdings', 'A type of bond', 'A dividend payment'], a: 1, e: 'It raises new money in the primary market.'}
      ]},
    {id: 'bond-price', name: 'Bond prices and yields', day: 3,
      explain: "<p>A bond's coupons are fixed when it is issued. If new bonds start paying more, nobody will pay full price for yours, so its price drops until a buyer would earn the new market yield. If rates fall, your higher coupon becomes valuable and the price rises.</p><p>The longer the bond, the more coupons are locked in, so the bigger the price move.</p>",
      example: "<table><tr><th>5% coupon bond, yields rise to 6%</th><th>Price</th></tr><tr><td>3 years to maturity</td><td class='num'>$97.33</td></tr><tr><td>10 years to maturity</td><td class='num'>$92.64</td></tr></table>",
      gens: ['bondPrice'],
      pool: [
        {q: 'A bond trades below its $100 face value. Its yield to maturity is:', o: ['Below its coupon rate', 'Equal to its coupon rate', 'Above its coupon rate', 'Zero'], a: 2, e: 'Buying below face adds a capital gain to the coupons, so the yield exceeds the coupon.'},
        {q: 'Which bond\'s price falls most if yields rise 1 percentage point?', o: ['1-year', '3-year', '10-year', 'They all fall equally'], a: 2, e: 'Longer bonds have more interest rate risk.'}
      ]},
    {id: 'private-markets', name: 'Private markets', day: 3,
      explain: "<p>Private markets are investments not traded on an exchange: private equity, venture capital, private credit and unlisted property and infrastructure. You may get access to different returns, but you give up the easy exit, the daily price, and often pay higher fees. Always ask: how is it valued, when can I get out, and what am I paying?</p>",
      example: "<table><tr><th></th><th>Listed shares</th><th>Private fund</th></tr><tr><td>Exit</td><td>Any trading day</td><td>Limited windows, may be frozen</td></tr><tr><td>Valuation</td><td>Market price every second</td><td>Manager's estimate, monthly or quarterly</td></tr><tr><td>Fees</td><td>Low</td><td>Higher, often with performance fees</td></tr></table>",
      gens: [],
      pool: [
        {q: 'Which is a private credit investment?', o: ['A Commonwealth Treasury bond', 'A fund lending directly to property developers', 'ASX 200 index fund', 'A bank term deposit'], a: 1, e: 'Private credit funds lend directly outside the banking system.'},
        {q: 'A private fund reports very smooth returns. A likely reason is:', o: ['It has no risk', 'Its assets are valued infrequently by the manager', 'It is government guaranteed', 'It holds only cash'], a: 1, e: 'Infrequent, model-based valuations can hide volatility.'}
      ]},
    {id: 'regulators', name: 'Who regulates what', day: 4,
      explain: "<p>Think of a football match. <b>APRA</b> checks each team is fit to play (safety of banks, insurers, super funds). <b>ASIC</b> is the referee on conduct, with the company register and licences. The <b>RBA</b> controls the ball (money, interest rates, payments). The <b>ATO</b> collects the gate takings (tax and super). AFCA is the tribunal for complaints, and the ACCC watches competition.</p>",
      example: "<table><tr><td>Bank capital rules</td><td>APRA</td></tr><tr><td>Company registration, AFSL, insider trading</td><td>ASIC</td></tr><tr><td>Cash rate, card payment rules</td><td>RBA</td></tr><tr><td>ABN, GST, super guarantee</td><td>ATO</td></tr><tr><td>Mergers, consumer law</td><td>ACCC</td></tr><tr><td>Money laundering reports</td><td>AUSTRAC</td></tr></table>",
      gens: [],
      pool: [
        {q: 'A business wants a free, independent decision on a dispute with its bank. Where does it go?', o: ['APRA', 'AFCA', 'RBA', 'ATO'], a: 1, e: 'AFCA resolves complaints with financial firms that are members.'},
        {q: 'Which body chairs the Council of Financial Regulators?', o: ['The Treasurer', 'The RBA Governor', 'The ASIC Chair', 'The ATO Commissioner'], a: 1, e: 'The RBA Governor chairs the CFR, which includes APRA, ASIC and Treasury.'},
        {q: 'Who reports large cash transactions to AUSTRAC?', o: ['Every taxpayer', 'Banks and other reporting entities', 'The ACCC', 'Shareholders'], a: 1, e: 'Reporting entities must report threshold and suspicious transactions.'}
      ]},
    {id: 'starting-company', name: 'Setting up: who you deal with', day: 4,
      explain: "<p>Starting a company touches three bodies: <b>ASIC</b> registers the company and gives it an ACN; each director gets a <b>director ID</b> through Australian Business Registry Services; the <b>ATO</b> handles the ABN, GST registration, PAYG withholding and the superannuation guarantee (12%, due each payday since 1 July 2026).</p>",
      example: "<ol><li>Register company with ASIC (ACN)</li><li>Director IDs for each director</li><li>Apply for ABN; register for GST if turnover will be $75,000 or more</li><li>Set up PAYG withholding and super for staff (super is due each payday)</li></ol>",
      gens: [],
      pool: [
        {q: 'Which body issues an Australian Company Number (ACN)?', o: ['ATO', 'ASIC', 'APRA', 'ABRS'], a: 1, e: 'ASIC registers companies and issues ACNs. The ABN comes from the Australian Business Register (ATO).'},
        {q: 'An employer must pay super for an employee at:', o: ['9.5%', '10.5%', '12%', '15%'], a: 2, e: 'The superannuation guarantee is 12% from 1 July 2025. Since 1 July 2026 it is calculated on qualifying earnings (mainly ordinary time earnings) and due each payday (Payday Super).'}
      ]},
    {id: 'month1-apply', name: 'Applying Month 1 to a business', day: 5,
      explain: "<p>Every business question from this month fits one of six headings: how it makes money, its break-even, its cash cycle, its funding, its place in the creditor queue, and its regulators. Work through them in that order on any business you meet.</p>",
      example: "<table><tr><td>Café: average sale $14, variable cost $5</td><td class='num'>Contribution $9</td></tr><tr><td>Fixed costs $27,000 a month</td><td class='num'>Break-even 3,000 sales</td></tr><tr><td>Customers pay on the spot, stock 7 days, suppliers paid in 30</td><td class='num'>Cash cycle −23 days</td></tr></table><p class='note'>A negative cash cycle means suppliers fund the business: a strength, until sales fall.</p>",
      gens: ['breakeven', 'cashCycle', 'waterfall'],
      pool: [
        {q: 'A business collects cash immediately, holds stock 10 days and pays suppliers in 30 days. Its cash conversion cycle is:', o: ['40 days', '−20 days', '20 days', '0 days'], a: 1, e: '0 + 10 − 30 = −20 days: suppliers fund it.'}
      ]}
  ];
  w.days.forEach(d => { d.concepts = w.concepts.filter(c => c.day === d.n).map(c => c.id); });
  // tag quiz questions with concepts so results feed the mastery tracker
  const tags = ['credit-creation','bank-leverage','bank-leverage','fcs','debt-equity','gearing','waterfall','waterfall','markets','bond-price','markets','regulators','starting-company','starting-company','private-markets'];
  w.quiz.mc.forEach((q, i) => q.c = tags[i]);
  w.glossary = [
    ['ADI', 'Authorised deposit-taking institution: a bank, building society or credit union licensed by APRA.'],
    ['AFCA', 'Australian Financial Complaints Authority: free dispute resolution for financial services.'],
    ['AFSL', 'Australian financial services licence, issued by ASIC.'],
    ['APRA', 'Australian Prudential Regulation Authority: safety of banks, insurers and super funds.'],
    ['ASIC', 'Australian Securities and Investments Commission: companies, licensing, markets and conduct.'],
    ['AUSTRAC', 'Australia\'s anti-money laundering and counter-terrorism financing regulator.'],
    ['Bond', 'A tradable loan paying fixed coupons and repaying face value at maturity.'],
    ['CHESS', 'The ASX system that settles share trades and records holdings.'],
    ['Coupon', 'The fixed interest a bond pays, as a percentage of face value.'],
    ['Exchange Settlement Account', 'A bank\'s account at the RBA, used to settle payments between banks.'],
    ['Fair Entitlements Guarantee', 'Government scheme covering certain unpaid employee entitlements when an employer fails.'],
    ['Financial Claims Scheme', 'Government guarantee of deposits up to $250,000 per account holder per ADI.'],
    ['Hybrid security', 'An investment with features of both debt and equity, e.g. convertible notes.'],
    ['IPO', 'Initial public offering: a company\'s first sale of shares to the public when it lists.'],
    ['Liquidation', 'Winding up an insolvent company: selling assets and paying creditors in legal order.'],
    ['Market capitalisation', 'Share price multiplied by the number of shares on issue.'],
    ['Maturity transformation', 'Funding long-term loans with short-term deposits.'],
    ['Net interest margin', 'Net interest income as a percentage of interest-earning assets.'],
    ['Primary market', 'Where new securities are sold and the issuer receives the money.'],
    ['Private credit', 'Loans made directly by investment funds rather than banks.'],
    ['Secondary market', 'Where investors trade existing securities with each other.'],
    ['Secured creditor', 'A lender with a legal claim over specific assets of the borrower.'],
    ['Twin peaks', 'Australia\'s model of financial regulation: APRA for safety, ASIC for conduct.'],
    ['Yield to maturity', 'The annual return from buying a bond at today\'s price and holding it to maturity.']
  ].map(([t, d]) => ({t, d, week: 4}));
})();
