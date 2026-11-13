// Practice question generators. Each returns {q, o:[4 options], a:index, e:explanation} with fresh numbers every call.
// Week files reference these by id in concept.gens. Add new generators here as the course grows.
(function(){
  const R = (a, b, step = 1) => a + step * Math.floor(Math.random() * (Math.floor((b - a) / step) + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const $ = (n, dp = 0) => (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-AU', {minimumFractionDigits: dp, maximumFractionDigits: dp});
  const num = n => Math.round(n).toLocaleString('en-AU');
  const pct = (n, dp = 1) => (Math.round(n * 10 ** dp) / 10 ** dp).toLocaleString('en-AU') + '%';
  // build an MC from the correct answer + distractor values; fmt turns numbers into labels
  function mc(q, correct, wrongs, fmt, e){
    const seen = new Set([fmt(correct)]), opts = [fmt(correct)];
    for (const w of wrongs) { const f = fmt(w); if (!seen.has(f) && isFinite(w) && (w > 0 || correct <= 0)) { seen.add(f); opts.push(f); } if (opts.length === 4) break; }
    let k = 2; while (opts.length < 4) { const f = fmt(correct * (k % 2 ? 1 + k * .07 : 1 - k * .06)); if (!seen.has(f)) { seen.add(f); opts.push(f); } k++; }
    const order = opts.map((o, i) => [Math.random(), i]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    return {q, o: order.map(i => opts[i]), a: order.indexOf(0), e};
  }
  const G = {
    breakeven(){
      const p = R(8, 60), v = R(2, Math.floor(p * .6)), c = p - v, units = R(800, 6000, 50), f = c * units;
      return mc(`A product sells for ${$(p)} with variable costs of ${$(v)} per unit. Fixed costs are ${$(f)} a year. How many units must be sold to break even?`,
        units, [f / p, f / v, (f / c) * 1.5, f / (p + v)], x => num(x) + ' units',
        `Contribution per unit = ${$(p)} − ${$(v)} = ${$(c)}. Break-even = ${$(f)} ÷ ${$(c)} = ${num(units)} units. Dividing by price ignores variable costs, a common slip.`);
    },
    breakevenTarget(){
      const p = R(20, 120), v = R(5, Math.floor(p * .6)), c = p - v, be = R(1000, 5000, 100), f = c * be, profit = c * R(200, 2000, 100), u = (f + profit) / c;
      return mc(`Price ${$(p)}, variable cost ${$(v)} per unit, fixed costs ${$(f)}. How many units are needed to make a profit of ${$(profit)}?`,
        u, [be, (f + profit) / p, profit / c, (f - profit) / c], x => num(x) + ' units',
        `(Fixed costs + target profit) ÷ contribution = (${$(f)} + ${$(profit)}) ÷ ${$(c)} = ${num(u)} units.`);
    },
    contributionMargin(){
      const p = R(10, 200), v = R(2, Math.floor(p * .8)), cm = (p - v) / p * 100;
      return mc(`A service sells for ${$(p)} and costs ${$(v)} in variable costs each time it is delivered. What is the contribution margin as a percentage of price?`,
        cm, [v / p * 100, (p - v) / v * 100, 100 - cm / 2, cm * 1.25], x => pct(x),
        `Contribution margin % = (price − variable cost) ÷ price = (${$(p)} − ${$(v)}) ÷ ${$(p)} = ${pct(cm)}. Dividing by cost instead gives a markup, not a margin.`);
    },
    equation(){
      const L = R(100, 900, 10) * 1000, E = R(50, 600, 10) * 1000, A = L + E, mode = R(0, 1);
      if (mode) return mc(`A business has total assets of ${$(A)} and total liabilities of ${$(L)}. What is its equity?`,
        E, [A + L, L, A, L - E > 0 ? L - E : A / 2], $, `Equity = Assets − Liabilities = ${$(A)} − ${$(L)} = ${$(E)}.`);
      return mc(`A company has liabilities of ${$(L)} and equity of ${$(E)}. What are its total assets?`,
        A, [Math.abs(L - E), L, E, A * 2], $, `Assets = Liabilities + Equity = ${$(L)} + ${$(E)} = ${$(A)}.`);
    },
    leverage(){
      const V = R(500, 1500, 50) * 1000, dep = pick([.1, .2, .25, .3]), loan = V * (1 - dep), eq = V - loan, ch = pick([-15, -10, -5, 5, 10, 15]), nv = V * (1 + ch / 100), ne = nv - loan, eqch = (ne - eq) / eq * 100;
      return mc(`You buy a property for ${$(V)} with a ${pct(dep * 100, 0)} deposit and borrow the rest. The property value then ${ch > 0 ? 'rises' : 'falls'} by ${Math.abs(ch)}%. By what percentage does your equity change?`,
        Math.abs(eqch), [Math.abs(ch), Math.abs(ch) * (1 - dep), Math.abs(eqch) / 2, Math.abs(ch) / dep / 2], x => (ch > 0 ? '+' : '−') + pct(x, 0),
        `Equity starts at ${$(eq)}. The property moves to ${$(nv)}, the loan stays at ${$(loan)}, so equity becomes ${$(ne)}: a ${pct(eqch, 0)} change. With a ${pct(dep * 100, 0)} deposit, each 1% move in value moves equity by ${(1 / dep).toLocaleString('en-AU', {maximumFractionDigits: 1})}%.`);
    },
    depreciation(){
      const cost = R(20, 300, 5) * 1000, res = R(0, 4) * cost / 20, life = R(3, 10), dep = (cost - res) / life, mode = R(0, 1);
      if (mode) { const y = R(1, life - 1), bv = cost - dep * y;
        return mc(`Equipment costs ${$(cost)}, has a residual value of ${$(res)} and a ${life}-year life (straight-line). What is its book value after ${y} year${y > 1 ? 's' : ''}?`,
          bv, [cost - cost / life * y, cost - dep, res + dep * y, dep * y], $, `Annual depreciation = (${$(cost)} − ${$(res)}) ÷ ${life} = ${$(dep)}. After ${y} year${y > 1 ? 's' : ''}: ${$(cost)} − ${$(dep * y)} = ${$(bv)}.`); }
      return mc(`A vehicle costs ${$(cost)}, will be sold for ${$(res)} at the end of its ${life}-year life. What is the annual straight-line depreciation?`,
        dep, [cost / life, (cost + res) / life, cost - res, dep * 2], $, `(Cost − residual) ÷ life = (${$(cost)} − ${$(res)}) ÷ ${life} = ${$(dep)} a year. The cash all left on day one.`);
    },
    cashCycle(){
      const dio = R(10, 90, 5), dso = R(10, 90, 5), dpo = R(10, 60, 5), ccc = dio + dso - dpo;
      if (ccc <= 0) return G.cashCycle();
      return mc(`A business holds stock for ${dio} days, collects from customers in ${dso} days and pays suppliers in ${dpo} days. What is its cash conversion cycle?`,
        ccc, [dio + dso + dpo, dio + dpo - dso, dso - dpo, dio - dpo], x => num(x) + ' days',
        `Cash conversion cycle = days inventory + days receivables − days payables = ${dio} + ${dso} − ${dpo} = ${ccc} days.`);
    },
    extraCash(){
      const ccc = R(30, 90, 5), cogs = R(2, 20) * 365000, daily = cogs / 365, inc = pick([25, 50, 100]), need = daily * ccc * inc / 100;
      return mc(`A wholesaler's annual cost of sales is ${$(cogs)} and its cash conversion cycle is ${ccc} days. If sales grow by ${inc}% with the same terms, roughly how much extra working capital must it fund?`,
        need, [daily * ccc, cogs * inc / 100, need / 2, need * ccc / 30], $,
        `Daily cost of sales = ${$(cogs)} ÷ 365 = ${$(daily)}. Cash tied up = ${$(daily)} × ${ccc} days = ${$(daily * ccc)}. A ${inc}% increase needs about ${$(need)} more.`);
    },
    fv(){
      const pv = R(5, 100) * 1000, r = R(3, 10), n = R(3, 25), fv = pv * (1 + r / 100) ** n;
      return mc(`You invest ${$(pv)} at ${r}% a year, compounded annually, for ${n} years. What will it be worth?`,
        fv, [pv * (1 + r / 100 * n), pv * (1 + r / 100) ** (n - 1), pv * (1 + r / 100) ** (n + 2), pv / (1 + r / 100) ** n], $,
        `FV = ${$(pv)} × (1 + ${r / 100})^${n} = ${$(pv)} × ${((1 + r / 100) ** n).toFixed(3)} = ${$(fv)}. Simple interest would give only ${$(pv * (1 + r / 100 * n))}.`);
    },
    pv(){
      const fv = R(10, 500, 5) * 1000, r = R(3, 12), n = R(2, 15), pv = fv / (1 + r / 100) ** n;
      return mc(`What is ${$(fv)} received in ${n} years worth today, at a discount rate of ${r}%?`,
        pv, [fv * (1 - r / 100 * n), fv / (1 + r / 100 * n), fv / (1 + r / 100) ** (n - 1), fv * (1 + r / 100) ** -(n + 2)], $,
        `PV = ${$(fv)} ÷ (1 + ${r / 100})^${n} = ${$(fv)} ÷ ${((1 + r / 100) ** n).toFixed(3)} = ${$(pv)}.`);
    },
    rule72(){
      const r = pick([2, 3, 4, 6, 8, 9, 12]), y = 72 / r;
      return mc(`Using the rule of 72, roughly how long does money take to double at ${r}% a year?`,
        y, [100 / r, 72 / r / 2, r * 2, 72 / (r + 2)], x => num(x) + ' years', `72 ÷ ${r} ≈ ${num(y)} years.`);
    },
    compareOffers(){
      const now = R(100, 900, 10) * 1000, n = R(2, 6), r = R(4, 12), later = Math.round(now * (1 + (r + pick([-3, -2, -1, 1, 2, 3])) / 100) ** n / 1000) * 1000, pvl = later / (1 + r / 100) ** n;
      const better = pvl > now ? 1 : 0;
      const o = [`${$(now)} today`, `${$(later)} in ${n} years`, 'They are worth exactly the same', 'It cannot be compared'];
      return {q: `At a ${r}% discount rate, which is worth more: ${$(now)} today or ${$(later)} in ${n} years?`, o, a: better,
        e: `PV of ${$(later)} = ${$(later)} ÷ ${((1 + r / 100) ** n).toFixed(3)} = ${$(pvl)}, which is ${better ? 'more' : 'less'} than ${$(now)}. Always bring both amounts to the same date.`};
    },
    caprate(){
      const inc = R(40, 900, 5) * 1000, cr = pick([4.5, 5, 5.5, 6, 6.25, 6.5, 7, 7.5, 8]), v = inc / (cr / 100), mode = R(0, 1);
      if (mode) return mc(`A commercial property sold for ${$(v)} and earns net income of ${$(inc)} a year. What is the capitalisation rate?`,
        cr, [cr * 1.2, cr * .8, 100 / cr, cr + 1.5], x => pct(x, 2), `Cap rate = net income ÷ value = ${$(inc)} ÷ ${$(v)} = ${pct(cr, 2)}.`);
      return mc(`A property earns net income of ${$(inc)} a year. Similar properties sell at a ${cr}% cap rate. What is it worth?`,
        v, [inc * cr, inc / ((cr + 1) / 100), inc * (100 / cr) / 2, inc / ((cr - .5) / 100)], $, `Value = net income ÷ cap rate = ${$(inc)} ÷ ${cr / 100} = ${$(v)}.`);
    },
    caprateShift(){
      const inc = R(100, 800, 10) * 1000, c1 = pick([5, 5.5, 6, 6.5]), d = pick([.5, .75, 1]), c2 = c1 + d, v1 = inc / (c1 / 100), v2 = inc / (c2 / 100), fall = v1 - v2;
      return mc(`A property earning ${$(inc)} net a year is valued at a ${c1}% cap rate. If market cap rates rise to ${c2}%, by roughly how much does its value fall?`,
        fall, [inc * d, v1 * d / 100, fall / 2, fall * 1.6], $, `At ${c1}%: ${$(v1)}. At ${c2}%: ${$(v2)}. Fall = ${$(fall)} (${pct(fall / v1 * 100)}). Small cap rate moves cause big value moves.`);
    },
    requiredReturn(){
      const rf = pick([4, 4.5, 5, 5.25]), prem = pick([3, 5, 6, 8, 10, 12, 14]), req = rf + prem;
      return mc(`Government bonds yield ${rf}%. You judge an investment needs a ${prem}% risk premium. What is your required return?`,
        req, [prem, rf * prem / 2, req * 1.5, prem - rf], x => pct(x, 2), `Required return = risk-free rate + risk premium = ${rf}% + ${prem}% = ${pct(req, 2)}.`);
    },
    impliedReturn(){
      const inv = R(10, 200, 5) * 1000, n = R(2, 5), r = R(5, 20), back = Math.round(inv * (1 + r / 100) ** n / 1000) * 1000, irr = ((back / inv) ** (1 / n) - 1) * 100;
      return mc(`You are asked to invest ${$(inv)} now and will receive ${$(back)} in ${n} years, with nothing in between. What annual compound return is that?`,
        irr, [(back / inv - 1) / n * 100, (back / inv - 1) * 100, irr * 1.4, irr * .7], x => pct(x),
        `(${$(back)} ÷ ${$(inv)})^(1/${n}) − 1 = ${pct(irr)} a year. Dividing the total gain by ${n} (${pct((back / inv - 1) / n * 100)}) overstates it because it ignores compounding.`);
    },

    /* ---- Week 2: business numeracy ---- */
    marginMarkup(){
      const cost = R(20, 400, 5), mk = pick([20, 25, 40, 50, 60, 75, 100, 150]), price = cost * (1 + mk / 100), m = (price - cost) / price * 100;
      return mc(`An item costs ${$(cost)} and is sold for ${$(price, price % 1 ? 2 : 0)} (GST aside), a ${mk}% markup. What is the gross margin?`,
        m, [mk, 100 - mk, mk / 2, m * 1.3], x => pct(x),
        `Margin = profit ÷ price = ${$(price - cost, 2)} ÷ ${$(price, 2)} = ${pct(m)}. Shortcut: markup ÷ (1 + markup) = ${mk / 100} ÷ ${1 + mk / 100}. Markup uses cost as the base; margin uses price.`);
    },
    priceForMargin(){
      const cost = R(12, 300), m = pick([20, 25, 30, 35, 40, 50, 60]), price = cost / (1 - m / 100);
      return mc(`A product costs ${$(cost)}. What selling price (excluding GST) gives a ${m}% gross margin?`,
        price, [cost * (1 + m / 100), cost / (m / 100), cost * (1 + m / 200), price * 1.15], x => $(x, 2),
        `Price = cost ÷ (1 − margin) = ${$(cost)} ÷ ${(1 - m / 100).toFixed(2)} = ${$(price, 2)}. Adding ${m}% to cost (${$(cost * (1 + m / 100), 2)}) gives only a ${pct(m / (100 + m) * 100)} margin.`);
    },
    gstOut(){
      const ex = R(10, 900) * (Math.random() < .5 ? 1 : 10), inc = ex * 1.1, g = inc / 11;
      return mc(`A customer pays ${$(inc, 2)} including GST. How much of that is GST?`,
        g, [inc * .1, inc - inc * .9 + 1, g * 1.5, inc * .09], x => $(x, 2),
        `GST is one eleventh of a GST-inclusive price: ${$(inc, 2)} ÷ 11 = ${$(g, 2)}. The price before GST is ${$(inc, 2)} ÷ 1.1 = ${$(ex, 2)}. Taking 10% of ${$(inc, 2)} (${$(inc * .1, 2)}) uses the wrong base.`);
    },
    recovery(){
      const f = pick([10, 20, 25, 30, 40, 50, 60, 75, 80]), g = f / (100 - f) * 100;
      return mc(`An investment falls ${f}%. What percentage gain does it need to get back to where it started?`,
        g, [f, f * 1.5, g * .7, 100 - f], x => pct(x),
        `After a ${f}% fall, ${100 - f}% is left. To get back to 100 it must grow by ${f} ÷ ${100 - f} = ${pct(g)}. Falls and recoveries are measured on different bases.`);
    },
    stackedDiscount(){
      const a = pick([10, 15, 20, 25, 30, 40]), b = pick([5, 10, 15, 20, 25]), tot = 100 - (100 - a) * (100 - b) / 100;
      return mc(`A supplier gives ${a}% off, then a further ${b}% off the reduced price. What is the total discount?`,
        tot, [a + b, a + b + 2, (a + b) / 2, tot - 4], x => pct(x),
        `Multiply what is left: ${(1 - a / 100).toFixed(2)} × ${(1 - b / 100).toFixed(2)} = ${((100 - a) * (100 - b) / 10000).toFixed(4)}, so the total discount is ${pct(tot)}, not ${a + b}%.`);
    },
    points(){
      const r1 = pick([2, 2.5, 3, 4, 4.5, 5, 6]), d = pick([0.25, 0.5, 1, 1.5, 2]), r2 = r1 + d, rel = d / r1 * 100;
      return mc(`A loan rate rises from ${r1}% to ${r2}%. By what percentage has the interest bill risen (same balance)?`,
        rel, [d, d * 10, rel / 2, r2], x => pct(x),
        `The rate rose ${d} percentage points, which is ${d} ÷ ${r1} = ${pct(rel)} more interest. Percentage points and per cent are different things.`);
    },
    cagr(){
      const v0 = R(1, 50) * 100000, n = R(3, 10), g = R(4, 25), v1 = Math.round(v0 * (1 + g / 100) ** n / 10000) * 10000, c = ((v1 / v0) ** (1 / n) - 1) * 100;
      return mc(`Revenue grew from ${$(v0)} to ${$(v1)} over ${n} years. What is the compound annual growth rate (CAGR)?`,
        c, [(v1 / v0 - 1) / n * 100, (v1 / v0 - 1) * 100, ((v1 / v0) ** (1 / (n + 1)) - 1) * 100, c * 1.3], x => pct(x),
        `CAGR = (${$(v1)} ÷ ${$(v0)})^(1/${n}) − 1 = ${pct(c)}. Dividing total growth by ${n} (${pct((v1 / v0 - 1) / n * 100)}) ignores compounding.`);
    },
    geoMean(){
      const up = pick([20, 25, 30, 40, 50, 60]), dn = pick([10, 20, 25, 30, 40, 50]), am = (up - dn) / 2, gm = (Math.sqrt((1 + up / 100) * (1 - dn / 100)) - 1) * 100;
      return mc(`A fund returns +${up}% in year 1 and −${dn}% in year 2. What was its compound (geometric) annual return?`,
        gm, [am, up - dn, gm - 3, am + 2], x => pct(x),
        `√(${1 + up / 100} × ${(1 - dn / 100).toFixed(2)}) − 1 = ${pct(gm)} a year. The simple average (${pct(am)}) overstates what the investor actually earned.`);
    },
    weightedMargin(){
      const s1 = R(1, 9) * 1e6, s2 = ((s1 / 1e6 + R(1, 8) - 1) % 9 + 1) * 1e6, m1 = R(10, 45), m2 = R(5, 40), w = (s1 * m1 + s2 * m2) / (s1 + s2);
      return mc(`Division A has sales of ${$(s1)} at a ${m1}% margin. Division B has sales of ${$(s2)} at a ${m2}% margin. What is the margin for the whole business?`,
        w, [(m1 + m2) / 2, m1 + m2, Math.max(m1, m2), w * 1.2], x => pct(x),
        `Total gross profit ÷ total sales = (${$(s1 * m1 / 100)} + ${$(s2 * m2 / 100)}) ÷ ${$(s1 + s2)} = ${pct(w)}. A simple average of ${pct((m1 + m2) / 2)} ignores the different sizes.`);
    },
    pmtMonthly(){
      const P = R(20, 120) * 10000, r = pick([5, 5.5, 6, 6.5, 7, 7.5, 8]), y = pick([20, 25, 30]), i = r / 1200, n = y * 12, pmt = P * i / (1 - (1 + i) ** -n);
      return mc(`What is the monthly repayment on a ${$(P)} loan at ${r}% a year over ${y} years? (Spreadsheet: =PMT(${r}%/12, ${n}, ${P}))`,
        pmt, [P * r / 100 / 12, P / n, P * (r / 100) / (1 - (1 + r / 100) ** -y) / 12 * 1.04, pmt * 1.2], x => $(x),
        `Monthly rate ${r}% ÷ 12, ${n} payments: PMT = P × i ÷ (1 − (1 + i)^−n) = ${$(pmt, 2)}. Match the rate to the period: a monthly loan needs a monthly rate.`);
    },
    ltvChurn(){
      const c = R(10, 80), ch = pick([2, 2.5, 3, 4, 5, 6, 8, 10]), ltv = c / (ch / 100);
      return mc(`A subscription earns ${$(c)} a month of contribution per customer. ${ch}% of customers cancel each month. What is the lifetime value of a customer?`,
        ltv, [c * 12, c * ch, ltv / 2, c * 100 / ch * 1.5], x => $(x),
        `Average life = 1 ÷ churn = ${(100 / ch).toFixed(1)} months. LTV = ${$(c)} ÷ ${ch / 100} = ${$(ltv)}.`);
    },
    payback(){
      const c = R(15, 90), m = R(3, 24), cac = c * m;
      return mc(`It costs ${$(cac)} in marketing to win a customer, who then brings in ${$(c)} a month of contribution. What is the payback period?`,
        m, [m / 2, m * 2, m + 6, m * 1.5], x => num(x) + ' months',
        `Payback = CAC ÷ monthly contribution = ${$(cac)} ÷ ${$(c)} = ${m} months. Until then, each new customer is cash out the door.`);
    },
    ltvCac(){
      const cac = R(40, 400, 10), ratio = pick([0.6, 0.8, 1.5, 2, 3, 4, 5]), ltv = cac * ratio;
      const label = ratio < 1 ? 'Each new customer destroys value' : ratio < 3 ? 'Viable but thin once overheads are counted' : 'Healthy: each customer is worth well above their cost';
      const opts = ['Each new customer destroys value', 'Viable but thin once overheads are counted', 'Healthy: each customer is worth well above their cost', 'Cannot say without the share price'];
      return {q: `Customer lifetime value is ${$(ltv)} and acquisition cost is ${$(cac)}. Which best describes the unit economics?`, o: opts, a: opts.indexOf(label),
        e: `LTV ÷ CAC = ${ratio.toFixed(1)}. Below 1 destroys value; 1 to 3 is viable but thin; 3 or more is the usual rule of thumb for healthy.`};
    },
    contributionReal(){
      const inc = R(30, 300) * 1.1, ex = inc / 1.1, cogs = Math.round(ex * pick([.3, .4, .45, .5])), fee = ex * .02, ship = R(5, 20), c = ex - cogs - fee - ship;
      return mc(`An online store sells an item for ${$(inc, 2)} including GST. Product cost ${$(cogs)}, card fees 2% of the ex-GST price, shipping ${$(ship)}. What is the contribution per sale?`,
        c, [inc - cogs - fee - ship, ex - cogs, inc - cogs, c * .8], x => $(x, 2),
        `Ex-GST price ${$(ex, 2)} − product ${$(cogs)} − fees ${$(fee, 2)} − shipping ${$(ship)} = ${$(c, 2)}. Forgetting GST or the small per-sale costs overstates it.`);
    },
    // Week 3: money maths in practice
    fvFreq(){
      const pv = R(5, 100) * 1000, r = R(3, 12), n = R(3, 20), f = pick([[12, 'monthly'], [4, 'quarterly'], [365, 'daily']]), fv = pv * (1 + r / 100 / f[0]) ** (n * f[0]), fa = pv * (1 + r / 100) ** n;
      return mc(`You invest ${$(pv)} at ${r}% a year, compounded ${f[1]}, for ${n} years. What will it be worth?`,
        fv, [fa, pv * (1 + r / 100 * n), pv * (1 + r / 100 / f[0]) ** n, fv * 1.08], $,
        `Rate per period ${r}% ÷ ${f[0]}, periods ${n} × ${f[0]} = ${n * f[0]}. FV = ${$(pv)} × (1 + ${r / 100}/${f[0]})^${n * f[0]} = ${$(fv)}. Compounded annually it would be ${$(fa)}.`);
    },
    solveRate(){
      const pv = R(50, 900, 10) * 1000, r = R(3, 12) + pick([0, .5]), n = R(3, 15), fv = Math.round(pv * (1 + r / 100) ** n / 1000) * 1000, ra = ((fv / pv) ** (1 / n) - 1) * 100, simple = (fv / pv - 1) / n * 100;
      return mc(`An asset bought for ${$(pv)} sells for ${$(fv)} ${n} years later. What annual compound return did it earn?`,
        ra, [simple, (fv / pv - 1) * 100, ra * 1.4, ra * .7], x => pct(x, 2),
        `Rate = (FV ÷ PV)^(1/n) − 1 = (${$(fv)} ÷ ${$(pv)})^(1/${n}) − 1 = ${pct(ra, 2)} a year. Dividing the total gain by the years (${pct(simple, 2)}) ignores compounding. Spreadsheet: =RATE(${n},0,-${pv},${fv}).`);
    },
    solveYears(){
      const pv = R(10, 200, 5) * 1000, r = R(3, 12), m = pick([1.5, 2, 3]), y = Math.log(m) / Math.log(1 + r / 100);
      return mc(`How many years does it take ${$(pv)} to grow to ${$(pv * m)} at ${r}% a year compounded annually?`,
        y, [(m - 1) / (r / 100), y * 1.5, y * 1.35 + 1, y * .6], x => (Math.round(x * 10) / 10).toLocaleString('en-AU') + ' years',
        `n = ln(FV ÷ PV) ÷ ln(1 + r) = ln(${m}) ÷ ln(${1 + r / 100}) = ${(Math.round(y * 10) / 10)} years. Spreadsheet: =NPER(${r}%,0,-${pv},${pv * m}).`);
    },
    annuityFV(){
      const p = R(2, 20) * 100, r = pick([3, 4, 4.5, 5, 6, 7]), y = R(5, 30), i = r / 1200, n = y * 12, fv = p * ((1 + i) ** n - 1) / i;
      return mc(`You save ${$(p)} at the end of every month for ${y} years in an account paying ${r}% a year, compounded monthly. How much will you have?`,
        fv, [p * n, p * n * (1 + r / 100 * y / 2) * 1.15, fv * 1.2, fv * .8], $,
        `FV of an annuity = PMT × ((1 + i)^n − 1) ÷ i, with i = ${r}% ÷ 12 and n = ${n}. Result ${$(fv)}, of which you paid in ${$(p * n)}. Spreadsheet: =FV(${r}%/12,${n},-${p}).`);
    },
    annuityPV(){
      const p = R(15, 60) * 100, r = pick([5, 5.5, 6, 6.5, 7, 7.5]), y = pick([25, 30]), i = r / 1200, n = y * 12, pv = p * (1 - (1 + i) ** -n) / i;
      return mc(`You can afford repayments of ${$(p)} a month. Roughly how much can you borrow at ${r}% a year over ${y} years?`,
        pv, [p * n, p * 12 / (r / 100), pv * 1.25, pv * .75], $,
        `Borrowing = PV of the repayments = PMT × (1 − (1 + i)^−n) ÷ i = ${$(pv)}. Multiplying ${$(p)} by ${n} payments ignores interest. Spreadsheet: =PV(${r}%/12,${n},-${p}).`);
    },
    savingsGoal(){
      const goal = R(20, 200, 10) * 1000, r = pick([3, 4, 4.5, 5]), y = R(2, 10), i = r / 1200, n = y * 12, p = goal * i / ((1 + i) ** n - 1);
      return mc(`You want ${$(goal)} in ${y} years. Your account pays ${r}% a year, compounded monthly. How much must you save at the end of each month?`,
        p, [goal / n, goal * i / (1 - (1 + i) ** -n), p * 1.15, p * .8], x => $(x),
        `Solve the annuity FV formula for PMT: ${$(goal)} × i ÷ ((1 + i)^n − 1) = ${$(p, 2)} a month. Simply dividing by ${n} months (${$(goal / n)}) ignores interest. Spreadsheet: =PMT(${r}%/12,${n},0,${goal}).`);
    },
    perpetuity(){
      const c = R(5, 200, 5) * 1000, r = pick([4, 5, 6, 7, 8, 10]), v = c / (r / 100);
      return mc(`An asset pays ${$(c)} a year forever. At a ${r}% required return, what is it worth today?`,
        v, [c * r, c * 20, v / 2, c / ((r + 2) / 100)], $,
        `Perpetuity value = payment ÷ rate = ${$(c)} ÷ ${r / 100} = ${$(v)}. The same formula is the cap rate method for property.`);
    },
    ear(){
      const r = pick([6, 8, 9.99, 12, 15, 18, 19.99, 21.99]), f = pick([[12, 'monthly'], [365, 'daily'], [4, 'quarterly']]), e = ((1 + r / 100 / f[0]) ** f[0] - 1) * 100;
      return mc(`A rate is quoted as ${r}% a year, compounded ${f[1]}. What is the effective annual rate?`,
        e, [r, r * 1.2, r / f[0], e + 2], x => pct(x, 2),
        `EAR = (1 + ${r}% ÷ ${f[0]})^${f[0]} − 1 = ${pct(e, 2)}. Compounding makes the effective rate higher than the nominal rate.`);
    },
    interestSplit(){
      const P = R(30, 120) * 10000, r = pick([5.5, 6, 6.5, 7]), y = 30, i = r / 1200, n = 360, pmt = P * i / (1 - (1 + i) ** -n), int = P * i, pr = pmt - int;
      return mc(`On a ${$(P)} loan at ${r}% over ${y} years, the repayment is ${$(pmt, 2)} a month. How much of the FIRST repayment reduces the loan?`,
        pr, [pmt, int, P / n, pmt / 2], x => $(x),
        `First month's interest = ${$(P)} × ${r}% ÷ 12 = ${$(int, 2)}. Principal = ${$(pmt, 2)} − ${$(int, 2)} = ${$(pr, 2)}. Early repayments are mostly interest.`);
    },
    offsetSaving(){
      const off = R(10, 150, 5) * 1000, r = pick([5.5, 6, 6.5]), t = pick([30, 37, 45]), save = off * r / 100, td = pick([4, 4.25, 4.5]), dep = off * td / 100 * (1 - (t + 2) / 100);
      return mc(`You have ${$(off)} spare. Your home loan rate is ${r}%. You pay ${t}% tax plus the 2% Medicare levy. How much better off are you in a year by keeping the money in your offset account rather than a ${td}% savings account? (Ignore compounding.)`,
        save - dep, [save, off * td / 100, save - off * td / 100, dep], $,
        `Offset saves ${$(off)} × ${r}% = ${$(save)} of interest, tax free. Savings earn ${$(off * td / 100)}, taxed at ${t + 2}%, leaving ${$(dep)}. Difference ${$(save - dep)}.`);
    },
    realReturn(){
      const n = pick([4, 5, 6, 7, 8, 9, 10]), inf = pick([2, 2.5, 3, 3.5, 4]), real = ((1 + n / 100) / (1 + inf / 100) - 1) * 100;
      return mc(`An investment earns ${n}% a year when inflation is ${inf}%. What is the exact real return (Fisher equation)?`,
        real, [n + inf, n / inf, real + 0.5, (n - inf) * 1.2], x => pct(x, 2),
        `1 + real = (1 + ${n}%) ÷ (1 + ${inf}%) → real = ${pct(real, 2)}. The quick approximation, ${n} − ${inf} = ${pct(n - inf, 1)}, is close at low rates.`);
    },
    purchasingPower(){
      const a = R(20, 500, 10) * 1000, inf = pick([2, 2.5, 3, 4]), y = R(5, 30), v = a / (1 + inf / 100) ** y;
      return mc(`With inflation averaging ${inf}% a year, what will ${$(a)} in ${y} years buy in today's dollars?`,
        v, [a * (1 - inf / 100 * y), a, a * (1 + inf / 100) ** y, v * .8], $,
        `Discount by inflation: ${$(a)} ÷ (1 + ${inf}%)^${y} = ${$(v)}. Inflation is compounding in reverse.`);
    },
    afterTaxReal(){
      const r = pick([4, 4.5, 5, 5.5]), t = pick([15, 30, 37, 45]), inf = pick([2.5, 3, 3.5]), at = r * (1 - t / 100), real = ((1 + at / 100) / (1 + inf / 100) - 1) * 100;
      return mc(`A term deposit pays ${r}%. You pay tax at ${t}% and inflation is ${inf}%. What is your real after-tax return, to two decimals?`,
        real, [r - inf, at, ((1 + r / 100) / (1 + inf / 100) - 1) * 100 * (1 - t / 100), real + 1.2], x => pct(x, 2),
        `After tax: ${r}% × (1 − ${t}%) = ${pct(at, 2)}. Real: (1 + ${pct(at, 2)}) ÷ (1 + ${inf}%) − 1 = ${pct(real, 2)}. Tax applies to the nominal return, which is why cash often barely keeps up with prices.`);
    },
    gearedReturn(){
      const V = R(500, 1500, 50) * 1000, dep = pick([.2, .25, .3, .4]), D = V * (1 - dep), E = V * dep, y = pick([2.5, 3, 3.5, 4]), r = pick([5.5, 6, 6.5, 7]), g = pick([-5, 0, 3, 5, 8]);
      const inc = V * y / 100, int = D * r / 100, ret = (V * g / 100 + inc - int) / E * 100;
      return mc(`You buy a property for ${$(V)} with a ${pct(dep * 100, 0)} deposit. Net rent is ${y}% of the value; the loan costs ${r}% interest. If the value ${g === 0 ? 'stays flat' : (g > 0 ? 'rises ' : 'falls ') + Math.abs(g) + '%'} over the year, what is the return on your equity?`,
        ret, [g / dep, g + y - r, ret + int / E * 100, g], x => (x < 0 ? '−' : '+') + pct(Math.abs(x), 1),
        `Equity ${$(E)}. Value change ${$(V * g / 100)} + net rent ${$(inc)} − interest ${$(int)} = ${$(V * g / 100 + inc - int)}, which is ${pct(ret, 1)} of equity. Leverage multiplies the gap between what the asset earns and what the loan costs.`);
    },
    breakEvenGrowth(){
      const V = R(500, 1500, 50) * 1000, dep = pick([.2, .3]), D = V * (1 - dep), y = pick([2.5, 3, 3.5]), r = pick([6, 6.5, 7]), gap = D * r / 100 - V * y / 100, be = gap / V * 100;
      return mc(`A ${$(V)} property is bought with a ${pct(dep * 100, 0)} deposit. Net rent is ${y}% of value and the loan rate is ${r}%. What annual price growth does it need just to break even?`,
        be, [r - y, r, be * 2, be / 2], x => pct(x, 2),
        `Interest ${$(D * r / 100)} − rent ${$(V * y / 100)} = ${$(gap)} shortfall a year. Growth needed = ${$(gap)} ÷ ${$(V)} = ${pct(be, 2)}.`);
    },
    // Week 4: the financial system
    bankLeverage(){
      const A = R(50, 900, 10), eqp = pick([5, 5.5, 6, 6.5, 7, 8]), E = A * eqp / 100, mode = R(0, 1);
      if (mode) return mc(`A bank has ${$(A)}bn of assets funded with ${$(E, 1)}bn of shareholders' equity. What share of its assets would have to be lost to wipe out its equity entirely?`,
        eqp, [100 - eqp, A / E, eqp * 2, eqp / 2], x => pct(x, 1),
        `Equity ÷ assets = ${$(E, 1)}bn ÷ ${$(A)}bn = ${pct(eqp, 1)}. Losses beyond that leave nothing for shareholders. Leverage multiple ${(A / E).toFixed(1)}×.`);
      return mc(`A bank has ${$(A)}bn of assets and ${$(E, 1)}bn of equity. What is its leverage multiple (assets ÷ equity)?`,
        A / E, [E / A * 100, (A - E) / A * 10, A / E / 2, A / E * 1.5], x => x.toFixed(1) + '×',
        `${$(A)}bn ÷ ${$(E, 1)}bn = ${(A / E).toFixed(1)}×. A 1% fall in asset values cuts equity by about ${(A / E).toFixed(0)}%.`);
    },
    bankROE(){
      const A = R(20, 200, 10), nim = pick([1.6, 1.8, 2, 2.2]), cost = pick([40, 45, 50]), bad = pick([.05, .1, .15, .2]), eqp = pick([5, 6, 7]), nii = A * nim / 100, c = nii * cost / 100, bd = A * bad / 100, np = (nii - c - bd) * .7, E = A * eqp / 100, roe = np / E * 100;
      return mc(`A bank with ${$(A)}bn of assets earns a net interest margin of ${nim}%. Operating costs are ${cost}% of net interest income, bad debts are ${bad}% of assets, tax is 30%, and equity is ${eqp}% of assets. What is its return on equity?`,
        roe, [np / A * 100, nim, roe * .7, roe * 1.3], x => pct(x, 1),
        `Net interest income ${$(nii, 2)}bn − costs ${$(c, 2)}bn − bad debts ${$(bd, 2)}bn = ${$(nii - c - bd, 2)}bn before tax, ${$(np, 2)}bn after. ÷ equity ${$(E, 1)}bn = ${pct(roe, 1)}. A thin margin magnified by leverage.`);
    },
    afterTaxDebt(){
      const r = pick([5, 5.5, 6, 6.5, 7, 7.5, 8, 9]), t = pick([25, 30]), at = r * (1 - t / 100);
      return mc(`A company borrows at ${r}% and pays company tax at ${t}%. What is its after-tax cost of debt?`,
        at, [r, r * t / 100, r + t / 10, at * 1.2], x => pct(x, 2),
        `Interest is tax deductible: ${r}% × (1 − ${t}%) = ${pct(at, 2)}. Dividends are not deductible, which is one reason debt is cheaper than equity.`);
    },
    gearingROE(){
      const A = R(2, 50) * 1e6, roa = pick([4, 6, 8, 10, 12, 15]), d = pick([.3, .4, .5, .6]), r = pick([6, 7, 8]), D = A * d, E = A - D, ebit = A * roa / 100, roe = (ebit - D * r / 100) * .7 / E * 100;
      return mc(`A company has ${$(A)} of assets earning ${roa}% before interest and tax. It is funded ${pct(d * 100, 0)} by debt at ${r}% and the rest by equity. Tax is 30%. What is its return on equity?`,
        roe, [roa * .7, roa, roe * (1 - d), roa * .7 / (1 - d)], x => (x < 0 ? '−' : '') + pct(Math.abs(x), 1),
        `EBIT ${$(ebit)} − interest ${$(D * r / 100)} = ${$(ebit - D * r / 100)} before tax; × 0.7 = ${$((ebit - D * r / 100) * .7)}. ÷ equity ${$(E)} = ${(roe < 0 ? '−' : '') + pct(Math.abs(roe), 1)}${roe < 0 ? ' (assuming the loss gives a tax benefit)' : ''}. All-equity it would be ${pct(roa * .7, 1)}: debt ${roa > r ? 'helps because assets earn more than the loan rate' : roa === r ? 'makes no difference because assets earn exactly the loan rate' : 'hurts because assets earn less than the loan rate'}.`);
    },
    waterfall(){
      const prop = R(2, 10) * 1e6, mort = prop * pick([.6, .7, .8, .9]), other = R(1, 8) * 1e6, costs = R(2, 8) * 1e5, emp = R(3, 20) * 1e5, uns = R(3, 15) * 1e6;
      const pool = prop - mort + other, left = Math.max(pool - costs - emp, 0), c = Math.min(left / uns, 1) * 100;
      if (left <= 0 || c >= 100) return G.waterfall();
      return mc(`A company is liquidated. Its building sells for ${$(prop)} and the bank holds a ${$(mort)} mortgage over it. Other assets raise ${$(other)}. Liquidation costs are ${$(costs)}, employee entitlements ${$(emp)}, and unsecured creditors are owed ${$(uns)}. How many cents in the dollar do unsecured creditors receive?`,
        c, [(prop + other - costs - emp) / uns * 100, (other - costs - emp) / uns * 100, (pool) / uns * 100, c * .6], x => Math.round(x) + 'c',
        `Bank is paid ${$(mort)} from the building; surplus ${$(prop - mort)} joins other assets: pool ${$(pool)}. Less costs ${$(costs)} and employees ${$(emp)} = ${$(left)} for unsecured creditors owed ${$(uns)}: ${Math.round(c)}c in the dollar. Shareholders get nothing.`);
    },
    bondPrice(){
      const c = pick([3, 4, 4.5, 5, 6]), n = pick([2, 3, 5, 10]), y = c + pick([-1.5, -1, -.5, .5, 1, 1.5]), p = Array.from({length: n}, (_, k) => c / (1 + y / 100) ** (k + 1)).reduce((a, b) => a + b, 0) + 100 / (1 + y / 100) ** n;
      return mc(`A bond with a $100 face value pays a ${c}% coupon once a year and matures in ${n} years. Market yields are now ${y}%. What is its price?`,
        p, [200 - p, 100, 100 * (1 + (c - y) / 100), p + (p > 100 ? -2 : 2) * n / 2], x => $(x, 2),
        `Discount each $${c} coupon and the $100 repayment at ${y}%: price ${$(p, 2)}. Yield ${y > c ? 'above' : 'below'} the coupon → price ${y > c ? 'below' : 'above'} $100. Price and yield always move in opposite directions.`);
    },
    marketCap(){
      const sh = R(50, 3000, 10), px = R(1, 120) + pick([0, .5]), cap = sh * px;
      return mc(`A listed company has ${num(sh)} million shares on issue trading at ${$(px, 2)}. What is its market capitalisation?`,
        cap, [sh / px, cap / 10, cap * 10, px * 100], x => x >= 1000 ? $(x / 1000, 2) + 'bn' : $(x) + 'm',
        `Market cap = shares × price = ${num(sh)}m × ${$(px, 2)} = ${cap >= 1000 ? $(cap / 1000, 2) + 'bn' : $(cap) + 'm'}.`);
    },
    fcsCover(){
      const bal = R(30, 120) * 10000, banks = pick([1, 2, 3]), covered = Math.min(bal, 250000 * banks);
      return mc(`You hold ${$(bal)} in deposits, spread evenly across ${banks} separately licensed Australian bank${banks > 1 ? 's' : ''}. How much is protected by the Financial Claims Scheme?`,
        covered, [250000, bal, covered / 2 + 125000, 250000 * (banks + 1)], $,
        `The guarantee covers up to $250,000 per account holder per licensed ADI. ${banks} × $250,000 = ${$(250000 * banks)} limit; your covered amount is ${$(covered)}${bal > covered ? `, leaving ${$(bal - covered)} unprotected` : ''}.`);
    },
    // ---- Week 5: double-entry bookkeeping ----
    drcrSide(){
      const A = [['Bank', 'asset'], ['Accounts receivable', 'asset'], ['Equipment', 'asset'], ['Inventory', 'asset'], ['Prepaid insurance', 'asset'],
        ['Accounts payable', 'liability'], ['Bank loan', 'liability'], ['GST payable', 'liability'], ['Unearned revenue', 'liability'],
        ['Share capital', 'equity'], ['Retained earnings', 'equity'], ['Sales revenue', 'revenue'], ['Interest income', 'revenue'],
        ['Wages expense', 'expense'], ['Rent expense', 'expense'], ['Depreciation expense', 'expense'], ['Drawings', 'drawings']];
      const [name, type] = pick(A), up = R(0, 1), drHome = ['asset', 'expense', 'drawings'].includes(type), side = (drHome === !!up) ? 'Debit' : 'Credit';
      const wrong = side === 'Debit' ? 'Credit' : 'Debit';
      const o = [side, wrong, 'Either side, as long as it is labelled', 'Neither: it goes straight to the balance sheet'];
      const order = [0, 1, 2, 3].sort(() => Math.random() - .5);
      const lab = {asset: 'an asset', liability: 'a liability', equity: 'an equity', revenue: 'a revenue', expense: 'an expense', drawings: 'a drawings'}[type];
      return {q: `To ${up ? 'increase' : 'decrease'} ${name} (${lab} account), which side do you post to?`,
        o: order.map(i => o[i]), a: order.indexOf(0),
        e: `${name} is ${lab} account. Under DEALER, ${drHome ? 'drawings, expenses and assets increase with debits' : 'liabilities, equity and revenue increase with credits'}, so to ${up ? 'increase' : 'decrease'} it you ${side.toLowerCase()}.`};
    },
    drcrEntry(){
      const amt = R(5, 90) * 100, T = [
        [`The business borrows ${$(amt)} from the bank.`, 'Dr Bank, Cr Bank loan', ['Dr Bank loan, Cr Bank', 'Dr Bank, Cr Revenue', 'Dr Interest expense, Cr Bank'], 'Bank (asset) up: debit. Loan (liability) up: credit.'],
        [`The business pays ${$(amt)} of rent from its bank account (ignore GST).`, 'Dr Rent expense, Cr Bank', ['Dr Bank, Cr Rent expense', 'Dr Rent expense, Cr Accounts payable', 'Dr Prepaid rent, Cr Revenue'], 'Expense up: debit. Bank (asset) down: credit.'],
        [`A customer pays ${$(amt)} they owed on an earlier invoice.`, 'Dr Bank, Cr Accounts receivable', ['Dr Bank, Cr Revenue', 'Dr Accounts receivable, Cr Bank', 'Dr Revenue, Cr Accounts receivable'], 'One asset (receivable) turns into another (cash). Revenue was recorded when the invoice was raised.'],
        [`The business pays a supplier ${$(amt)} for a bill already entered.`, 'Dr Accounts payable, Cr Bank', ['Dr Supplies expense, Cr Bank', 'Dr Bank, Cr Accounts payable', 'Dr Accounts payable, Cr Revenue'], 'The liability falls (debit) and cash falls (credit). The expense was recorded with the bill.'],
        [`The company pays a ${$(amt)} dividend to shareholders.`, 'Dr Dividends (or Retained earnings), Cr Bank', ['Dr Dividend expense in the P&L, Cr Bank', 'Dr Bank, Cr Dividends', 'Dr Share capital, Cr Revenue'], 'A dividend is a distribution of profit, not an expense: it reduces equity (debit) and cash (credit).'],
        [`The owner of a sole trader business transfers ${$(amt)} of personal savings into the business account.`, 'Dr Bank, Cr Owner\'s capital', ['Dr Bank, Cr Revenue', 'Dr Owner\'s capital, Cr Bank', 'Dr Bank, Cr Bank loan'], 'Cash up (debit); the owner\'s equity up (credit). Money from the owner is not income.']];
      const [q, ans, wr, e] = pick(T), o = [ans, ...wr], order = [0, 1, 2, 3].sort(() => Math.random() - .5);
      return {q: q + ' Which entry records it?', o: order.map(i => o[i]), a: order.indexOf(0), e};
    },
    gstEntry(){
      const ex = R(4, 400) * 50, inc = ex * 1.1, g = ex / 10, sale = R(0, 1);
      return mc(`A GST-registered business ${sale ? 'invoices a customer' : 'buys supplies for'} ${$(inc)} including GST. What amount goes to ${sale ? 'revenue' : 'the supplies expense account'}?`,
        ex, [inc, inc * .9, g, inc - g * 2], $,
        `${$(inc)} ÷ 1.1 = ${$(ex)}. The GST of ${$(g)} (one-eleventh) goes to ${sale ? 'GST payable, a liability to the ATO' : 'GST receivable, an input tax credit'}.`);
    },
    gstBas(){
      const sales = R(20, 200) * 1100, buys = R(5, Math.floor(sales / 1100 * .9)) * 1100, gp = sales / 11, gr = buys / 11, net = gp - gr;
      return mc(`In a quarter, a business makes sales of ${$(sales)} and purchases of ${$(buys)}, all including GST. How much GST does it pay the ATO on its BAS?`,
        net, [gp, (sales - buys) / 10, gp + gr, net * 1.1], $,
        `GST on sales ${$(sales)} ÷ 11 = ${$(gp)}. GST credits ${$(buys)} ÷ 11 = ${$(gr)}. Net payable ${$(net)}. Dividing by 10 instead of 11 overstates GST.`);
    },
    tBalance(){
      const dr = Array.from({length: 3}, () => R(2, 60) * 100), cr = Array.from({length: 3}, () => R(2, 40) * 100), td = dr.reduce((a, b) => a + b), tc = cr.reduce((a, b) => a + b), bal = td - tc;
      if (bal === 0) return G.tBalance();
      return mc(`The Bank account has debits of ${dr.map(x => $(x)).join(', ')} and credits of ${cr.map(x => $(x)).join(', ')}. What is its balance?`,
        Math.abs(bal), [td, tc, td + tc, Math.abs(bal) / 2], x => $(x) + (x === Math.abs(bal) ? (bal > 0 ? ' debit' : ' credit') : (bal > 0 ? ' credit' : ' debit')),
        `Debits ${$(td)} − credits ${$(tc)} = ${$(Math.abs(bal))} ${bal > 0 ? 'debit: money in the bank' : 'credit: an overdraft'}.`);
    },
    tbMissing(){
      const bank = R(10, 90) * 100, rec = R(10, 60) * 100, eq = R(5, 30) * 100, exp = R(10, 50) * 100, loan = R(5, 40) * 100, rev = bank + rec + eq + exp - loan - R(5, 30) * 100, cap = bank + rec + exp - loan - rev;
      if (cap <= 0 || rev <= 0) return G.tbMissing();
      return mc(`A trial balance shows debits: Bank ${$(bank)}, Receivables ${$(rec)}, Expenses ${$(exp)}; credits: Loan ${$(loan)}, Revenue ${$(rev)}, and Share capital (amount missing). If it balances, what is share capital?`,
        cap, [bank + rec + exp, loan + rev, cap + 2 * loan, bank + rec - loan], $,
        `Debits total ${$(bank + rec + exp)}. Credits other than capital ${$(loan + rev)}. Capital = ${$(bank + rec + exp)} − ${$(loan + rev)} = ${$(cap)}.`);
    },
    transposition(){
      const a = R(1, 9), b = R(1, 9), c = R(0, 9);
      if (a === b) return G.transposition();
      const right = a * 100 + b * 10 + c, wrong = b * 100 + a * 10 + c, d = Math.abs(right - wrong);
      return mc(`An invoice for ${$(right)} is posted to the debit side as ${$(wrong)} but correctly as ${$(right)} on the credit side. By how much will the trial balance totals differ?`,
        d, [right + wrong, d / 9, d * 2, Math.abs(right - wrong) + 9], $,
        `|${right} − ${wrong}| = ${d} = 9 × ${d / 9}. Swapped digits always give a difference divisible by 9: a quick clue when hunting for errors.`);
    },
    prepaidExpense(){
      const months = pick([6, 12, 24]), per = R(1, 20) * 100, total = per * months, used = R(1, Math.min(months - 1, 11)), exp = per * used, left = total - exp, mode = R(0, 1);
      if (mode) return mc(`A business pays ${$(total)} in advance for ${months} months of insurance. At year end, ${used} month${used > 1 ? 's have' : ' has'} been used. What is the prepaid insurance asset?`,
        left, [total, exp, total / 12, left - per], $, `${$(total)} ÷ ${months} = ${$(per)} a month. Used ${used}: ${$(exp)} expense. Remaining ${months - used} months: ${$(left)} prepaid.`);
      return mc(`A business pays ${$(total)} in advance for ${months} months of software. At year end, ${used} month${used > 1 ? 's have' : ' has'} been used. How much is an expense this year?`,
        exp, [total, left, per, exp + per], $, `${$(total)} ÷ ${months} = ${$(per)} a month × ${used} = ${$(exp)} expense; ${$(left)} stays as a prepaid asset.`);
    },
    accruedInterest(){
      const loan = R(5, 100) * 10000, r = pick([5, 6, 6.5, 7, 7.5, 8, 9]), m = R(1, 6), i = loan * r / 100 * m / 12;
      return mc(`A business has a ${$(loan)} loan at ${r}% a year. Interest for the last ${m} month${m > 1 ? 's' : ''} has not yet been paid. What interest must be accrued at year end?`,
        i, [loan * r / 100, loan * r / 100 / 12, i * 1.1, loan * r / 100 * m], x => $(x, x % 1 ? 2 : 0),
        `${$(loan)} × ${r}% × ${m}/12 = ${$(i, i % 1 ? 2 : 0)}. Dr Interest expense, Cr Interest payable.`);
    },
    unearnedRev(){
      const months = 12, fee = R(6, 60) * 120, start = R(1, 11), earned = (13 - start - 0) <= 0 ? 1 : R(1, 11), per = fee / months, ue = fee - per * earned;
      return mc(`A customer pays ${$(fee)} in advance for 12 months of service. By year end, ${earned} month${earned > 1 ? 's' : ''} of service ${earned > 1 ? 'have' : 'has'} been provided. What is the unearned revenue (liability) at year end?`,
        ue, [fee, per * earned, per, ue + per], $,
        `${$(fee)} ÷ 12 = ${$(per)} a month. Earned ${earned} months: ${$(per * earned)} revenue. Still owed: ${$(ue)}, a liability.`);
    },
    depMonthly(){
      const cost = R(12, 120) * 1000, life = pick([3, 4, 5, 8, 10]), res = R(0, 3) * cost / 10, m = (cost - res) / life / 12;
      return mc(`Equipment costs ${$(cost)}, has a residual value of ${$(res)} and a ${life}-year life. What is the monthly straight-line depreciation entry?`,
        m, [cost / life / 12, (cost - res) / life, m * 1.1, cost / 12 / 10], x => $(x, x % 1 ? 2 : 0),
        `(${$(cost)} − ${$(res)}) ÷ ${life} = ${$((cost - res) / life)} a year ÷ 12 = ${$(m, m % 1 ? 2 : 0)}. Dr Depreciation expense, Cr Accumulated depreciation.`);
    },
    retainedEarnings(){
      const open = R(10, 200) * 1000, profit = R(-20, 120) * 1000, div = profit > 0 ? R(0, Math.floor(profit / 2000)) * 1000 : 0, close = open + profit - div;
      if (profit === 0) return G.retainedEarnings();
      return mc(`Opening retained earnings are ${$(open)}. The company makes a ${profit < 0 ? 'loss' : 'profit'} of ${$(Math.abs(profit))}${div ? ` and pays dividends of ${$(div)}` : ' and pays no dividend'}. What are closing retained earnings?`,
        close, [open + Math.abs(profit) + div, open - div, open + profit + div, open - profit], $,
        `${$(open)} ${profit < 0 ? '−' : '+'} ${$(Math.abs(profit))}${div ? ` − ${$(div)}` : ''} = ${$(close)}. Profit closes into retained earnings; dividends come out of it.`);
    },
    closingProfit(){
      const rev = R(50, 400) * 1000, e = Array.from({length: 4}, () => R(5, Math.floor(rev / 5000)) * 1000), te = e.reduce((a, b) => a + b), p = rev - te;
      return mc(`Before closing, a company's revenue is ${$(rev)} and its expenses are ${e.map(x => $(x)).join(', ')}. In the closing entry, what amount is ${p >= 0 ? 'credited' : 'debited'} to retained earnings?`,
        Math.abs(p), [rev, te, rev + te, Math.abs(p) / 2], $,
        `Profit = ${$(rev)} − ${$(te)} = ${p < 0 ? '−' : ''}${$(Math.abs(p))}. The closing entry debits revenue, credits each expense, and ${p >= 0 ? 'credits' : 'debits'} retained earnings with the difference.`);
    },
    bankRec(){
      const book = R(50, 400) * 100, fee = R(1, 9) * 5, intr = R(0, 1) ? R(1, 40) : 0, dit = R(2, 30) * 100, unc = R(1, 20) * 50, right = book - fee + intr, stmt = right - dit + unc;
      return mc(`The cash book shows ${$(book)}. Not yet in the books: a bank fee of ${$(fee)}${intr ? ` and interest earned of ${$(intr)}` : ''}. Not yet on the statement: a deposit of ${$(dit)} and a payment of ${$(unc)}. What is the correct cash balance?`,
        right, [book, stmt, book - fee - intr, right + dit - unc], $,
        `Correct the books: ${$(book)} − ${$(fee)}${intr ? ` + ${$(intr)}` : ''} = ${$(right)}. Check: statement ${$(stmt)} + ${$(dit)} − ${$(unc)} = ${$(right)}. Both agree.`);
    },
    // ---- Week 6: the income statement ----
    subscriptionRev(){
      const months = pick([6, 12, 24]), per = R(2, 60) * 5, fee = per * months, used = R(1, Math.min(months - 1, 11)), rev = per * used;
      return mc(`A customer pays ${$(fee)} up front for a ${months}-month subscription. By year end, ${used} month${used > 1 ? 's have' : ' has'} been delivered. How much revenue is recognised this year?`,
        rev, [fee, fee - rev, per, rev + per], $,
        `Revenue follows delivery: ${$(fee)} ÷ ${months} = ${$(per)} a month × ${used} = ${$(rev)}. The remaining ${$(fee - rev)} is a contract liability.`);
    },
    revAllocate(){
      const a = R(5, 60) * 100, b = R(1, 20) * 100, disc = pick([5, 10, 15, 20]), price = (a + b) * (1 - disc / 100), alloc = price * a / (a + b);
      return mc(`A product (stand-alone price ${$(a)}) and a support plan (stand-alone price ${$(b)}) are sold together for ${$(price)}. How much of the price is allocated to the product?`,
        alloc, [a, price - b, price / 2, price * b / (a + b)], $,
        `${$(price)} × ${$(a)} ÷ ${$(a + b)} = ${$(alloc)}. The ${disc}% bundle discount is shared in proportion to stand-alone prices.`);
    },
    cogsFormula(){
      const open = R(20, 300) * 1000, buy = R(200, 3000) * 1000, close = R(20, 300) * 1000, c = open + buy - close;
      if (c <= 0) return G.cogsFormula();
      return mc(`Opening inventory is ${$(open)}, purchases are ${$(buy)} and closing inventory is ${$(close)}. What is cost of sales?`,
        c, [buy, open + buy + close, buy - open + close, c + close], $,
        `${$(open)} + ${$(buy)} − ${$(close)} = ${$(c)}. What is not left on the shelf was sold (or used).`);
    },
    grossMarginCalc(){
      const rev = R(200, 5000) * 1000, gm = pick([22, 28, 35, 40, 45, 55, 62, 70]), cos = rev * (1 - gm / 100), gp = rev - cos, mode = R(0, 1);
      if (mode) return mc(`Revenue is ${$(rev)} and cost of sales is ${$(cos)}. What is the gross margin?`,
        gm, [100 - gm, gp / cos * 100, gm / 2, gm + 10], x => pct(x, 1),
        `Gross profit ${$(gp)} ÷ revenue ${$(rev)} = ${pct(gm, 1)}. (Dividing by cost of sales, ${pct(gp / cos * 100, 1)}, gives the markup, not the margin.)`);
      return mc(`A business has revenue of ${$(rev)} and a gross margin of ${gm}%. What is its gross profit?`,
        gp, [cos, rev * gm / (100 + gm), rev, gp * 1.1], $,
        `${$(rev)} × ${gm}% = ${$(gp)}. Cost of sales is the other ${100 - gm}%: ${$(cos)}.`);
    },
    fifoWavg(){
      const q1 = R(5, 20) * 100, p1 = R(10, 40), q2 = R(5, 20) * 100, p2 = p1 + R(1, 8), sold = R(Math.ceil(q1 / 100) + 1, Math.floor((q1 + q2) / 100) - 1) * 100;
      if (sold <= q1 || sold >= q1 + q2) return G.fifoWavg();
      const fifo = q1 * p1 + (sold - q1) * p2, avg = (q1 * p1 + q2 * p2) / (q1 + q2), wa = sold * avg, mode = R(0, 1);
      if (mode) return mc(`A business buys ${num(q1)} units at ${$(p1)} and then ${num(q2)} units at ${$(p2)}. It sells ${num(sold)} units. What is cost of sales under FIFO?`,
        fifo, [wa, sold * p2, sold * p1, (q1 * p2) + (sold - q1) * p1], $,
        `FIFO: first ${num(q1)} at ${$(p1)} = ${$(q1 * p1)}, then ${num(sold - q1)} at ${$(p2)} = ${$((sold - q1) * p2)}. Total ${$(fifo)}.`);
      return mc(`A business buys ${num(q1)} units at ${$(p1)} and then ${num(q2)} units at ${$(p2)}. It sells ${num(sold)} units. What is cost of sales using weighted average cost?`,
        wa, [fifo, sold * p2, sold * (p1 + p2) / 2 === wa ? sold * p1 : sold * (p1 + p2) / 2, (q1 + q2 - sold) * avg], x => $(x, x % 1 ? 2 : 0),
        `Average cost = (${$(q1 * p1)} + ${$(q2 * p2)}) ÷ ${num(q1 + q2)} = ${$(avg, 2)}. × ${num(sold)} = ${$(wa, wa % 1 ? 2 : 0)}.`);
    },
    ebitdaCalc(){
      const rev = R(500, 5000) * 1000, gm = pick([35, 40, 45, 50, 60]), gp = rev * gm / 100, opex = Math.round(gp * pick([.55, .65, .7, .75, .8]) / 1000) * 1000, dep = R(10, 150) * 1000, e = gp - opex;
      return mc(`Revenue is ${$(rev)}, gross margin is ${gm}%, operating expenses (excluding depreciation) are ${$(opex)} and depreciation is ${$(dep)}. What is EBITDA?`,
        e, [e - dep, rev - opex, gp, e + dep], $,
        `Gross profit ${$(gp)} − operating expenses ${$(opex)} = ${$(e)}. Depreciation (${$(dep)}) comes after EBITDA: EBIT would be ${$(e - dep)}.`);
    },
    operatingLeverage(){
      const rev = R(10, 50) * 100000, gm = pick([40, 50, 60]), fixed = Math.round(rev * gm / 100 * pick([.6, .7, .8]) / 1000) * 1000, e0 = rev * gm / 100 - fixed, ch = pick([-20, -10, 10, 20]), e1 = rev * (1 + ch / 100) * gm / 100 - fixed, pc = (e1 - e0) / e0 * 100;
      return mc(`Revenue is ${$(rev)}, the gross margin is ${gm}% (cost of sales is fully variable) and operating expenses are a fixed ${$(fixed)}. If revenue ${ch > 0 ? 'rises' : 'falls'} ${Math.abs(ch)}%, by what percentage does EBITDA change?`,
        pc, [ch, ch * 2 === pc ? ch * 3 : ch * 2, pc / 2, -pc], x => (x < 0 ? '−' : '+') + pct(Math.abs(x), 1),
        `EBITDA ${$(e0)} → ${$(e1)}: ${(pc < 0 ? '−' : '+') + pct(Math.abs(pc), 1)}. Fixed costs make earnings move faster than sales: operating leverage.`);
    },
    dvDep(){
      const cost = R(10, 200) * 1000, life = pick([4, 5, 8, 10]), r = 2 / life, y = R(1, 3), open = cost * (1 - r) ** (y - 1), dep = open * r;
      return mc(`An asset costs ${$(cost)} and has an effective life of ${life} years. Using the diminishing value method (rate = 200% ÷ effective life), what is the depreciation in year ${y}?`,
        dep, [(cost) / life, cost * r, dep * (1 - r), cost * r * y], x => $(x, x % 1 ? 2 : 0),
        `Rate = 200% ÷ ${life} = ${pct(r * 100, 1)}. Opening value in year ${y}: ${$(open, open % 1 ? 2 : 0)}. × ${pct(r * 100, 1)} = ${$(dep, dep % 1 ? 2 : 0)}. Straight line would be ${$(cost / life)} every year.`);
    },
    interestCover(){
      const ebit = R(50, 2000) * 1000, cov = pick([1.5, 2, 2.5, 3, 4, 5, 6, 8]), int = ebit / cov;
      return mc(`EBIT is ${$(ebit)} and interest expense is ${$(int)}. What is interest cover?`,
        cov, [1 / cov, cov * .75, cov + 1, ebit / (ebit + int)], x => (Math.round(x * 100) / 100) + '×',
        `${$(ebit)} ÷ ${$(int)} = ${cov}×. Lenders often require a minimum, such as 2 or 3 times, as a covenant.`);
    },
    npatCalc(){
      const ebit = R(100, 3000) * 1000, int = Math.round(ebit * pick([.1, .15, .2, .3]) / 1000) * 1000, t = pick([25, 30]), pbt = ebit - int, np = pbt * (1 - t / 100);
      return mc(`A company has EBIT of ${$(ebit)}, interest expense of ${$(int)} and pays company tax at ${t}%. What is net profit after tax?`,
        np, [ebit * (1 - t / 100), pbt, ebit * (1 - t / 100) - int, np * 1.1], $,
        `Profit before tax ${$(ebit)} − ${$(int)} = ${$(pbt)}. Tax ${t}% = ${$(pbt * t / 100)}. Net profit ${$(np)}. Interest is deducted before tax.`);
    },
    epsCalc(){
      const sh = R(1, 500) * 100000, eps = R(5, 300) / 100, np = sh * eps;
      return mc(`Net profit after tax is ${$(np)} and there are ${num(sh)} ordinary shares on issue. What is earnings per share?`,
        eps, [sh / np, eps * 10, eps / 2, eps * 1.3], x => $(x, 2),
        `${$(np)} ÷ ${num(sh)} = ${$(eps, 2)} per share.`);
    }
  };
  window.PRACTICE = G;
})();
