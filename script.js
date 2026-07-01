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

const lessonToc = document.querySelector(".lesson-toc");

if (lessonToc) {
  const tocLinks = [...lessonToc.querySelectorAll("a[href^='#']")];
  const tocSections = tocLinks
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  const setActiveTocLink = () => {
    let current = tocSections[0];
    tocSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 150) {
        current = section;
      }
    });

    tocLinks.forEach((link) => {
      link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
    });
  };

  setActiveTocLink();
  window.addEventListener("scroll", setActiveTocLink, { passive: true });
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

const toolForms = document.querySelectorAll("[data-tool-form]");

const numberFrom = (form, name) => formNumber(form, name);
const textFrom = (form, name) => {
  const input = form.elements[name];
  return input ? String(input.value || "") : "";
};
const checkedFrom = (form, name) => {
  const input = form.elements[name];
  return input ? Boolean(input.checked) : false;
};
const precise = (value, digits = 2) => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
};
const plainNumber = (value) => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
};
const setOutput = (name, value) => setText(document, name, value);
const setPre = (name, value) => {
  const target = document.querySelector(`[data-output="${name}"]`);
  if (target) target.textContent = value;
};
const b64Encode = (value) => btoa(unescape(encodeURIComponent(value)));
const b64Decode = (value) => decodeURIComponent(escape(atob(value)));

const financeToolHandlers = {
  "loan-calculator": (form) => {
    const amount = numberFrom(form, "loanAmount");
    const term = numberFrom(form, "loanTerm") * 12;
    const rate = numberFrom(form, "interestRate");
    const monthly = payment(amount, rate, term);
    const total = monthly * term;
    setOutput("monthlyPayment", money.format(monthly));
    setOutput("totalInterest", money.format(Math.max(0, total - amount)));
    setOutput("totalPayment", money.format(total));
  },
  "savings-calculator": (form) => {
    const initial = numberFrom(form, "initialDeposit");
    const monthly = numberFrom(form, "monthlyContribution");
    const years = numberFrom(form, "years");
    const monthlyRate = numberFrom(form, "annualReturn") / 100 / 12;
    const months = years * 12;
    let balance = initial;
    for (let index = 0; index < months; index += 1) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
    const contributions = initial + monthly * months;
    setOutput("futureValue", money.format(balance));
    setOutput("contributions", money.format(contributions));
    setOutput("interestEarned", money.format(Math.max(0, balance - contributions)));
  },
};

const developerToolHandlers = {
  "json-formatter": (form) => {
    const value = textFrom(form, "jsonInput");
    try {
      const parsed = JSON.parse(value);
      setPre("primary", JSON.stringify(parsed, null, 2));
      setOutput("status", "Valid JSON");
      setOutput("detail", `${Object.keys(parsed && typeof parsed === "object" ? parsed : {}).length} top-level keys`);
    } catch (error) {
      setPre("primary", error.message);
      setOutput("status", "Invalid JSON");
      setOutput("detail", "Fix the syntax and try again");
    }
  },
  "base64-encoder": (form) => {
    const mode = textFrom(form, "mode");
    const value = textFrom(form, "inputText");
    try {
      setPre("primary", mode === "decode" ? b64Decode(value.trim()) : b64Encode(value));
      setOutput("status", mode === "decode" ? "Decoded text" : "Encoded Base64");
      setOutput("detail", `${value.length} input characters`);
    } catch (error) {
      setPre("primary", "Unable to decode this Base64 value.");
      setOutput("status", "Invalid input");
      setOutput("detail", "Check padding and characters");
    }
  },
  "uuid-generator": (form) => {
    const count = Math.min(20, Math.max(1, numberFrom(form, "count") || 1));
    const values = Array.from({ length: count }, () => crypto.randomUUID());
    setPre("primary", values.join("\n"));
    setOutput("status", `${count} UUID${count === 1 ? "" : "s"} generated`);
    setOutput("detail", "Version 4 random identifiers");
  },
  "timestamp-converter": (form) => {
    const raw = textFrom(form, "timestamp").trim();
    const stamp = Number(raw.length === 10 ? `${raw}000` : raw);
    const date = Number.isFinite(stamp) ? new Date(stamp) : new Date();
    setOutput("localTime", date.toLocaleString());
    setOutput("utcTime", date.toISOString());
    setOutput("unixSeconds", Math.floor(date.getTime() / 1000).toString());
    setPre("primary", `ISO: ${date.toISOString()}\nMilliseconds: ${date.getTime()}\nSeconds: ${Math.floor(date.getTime() / 1000)}`);
  },
  "regex-tester": (form) => {
    const pattern = textFrom(form, "pattern");
    const flags = textFrom(form, "flags");
    const sample = textFrom(form, "sampleText");
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...sample.matchAll(regex.global ? regex : new RegExp(pattern, `${flags}g`))].map((match) => match[0]);
      setOutput("status", `${matches.length} match${matches.length === 1 ? "" : "es"}`);
      setOutput("detail", pattern || "No pattern");
      setPre("primary", matches.length ? matches.join("\n") : "No matches found.");
    } catch (error) {
      setOutput("status", "Invalid regex");
      setOutput("detail", error.message);
      setPre("primary", "Fix the pattern and try again.");
    }
  },
};

const textToolHandlers = {
  "word-counter": (form) => {
    const value = textFrom(form, "text");
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const sentences = value.trim() ? value.split(/[.!?]+/).filter((part) => part.trim()).length : 0;
    setOutput("words", plainNumber(words));
    setOutput("characters", plainNumber(value.length));
    setOutput("readingTime", `${Math.max(1, Math.ceil(words / 225))} min`);
    setPre("primary", `Sentences: ${sentences}\nCharacters without spaces: ${value.replace(/\s/g, "").length}`);
  },
  "character-counter": (form) => {
    const value = textFrom(form, "text");
    setOutput("characters", plainNumber(value.length));
    setOutput("withoutSpaces", plainNumber(value.replace(/\s/g, "").length));
    setOutput("lines", plainNumber(value ? value.split(/\r\n|\r|\n/).length : 0));
    setPre("primary", `Words: ${value.trim() ? value.trim().split(/\s+/).length : 0}\nParagraphs: ${value.trim() ? value.split(/\n\s*\n/).filter(Boolean).length : 0}`);
  },
  "password-generator": (form) => {
    const length = Math.min(64, Math.max(8, numberFrom(form, "passwordLength") || 16));
    const pools = [
      checkedFrom(form, "lowercase") ? "abcdefghijklmnopqrstuvwxyz" : "",
      checkedFrom(form, "uppercase") ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
      checkedFrom(form, "numbers") ? "0123456789" : "",
      checkedFrom(form, "symbols") ? "!@#$%^&*()-_=+[]{};:,.?/" : "",
    ].filter(Boolean);
    const characters = pools.join("") || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    const password = [...bytes].map((value) => characters[value % characters.length]).join("");
    setPre("primary", password);
    setOutput("status", `${length} characters`);
    setOutput("detail", `${pools.length || 3} character groups used`);
  },
};

const educationToolHandlers = {
  "gpa-calculator": (form) => {
    const rows = [...form.querySelectorAll("[data-course-row]")];
    const points = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    let credits = 0;
    let weighted = 0;
    rows.forEach((row) => {
      const credit = Number(row.querySelector("[name='credits[]']")?.value) || 0;
      const grade = row.querySelector("[name='grade[]']")?.value || "A";
      credits += credit;
      weighted += credit * points[grade];
    });
    setOutput("gpa", precise(credits ? weighted / credits : 0, 2));
    setOutput("credits", plainNumber(credits));
    setOutput("qualityPoints", precise(weighted, 1));
  },
  "study-time-calculator": (form) => {
    const courses = numberFrom(form, "courses");
    const hours = numberFrom(form, "classHours");
    const ratio = numberFrom(form, "studyRatio");
    const weekly = courses * hours * ratio;
    setOutput("weeklyStudy", `${precise(weekly, 1)} hrs`);
    setOutput("dailyStudy", `${precise(weekly / 7, 1)} hrs`);
    setOutput("monthlyStudy", `${precise(weekly * 4.33, 1)} hrs`);
  },
};

const healthToolHandlers = {
  "bmi-calculator": (form) => {
    const heightInches = numberFrom(form, "feet") * 12 + numberFrom(form, "inches");
    const weight = numberFrom(form, "weight");
    const bmi = heightInches > 0 ? (weight / (heightInches * heightInches)) * 703 : 0;
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight" : "Obesity range";
    setOutput("bmi", precise(bmi, 1));
    setOutput("category", category);
    setOutput("height", `${heightInches} in`);
  },
  "age-calculator": (form) => {
    const birth = new Date(textFrom(form, "birthDate"));
    const today = new Date(textFrom(form, "targetDate") || new Date());
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const days = Math.max(0, Math.floor((today - birth) / 86400000));
    setOutput("age", `${Math.max(0, years)} years ${months} months`);
    setOutput("days", plainNumber(days));
    setOutput("weeks", plainNumber(Math.floor(days / 7)));
  },
  "date-calculator": (form) => {
    const start = new Date(textFrom(form, "startDate"));
    const amount = numberFrom(form, "amount");
    const unit = textFrom(form, "unit");
    const result = new Date(start);
    if (unit === "days") result.setDate(result.getDate() + amount);
    if (unit === "weeks") result.setDate(result.getDate() + amount * 7);
    if (unit === "months") result.setMonth(result.getMonth() + amount);
    setOutput("resultDate", result.toLocaleDateString());
    setOutput("isoDate", result.toISOString().slice(0, 10));
    setOutput("weekday", result.toLocaleDateString(undefined, { weekday: "long" }));
  },
};

const drawSimpleQr = (text) => {
  const canvas = document.querySelector("[data-qr-canvas]");
  const message = document.querySelector("[data-qr-message]");
  if (!canvas) return;
  const encoder = new TextEncoder();
  const bytes = [...encoder.encode(text)].slice(0, 32);
  setOutput("status", "Generated");
  if (message) message.textContent = bytes.length < encoder.encode(text).length ? "QR text is limited to the first 32 bytes in this static generator." : "QR code generated in your browser.";
  const size = 25;
  const scale = 10;
  const ctx = canvas.getContext("2d");
  canvas.width = size * scale;
  canvas.height = size * scale;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const mark = (r, c, dark, lock = true) => {
    if (r < 0 || c < 0 || r >= size || c >= size) return;
    matrix[r][c] = dark;
    if (lock) reserved[r][c] = true;
  };
  const finder = (r, c) => {
    for (let y = -1; y <= 7; y += 1) {
      for (let x = -1; x <= 7; x += 1) {
        const rr = r + y;
        const cc = c + x;
        const dark = y >= 0 && y <= 6 && x >= 0 && x <= 6 && (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4));
        mark(rr, cc, dark);
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  for (let i = 8; i < size - 8; i += 1) {
    mark(6, i, i % 2 === 0);
    mark(i, 6, i % 2 === 0);
  }
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      mark(18 + y, 18 + x, Math.max(Math.abs(x), Math.abs(y)) !== 1);
    }
  }
  mark(size - 8, 8, true);

  const gfMul = (x, y) => {
    let z = 0;
    for (let i = 7; i >= 0; i -= 1) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xff;
  };

  const reedSolomonDivisor = (degree) => {
    const result = Array(degree).fill(0);
    result[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i += 1) {
      for (let j = 0; j < degree; j += 1) {
        result[j] = gfMul(result[j], root);
        if (j + 1 < degree) result[j] ^= result[j + 1];
      }
      root = gfMul(root, 0x02);
    }
    return result;
  };

  const reedSolomonRemainder = (data, divisor) => {
    const result = Array(divisor.length).fill(0);
    data.forEach((value) => {
      const factor = value ^ result.shift();
      result.push(0);
      divisor.forEach((coef, index) => {
        result[index] ^= gfMul(coef, factor);
      });
    });
    return result;
  };

  const appendBits = (bits, value, length) => {
    for (let i = length - 1; i >= 0; i -= 1) bits.push(((value >>> i) & 1) !== 0);
  };

  const bits = [];
  appendBits(bits, 0x4, 4);
  appendBits(bits, bytes.length, 8);
  bytes.forEach((value) => appendBits(bits, value, 8));
  const dataCapacityBits = 34 * 8;
  appendBits(bits, 0, Math.min(4, dataCapacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(false);

  const dataCodewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    dataCodewords.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | (bit ? 1 : 0), 0));
  }
  for (let pad = 0xec; dataCodewords.length < 34; pad ^= 0xec ^ 0x11) {
    dataCodewords.push(pad);
  }

  const codewords = dataCodewords.concat(reedSolomonRemainder(dataCodewords, reedSolomonDivisor(10)));
  const dataBits = [];
  codewords.forEach((value) => appendBits(dataBits, value, 8));
  let bitIndex = 0;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert += 1) {
      const upward = ((size - 1 - right) / 2) % 2 === 0;
      const r = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j += 1) {
        const c = right - j;
        if (reserved[r][c]) continue;
        const bit = bitIndex < dataBits.length ? dataBits[bitIndex] : false;
        matrix[r][c] = bit !== ((r + c) % 2 === 0);
        bitIndex += 1;
      }
    }
  }

  const formatBits = (() => {
    let data = (1 << 3) | 0;
    let rem = data;
    for (let i = 0; i < 10; i += 1) rem = (rem << 1) ^ (((rem >>> 9) & 1) * 0x537);
    return ((data << 10) | rem) ^ 0x5412;
  })();

  const formatBit = (i) => ((formatBits >>> i) & 1) !== 0;
  for (let i = 0; i <= 5; i += 1) mark(8, i, formatBit(i));
  mark(8, 7, formatBit(6));
  mark(8, 8, formatBit(7));
  mark(7, 8, formatBit(8));
  for (let i = 9; i < 15; i += 1) mark(14 - i, 8, formatBit(i));
  for (let i = 0; i < 8; i += 1) mark(size - 1 - i, 8, formatBit(i));
  for (let i = 8; i < 15; i += 1) mark(8, size - 15 + i, formatBit(i));
  mark(size - 8, 8, true);

  const quiet = 4;
  canvas.width = (size + quiet * 2) * scale;
  canvas.height = (size + quiet * 2) * scale;
  ctx.fillStyle = "#eeeeee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#131922";
  matrix.forEach((row, r) => {
    row.forEach((dark, c) => {
      if (dark) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
    });
  });
};

toolForms.forEach((form) => {
  const tool = form.dataset.toolForm;
  const handlers = {
    ...financeToolHandlers,
    ...developerToolHandlers,
    ...textToolHandlers,
    ...educationToolHandlers,
    ...healthToolHandlers,
  };
  const run = () => {
    if (tool === "qr-code-generator") {
      drawSimpleQr(textFrom(form, "qrText"));
      return;
    }
    handlers[tool]?.(form);
  };
  form.addEventListener("input", run);
  form.addEventListener("change", run);
  run();
});
