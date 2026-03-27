export const PRICING_SCHEDULE = [
  {
    date: new Date("2026-04-10T00:00:00"),
    label: "Bevezető ár",
    subjects: ["történelem"],
    price: 7970,
    deadlineDate: new Date("2026-04-19T00:00:00"),
    deadlineLabel: "04.19",
    isCombo: false,
  },
  {
    date: new Date("2026-04-19T00:00:00"),
    label: "Kedvezményes ár",
    subjects: ["történelem"],
    price: 8970,
    deadlineDate: new Date("2026-04-26T00:00:00"),
    deadlineLabel: "04.26",
    isCombo: false,
  },
  {
    date: new Date("2026-04-26T00:00:00"),
    label: "Kombo kedvezmény",
    subjects: ["történelem", "magyar"],
    price: 9970,
    comboPrice: 15970,
    deadlineDate: new Date("2026-05-01T20:00:00"),
    deadlineLabel: "05.01",
    isCombo: true,
  },
  {
    date: new Date("2026-05-01T20:00:00"),
    label: "Normál ár",
    subjects: ["történelem", "magyar"],
    price: 9970,
    comboPrice: 19940,
    deadlineDate: new Date("2026-05-03T16:00:00"),
    deadlineLabel: "05.03",
    isCombo: true,
  },
  {
    date: new Date("2026-05-03T16:00:00"),
    label: "Utolsó esély (Töri)",
    subjects: ["történelem"],
    price: 9970,
    deadlineDate: new Date("2026-05-05T16:00:00"),
    deadlineLabel: "05.05",
    isCombo: false,
  },
  {
    date: new Date("2026-05-05T16:00:00"),
    label: "Lezárult",
    subjects: [],
    price: 0,
    deadlineDate: new Date("2026-05-05T16:00:00"),
    deadlineLabel: "-",
    isCombo: false,
  }
];

export function getCurrentPriceTier() {
  const now = (typeof window !== 'undefined' && window.localStorage.getItem('pricing_test_date'))
    ? new Date(window.localStorage.getItem('pricing_test_date')!)
    : new Date();
    
  for (let i = PRICING_SCHEDULE.length - 1; i >= 0; i--) {
    if (now >= PRICING_SCHEDULE[i].date) {
      return PRICING_SCHEDULE[i];
    }
  }
  return PRICING_SCHEDULE[0];
}

export function getActiveSubjects() {
  const tier = getCurrentPriceTier();
  return tier.subjects;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('hu-HU').format(price) + " Ft";
}
