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
    for (const w of wrongs) { const f = fmt(w); if (!seen.has(f) && isFinite(w) && w > 0) { seen.add(f); opts.push(f); } if (opts.length === 4) break; }
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
        `Equity starts at ${$(eq)}. The property moves to ${$(nv)}, the loan stays at ${$(loan)}, so equity becomes ${$(ne)}: a ${pct(eqch, 0)} change. With a ${pct(dep * 100, 0)} deposit, each 1% move in value moves equity by ${num(1 / dep)}%.`);
    },
    depreciation(){
      const cost = R(20, 300, 5) * 1000, res = R(0, 4) * cost / 20, life = R(3, 10), dep = (cost - res) / life, mode = R(0, 1);
      if (mode) { const y = R(1, life - 1), bv = cost - dep * y;
        return mc(`Equipment costs ${$(cost)}, has a residual value of ${$(res)} and a ${life}-year life (straight-line). What is its book value after ${y} year${y > 1 ? 's' : ''}?`,
          bv, [cost - cost / life * y, cost - dep, res + dep * y, dep * y], $, `Annual depreciation = (${$(cost)} − ${$(res)}) ÷ ${life} = ${$(dep)}. After ${y} years: ${$(cost)} − ${$(dep * y)} = ${$(bv)}.`); }
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
      const now = R(100, 900, 10) * 1000, n = R(2, 6), r = R(4, 12), later = Math.round(now * (1 + (r + R(-3, 3)) / 100) ** n / 1000) * 1000, pvl = later / (1 + r / 100) ** n;
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
      const rf = pick([3.5, 4, 4.25, 4.5]), prem = pick([3, 5, 6, 8, 10, 12, 14]), req = rf + prem;
      return mc(`Government bonds yield ${rf}%. You judge an investment needs a ${prem}% risk premium. What is your required return?`,
        req, [prem, rf * prem / 2, req * 1.5, prem - rf], x => pct(x, 2), `Required return = risk-free rate + risk premium = ${rf}% + ${prem}% = ${pct(req, 2)}.`);
    },
    impliedReturn(){
      const inv = R(10, 200, 5) * 1000, n = R(2, 5), r = R(5, 20), back = Math.round(inv * (1 + r / 100) ** n / 1000) * 1000, irr = ((back / inv) ** (1 / n) - 1) * 100;
      return mc(`You are asked to invest ${$(inv)} now and will receive ${$(back)} in ${n} years, with nothing in between. What annual compound return is that?`,
        irr, [(back / inv - 1) / n * 100, (back / inv - 1) * 100, irr * 1.4, irr * .7], x => pct(x),
        `(${$(back)} ÷ ${$(inv)})^(1/${n}) − 1 = ${pct(irr)} a year. Dividing the total gain by ${n} (${pct((back / inv - 1) / n * 100)}) overstates it because it ignores compounding.`);
    }
  };
  window.PRACTICE = G;
})();
