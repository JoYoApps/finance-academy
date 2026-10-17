// Week 2 adaptive layer: concepts (with a second explanation, a worked example, practice), glossary, quiz tags.
(function(){
  const w = window.WEEKS.find(x => x.week === 2);
  w.concepts = [
    {id: 'margin-markup', name: 'Margin vs markup', day: 1,
      explain: "<p>Picture a pizza you bought for $60 and sold for $100. The $40 profit is the same slice either way. The only question is <b>which pizza you compare it with</b>.</p><p>Compare it with the <b>selling price</b> ($100) and the slice is 40%: that is <b>margin</b>. Compare it with the <b>cost</b> ($60) and it is 66.7%: that is <b>markup</b>.</p><p>Memory hook: <i>Margin looks at the Money coming in; marKup looks at what it Kost</i>. Margin is always the smaller number, and it can never reach 100%.</p>",
      example: "<table><tr><th>Markup on cost</th><th>Equivalent margin</th></tr><tr><td>25%</td><td class='num'>20%</td></tr><tr><td>50%</td><td class='num'>33.3%</td></tr><tr><td>66.7%</td><td class='num'>40%</td></tr><tr><td>100%</td><td class='num'>50%</td></tr><tr><td>300%</td><td class='num'>75%</td></tr></table><p class='formula'>Price for target margin = cost ÷ (1 − margin)</p>",
      gens: ['marginMarkup', 'priceForMargin'],
      pool: [
        {q: 'A product costs $40 and sells for $50. Which is correct?', o: ['Margin 25%, markup 20%', 'Margin 20%, markup 25%', 'Both are 20%', 'Both are 25%'], a: 1, e: '$10 ÷ $50 = 20% margin; $10 ÷ $40 = 25% markup.'},
        {q: 'Why can a margin never be 100% or more?', o: ['The ATO caps it', 'Profit can never exceed the selling price', 'Costs are always at least half of price', 'It can be, for software'], a: 1, e: 'Margin = profit ÷ price, and profit is price minus cost, so it is always less than the price.'},
        {q: 'To earn a 25% margin on a $75 cost, the price must be:', o: ['$93.75', '$100', '$93.00', '$300'], a: 1, e: '$75 ÷ 0.75 = $100. Cost + 25% is $93.75, which is only a 20% margin.'}
      ]},
    {id: 'gst', name: 'Taking GST out of prices', day: 1,
      explain: "<p>GST was added on top of the real price: real price × 1.1 = what the customer pays. To undo it, you reverse the same step: <b>divide by 1.1</b>.</p><p>Taking 10% off the final price fails because that 10% is calculated on the <i>bigger</i> number. The GST share of any GST-inclusive price is <b>one eleventh</b>, about 9.09%.</p><p>Think of $110 as 11 equal pieces of $10: ten pieces belong to the business, one piece belongs to the ATO.</p>",
      example: "<table><tr><th>Inclusive price</th><th>÷ 1.1 = ex GST</th><th>÷ 11 = GST</th></tr><tr><td>$55.00</td><td class='num'>$50.00</td><td class='num'>$5.00</td></tr><tr><td>$132.00</td><td class='num'>$120.00</td><td class='num'>$12.00</td></tr><tr><td>$880,000</td><td class='num'>$800,000</td><td class='num'>$80,000</td></tr></table><p class='note'>Some items (most basic food, many health and education services) are GST-free, and residential rent is input-taxed.</p>",
      gens: ['gstOut'],
      pool: [
        {q: 'A business sells a service for $330 including GST. Its revenue (ex GST) is:', o: ['$297', '$300', '$330', '$363'], a: 1, e: '$330 ÷ 1.1 = $300. The $30 GST is passed to the ATO.'},
        {q: 'Why should margins be calculated on ex-GST prices?', o: ['GST is a cost of goods', 'The GST collected belongs to the ATO, not the business', 'It makes margins look higher', 'Only companies pay GST'], a: 1, e: 'The business collects GST and remits it. It is not revenue.'}
      ]},
    {id: 'pct-change', name: 'Percentage changes and points', day: 1,
      explain: "<p>A percentage change is always measured from the <b>starting point</b>. When the starting point moves, the same dollars give a different percentage.</p><p>Fall from $100 to $50: you lost $50 of $100, which is 50%. Climb back from $50 to $100: you gained $50 on $50, which is 100%. Same $50, different base.</p><p>For rates, say <b>points</b> for the simple difference (4% → 5% is 1 point) and <b>per cent</b> for the relative change (25% more).</p>",
      example: "<table><tr><th>Situation</th><th>Wrong</th><th>Right</th></tr><tr><td>Recover from a 25% fall</td><td>25%</td><td class='num'>33.3%</td></tr><tr><td>15% off then 10% off</td><td>25%</td><td class='num'>23.5%</td></tr><tr><td>Rate 5% → 6%</td><td>'1% rise'</td><td class='num'>1 point, 20% more interest</td></tr></table>",
      gens: ['recovery', 'stackedDiscount', 'points'],
      pool: [
        {q: 'A price rises 10% and then falls 10%. Compared with the start it is:', o: ['Unchanged', '1% lower', '1% higher', '10% lower'], a: 1, e: '1.10 × 0.90 = 0.99, 1% lower.'},
        {q: 'An unemployment rate moves from 4% to 5%. A headline says "unemployment up 25%". This is:', o: ['Wrong: it rose 1%', 'Correct as a relative change; it also rose 1 percentage point', 'Wrong: it rose 5%', 'Correct only in real terms'], a: 1, e: 'Both are true: 1 point, or 25% relative.'}
      ]},
    {id: 'cagr', name: 'Compound annual growth rate', day: 2,
      explain: "<p>CAGR answers: <i>what steady yearly rate would get me from start to finish?</i> It ignores the bumpy path and gives one fair number.</p><p>Why not just divide total growth by the years? Because each year's growth is earned on a bigger base. If you divide, you pretend growth never compounds, which overstates the yearly rate.</p><p>Steps on a phone: end ÷ start → x<sup>y</sup> → (1 ÷ years) → minus 1.</p>",
      example: "<p>A suburb's median price went from $650,000 in 2015 to $1,050,000 in 2025 (10 years).</p><p class='formula'>(1,050,000 ÷ 650,000)<sup>1/10</sup> − 1 = 1.615<sup>0.1</sup> − 1 = 4.9% a year</p><p>Simple division says 61.5% ÷ 10 = 6.2% a year: too high. With inflation near 3%, real growth was about 2% a year.</p>",
      gens: ['cagr'],
      pool: [
        {q: 'Revenue figures exist for 2019, 2020, 2021, 2022 and 2023. For CAGR, the number of years is:', o: ['3', '4', '5', '6'], a: 1, e: 'Count the gaps between data points: 2019 to 2023 is 4 years.'},
        {q: 'Something tripled over 10 years. Its CAGR is closest to:', o: ['20%', '11.6%', '30%', '10%'], a: 1, e: '3^(0.1) − 1 ≈ 11.6%.'}
      ]},
    {id: 'geo-mean', name: 'Arithmetic vs geometric returns', day: 2,
      explain: "<p>Lose half your money and then make 50% back, and you are not even. You have $75 from $100. The <b>arithmetic</b> average (0%) is a sum of percentages; your money <b>multiplies</b>, it does not add.</p><p>The <b>geometric</b> average multiplies the growth factors and takes the root. It is the rate your wealth actually grew at, the same idea as CAGR.</p><p>Rule: the bumpier the returns, the bigger the gap between the two averages. Always ask for compound annual returns.</p>",
      example: "<table><tr><th>Fund</th><th>Yr 1</th><th>Yr 2</th><th>Arithmetic</th><th>Geometric</th></tr><tr><td>Steady</td><td>+5%</td><td>+5%</td><td class='num'>5.0%</td><td class='num'>5.0%</td></tr><tr><td>Bumpy</td><td>+40%</td><td>−30%</td><td class='num'>5.0%</td><td class='num'>−1.0%</td></tr></table><p>Same 'average return'; the bumpy fund lost money.</p>",
      gens: ['geoMean'],
      pool: [
        {q: 'For a set of varying annual returns, the arithmetic average is:', o: ['Always lower than the geometric', 'Always higher than (or equal to) the geometric', 'Always equal to the geometric', 'Unrelated'], a: 1, e: 'Volatility makes the arithmetic mean exceed the geometric mean.'},
        {q: 'Which average tells you how much your money actually grew each year?', o: ['Arithmetic mean', 'Median', 'Geometric mean', 'Mode'], a: 2, e: 'The geometric mean (compound annual return).'}
      ]},
    {id: 'mean-median', name: 'Mean vs median', day: 2,
      explain: "<p>Put nine people in a room earning about $80,000 each. Someone earning $1 billion a year walks in. The <b>mean</b> income is now in the hundreds of millions, but nobody in the room got richer. The <b>median</b>, the middle person's income, barely moves.</p><p>Use the median when a few huge or tiny values could distort the picture: house prices, incomes, salaries, deal sizes.</p>",
      example: "<table><tr><th>Five sales in a street</th></tr><tr><td class='num'>$820k, $860k, $900k, $940k, $6.2m</td></tr><tr><td>Mean: <b>$1.94m</b></td></tr><tr><td>Median: <b>$900k</b></td></tr></table>",
      gens: [],
      pool: [
        {q: 'Salaries at a firm: mean $210,000, median $85,000. This suggests:', o: ['Most staff earn about $210,000', 'A few very high salaries pull the mean up', 'The data is wrong', 'Salaries are evenly spread'], a: 1, e: 'A big gap between mean and median signals skew from extreme values.'},
        {q: 'Australian property reports usually quote median prices because:', o: ['They are higher', 'A few very expensive sales would distort the mean', 'The law requires it', 'Medians include GST'], a: 1, e: 'The median shows the typical sale and resists outliers.'},
        {q: 'Daily cafe takings of $1,200, $1,300, $1,250, $1,350 and $1,400. Which average is fine to use?', o: ['Only the median', 'Only the mean', 'Either: no extreme values', 'Neither'], a: 2, e: 'With no outliers, mean ($1,300) and median ($1,300) agree.'}
      ]},
    {id: 'weighted-avg', name: 'Weighted averages', day: 2,
      explain: "<p>Averaging percentages is like averaging the speeds of a short and a long drive: the long one matters more. A margin on $9m of sales should count nine times as much as a margin on $1m.</p><p>The safe way: never average the percentages. Go back to the dollars. Add up all the profit, add up all the sales, then divide.</p>",
      example: "<table><tr><th>Property</th><th>Value</th><th>Yield</th><th>Rent</th></tr><tr><td>Unit</td><td class='num'>$500k</td><td class='num'>5%</td><td class='num'>$25k</td></tr><tr><td>Warehouse</td><td class='num'>$2m</td><td class='num'>7%</td><td class='num'>$140k</td></tr><tr><td><b>Portfolio</b></td><td class='num'>$2.5m</td><td class='num'><b>6.6%</b></td><td class='num'>$165k</td></tr></table><p>Simple average 6% understates it.</p>",
      gens: ['weightedMargin'],
      pool: [
        {q: 'You hold $90,000 in an asset returning 4% and $10,000 in one returning 20%. Your portfolio return is:', o: ['12%', '5.6%', '24%', '4%'], a: 1, e: '($3,600 + $2,000) ÷ $100,000 = 5.6%.'}
      ]},
    {id: 'reading-tables', name: 'Reading financial tables', day: 3,
      explain: "<p>Before reading a single number, ask the table four questions: <b>who</b> (group or company), <b>what unit</b> ($'000 or $m), <b>what period</b> (full year, half, to 30 June or 31 December) and <b>what sign</b> (brackets mean negative).</p><p>Then read across first (this year vs last) to see what changed, and only then down to see how lines build to totals. If a number drives your decision, find its footnote.</p>",
      example: "<table><tr><th>$'000</th><th>FY25</th><th>FY24</th></tr><tr><td>Revenue</td><td class='num'>48,200</td><td class='num'>41,900</td></tr><tr><td>Impairment</td><td class='num'>(6,100)</td><td class='num'>-</td></tr><tr><td>Net profit</td><td class='num'>1,300</td><td class='num'>5,400</td></tr></table><p>Revenue is $48.2 million, up 15%. Profit fell because of a $6.1m impairment: read its note to see whether it is a one-off.</p>",
      gens: [],
      pool: [
        {q: "A table is headed '$'000'. A line shows 12,500. The amount is:", o: ['$12,500', '$125,000', '$12.5 million', '$1.25 billion'], a: 2, e: '12,500 thousand = $12.5 million.'},
        {q: 'In financial tables, (2,300) means:', o: ['A footnote reference', 'A negative amount', 'An estimate', 'A half-year figure'], a: 1, e: 'Brackets indicate negatives: losses, outflows or deductions.'},
        {q: 'The best first step when comparing two years in a table is to:', o: ['Read the bottom line only', 'Read across each line to see what changed', 'Add up the columns', 'Skip to the chairman\'s letter'], a: 1, e: 'Reading across shows the changes; then investigate why.'}
      ]},
    {id: 'chart-tricks', name: 'Misleading charts', day: 3,
      explain: "<p>A chart is an argument made with pictures. The six most common tricks: <b>truncated axis</b>, <b>stretched scale</b>, <b>cherry-picked start date</b>, <b>dual axes</b>, <b>nominal instead of real</b>, and <b>totals instead of per share</b>.</p><p>One question disarms most of them: <i>what would this look like drawn honestly, from zero, over ten years, adjusted for inflation, per share?</i></p>",
      example: "<table><tr><th>Claim in a brochure</th><th>Question to ask</th></tr><tr><td>Bars show sales 'soaring'</td><td>Where does the axis start?</td></tr><tr><td>'Up 180% since 2009'</td><td>Why 2009? What about 2007?</td></tr><tr><td>Fund line hugging house prices</td><td>Two axes? Are scales chosen to match?</td></tr><tr><td>'Wages up 90% in 25 years'</td><td>After inflation?</td></tr></table>",
      gens: [],
      pool: [
        {q: 'A chart of a fund begins in March 2009, the bottom of the GFC. The likely effect is:', o: ['Understates returns', 'Overstates typical returns', 'No effect', 'Removes fees'], a: 1, e: 'Starting at a low point flatters the returns.'},
        {q: 'Two lines plotted on separate left and right axes appear to move together. You should:', o: ['Conclude one causes the other', 'Be sceptical: scales can be chosen to create the match', 'Assume it is inflation adjusted', 'Average them'], a: 1, e: 'Dual axes can manufacture apparent relationships.'},
        {q: 'Survivorship bias in a fund manager\'s track record means:', o: ['Only funds still running are shown, flattering the record', 'Older funds are shown first', 'Returns are after tax', 'Fees are excluded'], a: 0, e: 'Closed, poor-performing funds drop out of the record.'}
      ]},
    {id: 'real-per-share', name: 'Real and per-share figures', day: 3,
      explain: "<p>Two adjustments turn a flattering total into the number that matters to you.</p><p><b>Real</b>: take out inflation. A dollar buys less every year, so growth in dollars is partly just prices rising. Real growth ≈ nominal growth − inflation.</p><p><b>Per share</b>: divide by shares on issue. If a company doubles profit by doubling its shares, each owner has gained nothing.</p>",
      example: "<table><tr><th></th><th>2015</th><th>2025</th></tr><tr><td>Profit</td><td class='num'>$50m</td><td class='num'>$80m</td></tr><tr><td>Shares</td><td class='num'>100m</td><td class='num'>160m</td></tr><tr><td>EPS</td><td class='num'>50c</td><td class='num'>50c</td></tr></table><p>Profit up 60%, EPS flat, and after ten years of ~2.8% inflation, real EPS fell by about a quarter.</p>",
      gens: [],
      pool: [
        {q: 'Sales grew 4% a year while inflation was 3% a year. Real sales growth was roughly:', o: ['7%', '4%', '1%', '−1%'], a: 2, e: '4% − 3% ≈ 1% real.'},
        {q: 'Which figure matters most to an individual shareholder?', o: ['Total revenue', 'Total profit', 'Earnings per share', 'Number of employees'], a: 2, e: 'EPS shows the profit attributable to each share they own.'}
      ]},
    {id: 'spreadsheet-habits', name: 'Spreadsheet habits', day: 4,
      explain: "<p>Most spreadsheet disasters are not hard maths; they are a typed-in number nobody can see, or a reference that slid when copied.</p><p>Three habits prevent nearly all of them: <b>inputs in their own labelled cells</b> (never inside formulas), <b>$ signs to lock references</b> that must not move, and <b>check cells</b> that should show zero.</p>",
      example: "<table><tr><th>Cell</th><th>Bad</th><th>Good</th></tr><tr><td>Interest</td><td><code>=C5*0.062</code></td><td><code>=C5*$B$2</code> with 6.2% in B2</td></tr><tr><td>Check</td><td>none</td><td><code>=Assets−Liabilities−Equity</code> → 0</td></tr></table>",
      gens: [],
      pool: [
        {q: 'You copy =C5*B2 down a column but want every row to use the rate in B2. You should write:', o: ['=C5*B2', '=C5*$B$2', '=$C$5*B2', '=C5*B$'], a: 1, e: '$B$2 is absolute: it does not move when copied.'},
        {q: 'Why put assumptions in separate input cells?', o: ['It makes the file smaller', 'Change one cell and the whole model updates; assumptions are visible', 'Spreadsheets require it', 'It hides them from reviewers'], a: 1, e: 'Visible, single-source inputs make models transparent and easy to test.'}
      ]},
    {id: 'sheet-functions', name: 'Core spreadsheet functions', day: 4,
      explain: "<p>Think of the ten functions as three toolboxes. <b>Summarise</b>: SUM, AVERAGE/MEDIAN, SUMIFS. <b>Decide and find</b>: IF, XLOOKUP, ROUND. <b>Money over time</b>: PMT, FV/PV, NPV, IRR/XIRR.</p><p>Two traps in the money box: the rate must match the period (monthly loan → rate ÷ 12), and NPV treats its first value as one period away, so add today's outlay outside the function.</p>",
      example: "<table><tr><th>Task</th><th>Function</th></tr><tr><td>Total March sales in QLD</td><td><code>SUMIFS</code></td></tr><tr><td>Flag LVR over 80%</td><td><code>IF</code></td></tr><tr><td>Find a product's price in a list</td><td><code>XLOOKUP</code></td></tr><tr><td>Monthly mortgage repayment</td><td><code>PMT</code></td></tr><tr><td>Net value today of buying a property for its future rents</td><td><code>NPV</code> + outlay</td></tr><tr><td>Return on a deal with odd dates</td><td><code>XIRR</code></td></tr></table>",
      gens: [],
      pool: [
        {q: 'To total sales only for rows where region = "NSW" and product = "Kettle", use:', o: ['SUM', 'SUMIFS', 'XLOOKUP', 'ROUND'], a: 1, e: 'SUMIFS adds only rows meeting all conditions.'},
        {q: 'A project costs $100,000 today and returns $30,000 a year for 5 years. The correct NPV formula is:', o: ['=NPV(8%, -100000, 30000, ..., 30000)', '=NPV(8%, five 30000s) − 100000', '=IRR(8%, 30000)', '=PMT(8%, 5, 100000)'], a: 1, e: 'Discount only the future flows with NPV, then add the outlay made today.'},
        {q: 'Which function returns the annual return on cash flows that occur on irregular dates?', o: ['IRR', 'XIRR', 'NPV', 'FV'], a: 1, e: 'XIRR takes actual dates.'}
      ]},
    {id: 'pmt', name: 'Loan repayments (PMT)', day: 4,
      explain: "<p>A loan repayment has to do two jobs every month: pay that month's interest, and chip away at the balance so it reaches zero on the last payment. PMT finds the one fixed amount that does both.</p><p>Three inputs, all in the <b>same time unit</b>: rate per period (annual ÷ 12), number of periods (years × 12), and amount borrowed. The answer shows as negative because it is money leaving you.</p>",
      example: "<table><tr><th>$600,000 over 30 years</th><th>Monthly repayment</th></tr><tr><td>5.0%</td><td class='num'>$3,221</td></tr><tr><td>6.0%</td><td class='num'>$3,597</td></tr><tr><td>7.0%</td><td class='num'>$3,992</td></tr></table><p>Each 1-point rise adds roughly $375 to $395 a month.</p>",
      gens: ['pmtMonthly'],
      pool: [
        {q: 'Interest-only repayment on $500,000 at 6% a year, paid monthly, is:', o: ['$2,500', '$3,000', '$2,998', '$30,000'], a: 0, e: '$500,000 × 6% ÷ 12 = $2,500. A principal and interest loan costs more each month because it also repays the balance.'}
      ]},
    {id: 'contribution-real', name: 'Real contribution per sale', day: 5,
      explain: "<p>Gross margin only subtracts the product cost. But every sale drags other costs with it: card fees, packaging, shipping, returns, sales commissions. Contribution subtracts <b>all costs that happen because the sale happened</b>.</p><p>Steps: start with the ex-GST price, then subtract every per-sale cost. What is left is the cash each sale adds towards fixed costs and profit.</p>",
      example: "<table><tr><td>Dog-food subscription box, incl. GST</td><td class='num'>$88.00</td></tr><tr><td>Ex GST</td><td class='num'>$80.00</td></tr><tr><td>Product</td><td class='num'>($38.00)</td></tr><tr><td>Delivery</td><td class='num'>($11.00)</td></tr><tr><td>Fees and packaging</td><td class='num'>($4.60)</td></tr><tr><td><b>Contribution</b></td><td class='num'><b>$26.40 (33%)</b></td></tr></table>",
      gens: ['contributionReal'],
      pool: [
        {q: 'Which of these is NOT part of the variable cost of an online sale?', o: ['Card processing fee', 'Shipping', 'Warehouse lease', 'Packaging'], a: 2, e: 'The lease is fixed; it does not change with each sale.'}
      ]},
    {id: 'ltv-cac', name: 'LTV, CAC and churn', day: 5,
      explain: "<p>Think of customers as a bucket with a leak. <b>CAC</b> is what you pay to pour each customer in. <b>Churn</b> is the size of the leak. <b>LTV</b> is how much contribution a customer drips out before leaking away.</p><p>With monthly churn c, the average customer stays 1 ÷ c months, so LTV = monthly contribution ÷ c. Halve the leak and every customer is worth twice as much.</p><p>The test: LTV should be at least about 3 × CAC, measured with <b>contribution</b> and <b>paid</b> CAC.</p>",
      example: "<table><tr><th>Software, $40/month contribution</th><th>Life</th><th>LTV</th></tr><tr><td>2% churn</td><td class='num'>50 months</td><td class='num'>$2,000</td></tr><tr><td>5% churn</td><td class='num'>20 months</td><td class='num'>$800</td></tr><tr><td>10% churn</td><td class='num'>10 months</td><td class='num'>$400</td></tr></table><p>With CAC of $500, only the first is healthy (4×).</p>",
      gens: ['ltvChurn', 'ltvCac'],
      pool: [
        {q: 'A business quotes LTV using revenue per customer rather than contribution. The effect is to:', o: ['Understate LTV', 'Overstate LTV', 'Make no difference', 'Lower CAC'], a: 1, e: 'Revenue ignores the cost of serving the customer, inflating LTV.'},
        {q: 'Blended CAC is $30, but customers from paid ads cost $90. Which should guide spending on more paid ads?', o: ['Blended $30', 'Paid $90', 'The average, $60', 'Neither'], a: 1, e: 'Extra growth from ads costs the paid CAC.'}
      ]},
    {id: 'payback', name: 'Payback period', day: 5,
      explain: "<p>Every new customer is a small loan the business makes to itself: cash goes out on marketing today and comes back slowly as contribution. Payback is how long that loan takes to repay.</p><p class='formula'>Payback (months) = CAC ÷ monthly contribution</p><p>The longer the payback, the more cash fast growth eats, even when the business is profitable on paper.</p>",
      example: "<p>Win 1,000 customers a month at $240 CAC = $240,000 cash out each month. With an 8-month payback, the business is carrying around $1m of unrecovered acquisition spending at any time while it grows.</p>",
      gens: ['payback'],
      pool: [
        {q: 'Two businesses have the same LTV:CAC. Business A has a 4-month payback; Business B has 20 months. Which needs more cash to grow?', o: ['A', 'B', 'The same', 'Cannot tell'], a: 1, e: 'Longer payback means cash is tied up longer for each new customer.'}
      ]}
  ];
  // which concepts each day's "check your understanding" draws on
  w.days.forEach(d => { d.concepts = w.concepts.filter(c => c.day === d.n).map(c => c.id); });
  // tag quiz questions with concepts so results feed the mastery tracker
  const tags = ['margin-markup','margin-markup','margin-markup','gst','pct-change','pct-change','cagr','geo-mean','mean-median','weighted-avg','real-per-share','chart-tricks','pmt','ltv-cac','payback'];
  w.quiz.mc.forEach((q, i) => q.c = tags[i]);
  w.glossary = [
    ['Absolute reference', 'A spreadsheet reference locked with $ signs (e.g. $B$2) so it does not move when copied.'],
    ['Arithmetic mean', 'The ordinary average: sum of values divided by their count. Overstates compound returns.'],
    ['Blended CAC', 'Acquisition cost averaged over all new customers, including free ones such as referrals.'],
    ['CAGR', 'Compound annual growth rate: (end ÷ start)^(1/years) − 1.'],
    ['Churn rate', 'The share of customers who cancel in a period, usually monthly.'],
    ['Consumer price index (CPI)', 'The ABS measure of changes in the prices households pay; used to measure inflation.'],
    ['Contribution margin', 'Contribution per unit divided by the ex-GST price.'],
    ['Customer acquisition cost (CAC)', 'Sales and marketing spending divided by new customers won.'],
    ['Dual-axis chart', 'A chart with two vertical scales, which can make unrelated series look linked.'],
    ['Earnings per share (EPS)', 'Net profit attributable to shareholders divided by the number of shares.'],
    ['Geometric mean', 'The compound average growth rate; the rate wealth actually grows at.'],
    ['Gross margin', '(Sales − cost of goods sold) ÷ sales, using ex-GST figures.'],
    ['GST', 'Goods and services tax: 10% on most supplies in Australia, collected by businesses for the ATO.'],
    ['IRR', 'Internal rate of return: the discount rate at which NPV equals zero.'],
    ['LTV (customer lifetime value)', 'Total contribution a customer is expected to generate over their relationship with the business.'],
    ['LTV:CAC ratio', 'Lifetime value divided by acquisition cost; about 3 or more is a common rule of thumb for healthy.'],
    ['Markup', 'Profit as a percentage of cost.'],
    ['Median', 'The middle value when data is sorted; resistant to extreme values.'],
    ['Nominal', 'Measured in dollars of the day, not adjusted for inflation.'],
    ['NPV', 'Net present value: today\'s value of future cash flows minus the initial outlay.'],
    ['Payback period', 'Time for contribution to recover an upfront cost, such as CAC.'],
    ['Percentage point', 'The simple difference between two percentages (4% to 5% is one point).'],
    ['PMT', 'Spreadsheet function giving the fixed periodic repayment on a loan.'],
    ['Real', 'Adjusted for inflation, showing changes in purchasing power.'],
    ['SUMIFS', 'Spreadsheet function adding values in rows that meet one or more conditions.'],
    ['Survivorship bias', 'Distortion from only counting the survivors, e.g. funds still open.'],
    ['Truncated axis', 'A chart axis that does not start at zero, exaggerating differences.'],
    ['Unit economics', 'The revenue and costs of one unit (product, customer or site) of a business.'],
    ['Weighted average', 'An average in which each value counts in proportion to its size or importance.'],
    ['XIRR', 'Spreadsheet IRR for cash flows on irregular dates.'],
    ['XLOOKUP', 'Spreadsheet function that finds a value in one range and returns the matching value from another.']
  ].map(([t, d]) => ({t, d, week: 2}));
})();
