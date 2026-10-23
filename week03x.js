// Week 3 adaptive layer: concepts (with a second explanation, a worked example, practice), glossary, quiz tags.
// Extra depth on leverage, which Mitch found hard in Week 1 (leverage-depth concept, three generators, larger pool).
(function(){
  const w = window.WEEKS.find(x => x.week === 3);
  w.concepts = [
    {id: 'pv-fv', name: 'Present and future value', day: 1,
      explain: "<p>Think of an escalator that rises at the interest rate. Future value is riding the escalator <b>up</b>: multiply by (1 + r) for each year. Present value is riding it <b>down</b>: divide by (1 + r) for each year.</p><p>Every time-value problem is the same escalator. The only questions are how fast it moves (the rate) and how many floors (the periods).</p>",
      example: "<table><tr><th>$10,000 at 6%</th><th>Up (FV)</th><th>Down (PV of $10,000)</th></tr><tr><td>1 year</td><td class='num'>$10,600</td><td class='num'>$9,434</td></tr><tr><td>5 years</td><td class='num'>$13,382</td><td class='num'>$7,473</td></tr><tr><td>10 years</td><td class='num'>$17,908</td><td class='num'>$5,584</td></tr></table>",
      gens: ['fv', 'pv', 'compareOffers'],
      pool: [
        {q: 'Raising the discount rate does what to a present value?', o: ['Raises it', 'Lowers it', 'No change', 'Depends on inflation only'], a: 1, e: 'You divide by a bigger number, so the PV falls. Higher rates make future money worth less today.'},
        {q: 'Which is the correct future value of $1,000 at 8% for 3 years?', o: ['$1,240.00', '$1,259.71', '$1,080.00', '$1,166.40'], a: 1, e: '$1,000 × 1.08³ = $1,259.71. $1,240 is simple interest.'}
      ]},
    {id: 'compounding-freq', name: 'Compounding frequency', day: 1,
      explain: "<p>Split the year into m slices. Each slice earns r ÷ m, and there are n × m slices in total. More slices means interest starts earning interest sooner, so the result is slightly higher.</p><p>The effect is small at normal rates and grows with the rate and the time.</p>",
      example: "<p class='formula'>FV = PV × (1 + r/m)<sup>n×m</sup></p><table><tr><th>$10,000, 6%, 10 years</th><th>Value</th></tr><tr><td>Annual</td><td class='num'>$17,908</td></tr><tr><td>Monthly</td><td class='num'>$18,194</td></tr><tr><td>Daily</td><td class='num'>$18,220</td></tr></table>",
      gens: ['fvFreq'],
      pool: [
        {q: 'For a monthly loan quoted at 6% a year, what rate and periods go into the formula for 5 years?', o: ['6% and 5', '0.5% and 60', '0.5% and 5', '6% and 60'], a: 1, e: 'Rate per period 6% ÷ 12 = 0.5%; periods 5 × 12 = 60. Always match the rate to the period.'}
      ]},
    {id: 'solve-rate', name: 'Solving for rate and time', day: 1,
      explain: "<p>Divide end by start to get the growth multiple. To find the yearly rate, take the n-th root of that multiple, then subtract 1. On a phone calculator: multiple ^ (1 ÷ n) − 1.</p><p>To find the time, use logs: ln(multiple) ÷ ln(1 + r). For doubling, the rule of 72 is a good check.</p>",
      example: "<table><tr><td>$200,000 → $300,000 in 7 years</td><td></td></tr><tr><td>Multiple</td><td class='num'>1.5</td></tr><tr><td>1.5^(1/7) − 1</td><td class='num'>5.96% a year</td></tr><tr><td>Wrong method: 50% ÷ 7</td><td class='num'>7.14%</td></tr></table>",
      gens: ['solveRate', 'solveYears', 'rule72'],
      pool: [
        {q: 'An investment grew 60% over 12 years. Its annual compound return is closest to:', o: ['5.0%', '4.0%', '6.0%', '7.2%'], a: 1, e: '1.6^(1/12) − 1 = 4.0%. A big total over a long time can be a modest yearly return.'}
      ]},
    {id: 'annuity', name: 'Annuities and savings plans', day: 2,
      explain: "<p>An annuity is just many lump sums of the same size. You could grow each one separately and add them up; the formula does that in one step.</p><p>To find how much to save for a goal, run the formula backwards with PMT. Payments at the <b>start</b> of each period (annuity due) are worth a little more: multiply by (1 + i).</p>",
      example: "<p class='formula'>FV = PMT × ((1 + i)<sup>n</sup> − 1) ÷ i</p><table><tr><td>$500 a month, 10 years, 5%</td><td class='num'>$77,641</td></tr><tr><td>Same, paid at start of month</td><td class='num'>$77,965</td></tr><tr><td>Needed monthly for $100,000 in 5 years at 4.5%</td><td class='num'>$1,489</td></tr></table>",
      gens: ['annuityFV', 'savingsGoal'],
      pool: [
        {q: 'Which spreadsheet formula gives the monthly saving needed to reach $50,000 in 4 years at 4%?', o: ['=PMT(4%/12, 48, 0, 50000)', '=PMT(4%, 4, 50000)', '=FV(4%/12, 48, 50000)', '=50000/48'], a: 0, e: 'Monthly rate, monthly periods, PV 0, FV $50,000. The answer is negative because it is money you pay in.'},
        {q: 'Saving at the start of each month rather than the end gives:', o: ['A slightly larger balance', 'A slightly smaller balance', 'The same balance', 'A balance twice as large'], a: 0, e: 'Each deposit earns one extra month of interest: multiply by (1 + i).'}
      ]},
    {id: 'borrowing', name: 'Loans as present values', day: 2,
      explain: "<p>A bank lending you money is buying your future repayments. The most it will lend is what those repayments are worth today at the loan rate.</p><p>So when rates rise, the same repayment buys a smaller loan. That is why rate rises cool house prices: buyers can bid less.</p>",
      example: "<table><tr><th>$3,000 a month, 30 years</th><th>Loan supported</th></tr><tr><td>5.5%</td><td class='num'>$528,365</td></tr><tr><td>6.0%</td><td class='num'>$500,375</td></tr><tr><td>6.5%</td><td class='num'>$474,632</td></tr><tr><td>9.0% (a 3-point buffer)</td><td class='num'>$372,846</td></tr></table>",
      gens: ['annuityPV', 'pmtMonthly'],
      pool: [
        {q: 'Car finance is $400 a month for 5 years at 7%. What is the best way to compare it with the cash price?', o: ['Multiply $400 by 60', 'Find the PV of the payments at the rate you could earn or borrow at', 'Compare $400 with your weekly pay', 'Look at the advertised rate only'], a: 1, e: 'The PV puts the payments on the same date as the cash price. Also add any balloon and fees.'}
      ]},
    {id: 'perpetuity', name: 'Perpetuities and cap rates', day: 2,
      explain: "<p>A perpetuity pays forever. Even though it never ends, payments far in the future are worth almost nothing today, so the total has a finite value: payment ÷ rate.</p><p>Flip it and you get the cap rate: rate = income ÷ value.</p>",
      example: "<table><tr><td>$50,000 a year forever at 5%</td><td class='num'>$1,000,000</td></tr><tr><td>Same at 4%</td><td class='num'>$1,250,000</td></tr><tr><td>Same at 6%</td><td class='num'>$833,333</td></tr></table><p class='note'>Small changes in the rate cause big changes in value.</p>",
      gens: ['perpetuity', 'caprate'],
      pool: [
        {q: 'A property earning $60,000 net a year is valued at $1,200,000. What cap rate is being used?', o: ['5%', '20%', '6%', '2%'], a: 0, e: '$60,000 ÷ $1,200,000 = 5%. This treats the rent as a perpetuity.'}
      ]},
    {id: 'ear', name: 'Effective vs nominal rates', day: 3,
      explain: "<p>The nominal rate just multiplies the period rate by the number of periods. The effective rate lets each period's interest earn interest, so it shows what you really pay or earn over a year.</p><p>Short-term charges look small until you annualise them.</p>",
      example: "<p class='formula'>EAR = (1 + r/m)<sup>m</sup> − 1</p><table><tr><td>6% monthly</td><td class='num'>6.17%</td></tr><tr><td>19.99% daily (credit card)</td><td class='num'>22.1%</td></tr><tr><td>5% a fortnight, rolled over</td><td class='num'>256%</td></tr></table>",
      gens: ['ear'],
      pool: [
        {q: 'Term deposit A pays 4.50% at maturity after 12 months. B pays 4.40% monthly, reinvested. Which earns more?', o: ['A, slightly', 'B, slightly', 'B, by about 1%', 'A, by about 1%'], a: 0, e: 'B effective = (1 + 0.044/12)^12 − 1 = 4.49%, just below A at 4.50%.'}
      ]},
    {id: 'comparison-rate', name: 'The comparison rate', day: 3,
      explain: "<p>The comparison rate answers: what rate, with no fees at all, would cost the same as this loan with its fees? It is calculated on a standard loan ($150,000 over 25 years for home loans) so lenders cannot pick a flattering example.</p><p>Because it uses that small loan, upfront fees look bigger than they are on a large mortgage, and features like offset accounts are not counted.</p>",
      example: "<table><tr><td>5.79% + $600 upfront + $10 a month</td><td class='num'>5.94% comparison</td></tr><tr><td>5.89% + $1,500 + $15 a month on $150,000</td><td class='num'>6.16%</td></tr><tr><td>The same loan on $700,000 / 30 years</td><td class='num'>5.94% effective</td></tr></table>",
      gens: [],
      pool: [
        {q: 'Why must every comparison rate carry a warning?', o: ['It is only true for the standard example used', 'It is calculated by the RBA', 'It excludes the interest rate', 'It changes daily'], a: 0, e: 'Different loan sizes and terms, and fees not included, give a different true cost.'},
        {q: 'Which cost is NOT included in the comparison rate?', o: ['Establishment fee', 'Monthly account fee', 'Early repayment or late payment fees', 'The interest rate'], a: 2, e: 'Fees that depend on events that may not happen are excluded, as is the value of features like offset.'},
        {q: 'For a $900,000 loan, the comparison rate will tend to:', o: ['Overstate the effect of upfront fees', 'Understate the effect of upfront fees', 'Be exactly right', 'Ignore the interest rate'], a: 0, e: 'Upfront fees are spread over $150,000 in the standard example but over $900,000 in reality.'}
      ]},
    {id: 'amortisation', name: 'How repayments work', day: 4,
      explain: "<p>Each month the bank takes its interest first, calculated on what you still owe. Whatever is left of the repayment reduces the loan.</p><p>Early on you owe a lot, so most of the payment is interest. As the balance falls, interest shrinks and more goes to principal, which is why the balance falls slowly at first and fast at the end.</p>",
      example: "<table><tr><th>$600,000 at 6%, $3,597 a month</th><th>Interest</th><th>Principal</th></tr><tr><td>Month 1</td><td class='num'>$3,000</td><td class='num'>$597</td></tr><tr><td>Month 181 (balance $426,293)</td><td class='num'>$2,131</td><td class='num'>$1,466</td></tr></table>",
      gens: ['interestSplit', 'pmtMonthly'],
      pool: [
        {q: 'Halfway through a 30-year loan, roughly how much of the original balance is still owed (at 6%)?', o: ['About 50%', 'About 71%', 'About 25%', 'About 90%'], a: 1, e: '$426,293 of $600,000 is about 71%. Balances fall slowly at first.'}
      ]},
    {id: 'offset-extra', name: 'Offset accounts and extra repayments', day: 4,
      explain: "<p>Every dollar in an offset, or paid off early, stops being charged the loan rate. That is a guaranteed return equal to the loan rate, with no tax, because you are saving interest rather than earning it.</p><p>A savings account must beat the loan rate <b>after tax</b> to compete, which it almost never does.</p>",
      example: "<table><tr><td>Savings 4.5%, taxed at 32%</td><td class='num'>3.06% kept</td></tr><tr><td>Offset against a 6% loan</td><td class='num'>6% saved</td></tr><tr><td>+$500 a month on $600,000</td><td class='num'>8 years sooner, $213,000 less interest</td></tr></table>",
      gens: ['offsetSaving'],
      pool: [
        {q: 'Why is the benefit of an offset account tax free?', o: ['The ATO exempts mortgages', 'You save interest rather than earn it, so there is no income to tax', 'Banks pay the tax', 'It is not tax free'], a: 1, e: 'Interest you avoid paying is not income.'}
      ]},
    {id: 'leverage-depth', name: 'Leverage, step by step', day: 4,
      explain: "<p>Picture a see-saw. The property is the long side, your deposit is the short side. Push the long end by 10% and the short end moves five times as much when the deposit is 20%. That is the leverage multiple: <b>assets ÷ equity</b>.</p><p>Now add rent coming in and interest going out. If rent is smaller than interest, you start each year behind. The property must grow by the shortfall just to stand still.</p><ol><li>Work out equity and the multiple.</li><li>Value change × multiple gives the price effect on equity.</li><li>Add income, subtract interest, divide by equity.</li><li>Shortfall ÷ property value = break-even growth.</li></ol>",
      example: "<table><tr><th>$800,000, 20% deposit, rent 3%, loan 6%</th><th>Return on equity</th></tr><tr><td>Value +5%</td><td class='num'>+16%</td></tr><tr><td>Value flat</td><td class='num'>−9%</td></tr><tr><td>Value −5%</td><td class='num'>−34%</td></tr><tr><td>Break-even growth</td><td class='num'>1.8% a year</td></tr></table>",
      gens: ['leverage', 'gearedReturn', 'breakEvenGrowth'],
      pool: [
        {q: 'With a 25% deposit, what is the leverage multiple?', o: ['1.25×', '4×', '3×', '25×'], a: 1, e: 'Assets ÷ equity = 100 ÷ 25 = 4. Each 1% move in value moves equity by 4%.'},
        {q: 'An LVR of 70% means:', o: ['The loan is 70% of the property value', 'The deposit is 70%', 'The interest rate is 7%', 'Leverage multiple of 7'], a: 0, e: 'Loan to value ratio = loan ÷ value. Equity is the other 30%, so the multiple is about 3.3×.'},
        {q: 'Borrowing to invest increases your expected return only when:', o: ['Interest rates are falling', 'The asset\'s total return is higher than the loan rate', 'The loan is interest only', 'The deposit is under 20%'], a: 1, e: 'If the asset earns less than the loan costs, leverage makes the result worse.'},
        {q: 'Shares worth $150,000 are funded by $100,000 of your money and a $50,000 loan. The market falls 20%. Ignoring interest, your equity falls by:', o: ['20%', '30%', '33%', '50%'], a: 1, e: 'Loss $30,000 ÷ equity $100,000 = 30%. Interest of $4,000 would make it 34%.'},
        {q: 'Which reduces the risk that leverage forces you to sell?', o: ['A smaller deposit', 'A cash or offset buffer', 'A longer settlement', 'A higher LVR'], a: 1, e: 'A buffer lets you meet repayments or margin calls through a bad year.'}
      ]},
    {id: 'fisher', name: 'Nominal vs real returns', day: 5,
      explain: "<p>A nominal return counts dollars. A real return counts what those dollars can buy. Divide one plus the nominal return by one plus inflation, and subtract one.</p><p>Quick check: nominal minus inflation. The exact version is always a little closer to zero: slightly lower when the real return is positive, slightly less negative when it is negative.</p>",
      example: "<table><tr><td>5% nominal, 3% inflation</td><td class='num'>1.94% real</td></tr><tr><td>3% pay rise, 4% inflation</td><td class='num'>−0.96% real</td></tr><tr><td>4.6% cash rate, 3% inflation</td><td class='num'>1.55% real</td></tr></table>",
      gens: ['realReturn'],
      pool: [
        {q: 'Mixing nominal cash flows with a real discount rate will:', o: ['Overvalue the asset', 'Undervalue the asset', 'Have no effect', 'Only matter for bonds'], a: 0, e: 'A real rate is lower than a nominal one, so discounting inflated cash flows at it gives too high a value.'}
      ]},
    {id: 'purchasing-power', name: 'Purchasing power', day: 5,
      explain: "<p>To express future dollars in today's money, discount them by inflation exactly as you would by an interest rate. To find what you will need in future, grow today's amount by inflation.</p>",
      example: "<table><tr><td>$100,000 in 20 years at 3%</td><td class='num'>$55,368 today</td></tr><tr><td>$60,000 a year today, in 25 years at 2.5%</td><td class='num'>$111,237</td></tr></table>",
      gens: ['purchasingPower'],
      pool: [
        {q: 'At 3.5% inflation, roughly how many years until prices double?', o: ['10', '20', '35', '28'], a: 1, e: '70 ÷ 3.5 = 20 years.'}
      ]},
    {id: 'after-tax-real', name: 'After-tax real returns', day: 5,
      explain: "<p>Order matters: first take tax off the nominal return, then adjust for inflation. Because tax is charged on the whole nominal return, including the part that only keeps pace with prices, cash savers can go backwards in real terms.</p>",
      example: "<table><tr><td>4.5% term deposit</td><td class='num'>4.50%</td></tr><tr><td>After 30% tax</td><td class='num'>3.15%</td></tr><tr><td>Real, with 3% inflation</td><td class='num'>0.15%</td></tr></table>",
      gens: ['afterTaxReal'],
      pool: [
        {q: 'Interest of 5% is taxed at 45% and inflation is 3%. The real after-tax return is about:', o: ['+2.0%', '−0.2%', '+0.75%', '−1.0%'], a: 1, e: 'After tax 2.75%; 1.0275 ÷ 1.03 − 1 = −0.24%. The saver is going backwards.'}
      ]}
  ];
  w.days.forEach(d => { d.concepts = w.concepts.filter(c => c.day === d.n).map(c => c.id); });
  // tag quiz questions with concepts so results feed the mastery tracker
  const tags = ['pv-fv','pv-fv','compounding-freq','solve-rate','solve-rate','annuity','borrowing','annuity','perpetuity','ear','comparison-rate','amortisation','offset-extra','leverage-depth','fisher'];
  w.quiz.mc.forEach((q, i) => q.c = tags[i]);
  w.glossary = [
    ['Amortisation', 'Paying off a loan through regular repayments that cover interest and reduce principal.'],
    ['Annuity', 'A stream of equal payments at regular intervals.'],
    ['Annuity due', 'An annuity whose payments are made at the start of each period, such as rent.'],
    ['Cash rate', 'The RBA\'s policy interest rate on overnight loans between banks.'],
    ['Comparison rate', 'A single annual rate combining a loan\'s interest rate and most fees, on a standard example.'],
    ['CPI', 'Consumer Price Index: the ABS measure of prices of a basket of household goods and services.'],
    ['Discount rate', 'The rate used to convert future amounts into present values.'],
    ['Effective annual rate', 'The true yearly rate once compounding within the year is included.'],
    ['Fisher equation', '(1 + real) = (1 + nominal) ÷ (1 + inflation).'],
    ['Future value', 'What an amount invested today will grow to at a given rate.'],
    ['Interest only', 'A loan period in which repayments cover interest only, so the balance does not fall.'],
    ['Leverage multiple', 'Assets divided by equity: how much a change in asset value is magnified for the owner.'],
    ['LVR', 'Loan to value ratio: the loan as a percentage of the asset\'s value.'],
    ['Margin call', 'A lender\'s demand for cash or sales when a geared investment\'s LVR exceeds its limit.'],
    ['Negative gearing', 'An investment whose income is less than its interest and other costs, running at a loss.'],
    ['Nominal rate', 'The quoted annual rate: rate per period times periods per year, before compounding.'],
    ['Offset account', 'A transaction account whose balance is subtracted from a loan balance before interest is charged.'],
    ['Perpetuity', 'A stream of equal payments that continues forever; value = payment ÷ rate.'],
    ['Present value', 'What a future amount is worth today, discounted at a given rate.'],
    ['Purchasing power', 'What an amount of money can actually buy, after inflation.'],
    ['Real return', 'A return adjusted for inflation, showing the change in purchasing power.'],
    ['Redraw', 'A loan feature allowing extra repayments to be withdrawn later, often with lender restrictions.']
  ].map(([t, d]) => ({t, d, week: 3}));
})();
