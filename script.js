const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const years = document.querySelectorAll("[data-year]");

years.forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 18);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (nav && navToggle) {
  const setMenu = (isOpen) => {
    nav.classList.toggle("open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  navToggle.addEventListener("click", () => {
    setMenu(!nav.classList.contains("open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setMenu(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });
}

const mortgageForm = document.querySelector("[data-mortgage-calculator]");

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const payment = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 100 / 12;
  if (principal <= 0 || months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
};

const formNumber = (form, name) => {
  const input = form.elements[name];
  return input ? Number(input.value) || 0 : 0;
};

const setText = (scope, name, value) => {
  const target = scope.querySelector(`[data-result="${name}"]`) || document.querySelector(`[data-result="${name}"]`);
  if (target) target.textContent = value;
};

const monthsToText = (months) => {
  if (!Number.isFinite(months) || months <= 0) return "0 months";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} months`;
  if (rest === 0) return `${years} years`;
  return `${years} years ${rest} months`;
};

if (mortgageForm) {
  const readNumber = (name) => {
    const input = mortgageForm.elements[name];
    return input ? Number(input.value) || 0 : 0;
  };

  const writeResult = (name, value) => {
    const target = document.querySelector(`[data-result="${name}"]`);
    if (target) target.textContent = money.format(Math.max(0, value));
  };

  const calculateMortgage = () => {
    const homePrice = readNumber("homePrice");
    const downPayment = readNumber("downPayment");
    const interestRate = readNumber("interestRate") / 100 / 12;
    const months = readNumber("loanTerm") * 12;
    const loanAmount = Math.max(0, homePrice - downPayment);
    const taxes = readNumber("propertyTax") / 12;
    const insurance = readNumber("homeInsurance") / 12;
    const pmi = readNumber("pmi");
    const hoa = readNumber("hoa");

    let principalInterest = 0;
    if (loanAmount > 0 && months > 0) {
      principalInterest =
        interestRate === 0
          ? loanAmount / months
          : (loanAmount * interestRate * (1 + interestRate) ** months) / ((1 + interestRate) ** months - 1);
    }

    const total = principalInterest + taxes + insurance + pmi + hoa;

    writeResult("principalInterest", principalInterest);
    writeResult("taxes", taxes);
    writeResult("insurance", insurance);
    writeResult("pmi", pmi);
    writeResult("hoa", hoa);
    writeResult("total", total);
  };

  mortgageForm.addEventListener("input", calculateMortgage);
  calculateMortgage();
}

const pitiForm = document.querySelector("[data-piti-calculator]");

if (pitiForm) {
  const calculatePiti = () => {
    const homePrice = formNumber(pitiForm, "homePrice");
    const downPayment = formNumber(pitiForm, "downPayment");
    const loanAmount = Math.max(0, homePrice - downPayment);
    const months = formNumber(pitiForm, "loanTerm") * 12;
    const annualRate = formNumber(pitiForm, "interestRate");
    const principalInterest = payment(loanAmount, annualRate, months);
    const monthlyRate = annualRate / 100 / 12;
    const interest = loanAmount * monthlyRate;
    const principal = Math.max(0, principalInterest - interest);
    const taxes = formNumber(pitiForm, "propertyTax") / 12;
    const insurance = formNumber(pitiForm, "homeInsurance") / 12;
    const pmi = formNumber(pitiForm, "pmi");
    const total = principalInterest + taxes + insurance + pmi;

    setText(document, "principal", money.format(principal));
    setText(document, "interest", money.format(interest));
    setText(document, "taxes", money.format(taxes));
    setText(document, "insurance", money.format(insurance));
    setText(document, "pmi", money.format(pmi));
    setText(document, "total", money.format(total));
  };

  pitiForm.addEventListener("input", calculatePiti);
  calculatePiti();
}

const affordabilityForm = document.querySelector("[data-affordability-calculator]");

if (affordabilityForm) {
  const calculateAffordability = () => {
    const income = formNumber(affordabilityForm, "income");
    const debts = formNumber(affordabilityForm, "debts");
    const downPayment = formNumber(affordabilityForm, "downPayment");
    const annualRate = formNumber(affordabilityForm, "interestRate");
    const months = formNumber(affordabilityForm, "loanTerm") * 12;
    const taxes = formNumber(affordabilityForm, "propertyTax") / 12;
    const insurance = formNumber(affordabilityForm, "insurance") / 12;
    const housingBudget = Math.max(0, income * 0.36 - debts);
    const piBudget = Math.max(0, housingBudget - taxes - insurance);
    const monthlyRate = annualRate / 100 / 12;
    let loanAmount = 0;

    if (months > 0) {
      loanAmount =
        monthlyRate === 0
          ? piBudget * months
          : (piBudget * ((1 + monthlyRate) ** months - 1)) / (monthlyRate * (1 + monthlyRate) ** months);
    }

    const homePrice = loanAmount + downPayment;
    const dti = income > 0 ? (housingBudget + debts) / income : 0;

    setText(document, "homePrice", money.format(homePrice));
    setText(document, "budget", money.format(housingBudget));
    setText(document, "dti", percent.format(dti));
    setText(document, "loanAmount", money.format(loanAmount));
  };

  affordabilityForm.addEventListener("input", calculateAffordability);
  calculateAffordability();
}

const refinanceForm = document.querySelector("[data-refinance-calculator]");

if (refinanceForm) {
  const calculateRefinance = () => {
    const balance = formNumber(refinanceForm, "balance");
    const currentPayment = payment(balance, formNumber(refinanceForm, "currentRate"), formNumber(refinanceForm, "remainingTerm") * 12);
    const newPayment = payment(balance, formNumber(refinanceForm, "newRate"), formNumber(refinanceForm, "newTerm") * 12);
    const closingCosts = formNumber(refinanceForm, "closingCosts");
    const savings = currentPayment - newPayment;
    const breakEven = savings > 0 ? Math.ceil(closingCosts / savings) : 0;

    setText(document, "savings", money.format(savings));
    setText(document, "currentPayment", money.format(currentPayment));
    setText(document, "newPayment", money.format(newPayment));
    setText(document, "breakEven", savings > 0 ? `${breakEven} months` : "No savings");
    setText(document, "closingCosts", money.format(closingCosts));
  };

  refinanceForm.addEventListener("input", calculateRefinance);
  calculateRefinance();
}

const extraPaymentForm = document.querySelector("[data-extra-payment-calculator]");

if (extraPaymentForm) {
  const simulatePayoff = (balance, annualRate, monthlyPayment) => {
    const monthlyRate = annualRate / 100 / 12;
    let remaining = balance;
    let interestPaid = 0;
    let months = 0;

    while (remaining > 0.01 && months < 1200) {
      const interest = remaining * monthlyRate;
      const principal = Math.min(remaining, monthlyPayment - interest);
      if (principal <= 0) return { months: 0, interestPaid: 0 };
      remaining -= principal;
      interestPaid += interest;
      months += 1;
    }

    return { months, interestPaid };
  };

  const calculateExtraPayment = () => {
    const loanAmount = formNumber(extraPaymentForm, "loanAmount");
    const annualRate = formNumber(extraPaymentForm, "interestRate");
    const months = formNumber(extraPaymentForm, "loanTerm") * 12;
    const extraPayment = formNumber(extraPaymentForm, "extraPayment");
    const basePayment = payment(loanAmount, annualRate, months);
    const original = simulatePayoff(loanAmount, annualRate, basePayment);
    const accelerated = simulatePayoff(loanAmount, annualRate, basePayment + extraPayment);
    const interestSaved = Math.max(0, original.interestPaid - accelerated.interestPaid);
    const timeSaved = Math.max(0, original.months - accelerated.months);

    setText(document, "interestSaved", money.format(interestSaved));
    setText(document, "originalPayoff", monthsToText(original.months));
    setText(document, "newPayoff", monthsToText(accelerated.months));
    setText(document, "timeSaved", monthsToText(timeSaved));
    setText(document, "monthlyPayment", money.format(basePayment));
  };

  extraPaymentForm.addEventListener("input", calculateExtraPayment);
  calculateExtraPayment();
}

const amortizationForm = document.querySelector("[data-amortization-calculator]");

if (amortizationForm) {
  const calculateAmortization = () => {
    const loanAmount = formNumber(amortizationForm, "loanAmount");
    const annualRate = formNumber(amortizationForm, "interestRate");
    const termYears = formNumber(amortizationForm, "loanTerm");
    const months = termYears * 12;
    const monthlyPayment = payment(loanAmount, annualRate, months);
    const monthlyRate = annualRate / 100 / 12;
    let balance = loanAmount;
    let totalInterest = 0;
    const rows = [];

    for (let year = 1; year <= termYears; year += 1) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= 12 && balance > 0.01; month += 1) {
        const interest = balance * monthlyRate;
        const principal = Math.min(balance, monthlyPayment - interest);
        balance -= principal;
        yearlyPrincipal += principal;
        yearlyInterest += interest;
      }
      totalInterest += yearlyInterest;
      rows.push({ year, yearlyPrincipal, yearlyInterest, balance: Math.max(0, balance) });
    }

    setText(document, "monthlyPayment", money.format(monthlyPayment));
    setText(document, "totalInterest", money.format(totalInterest));
    setText(document, "totalPayment", money.format(loanAmount + totalInterest));
    setText(document, "term", `${termYears} years`);

    const table = document.querySelector("[data-amortization-table]");
    if (table) {
      table.innerHTML = rows
        .map(
          (row) =>
            `<tr><td>${row.year}</td><td>${money.format(row.yearlyPrincipal)}</td><td>${money.format(row.yearlyInterest)}</td><td>${money.format(row.balance)}</td></tr>`,
        )
        .join("");
    }
  };

  amortizationForm.addEventListener("input", calculateAmortization);
  calculateAmortization();
}
