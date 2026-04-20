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
    deadlineDate: new Date("2026-04-26T12:00:00"),
    deadlineLabel: "04.26 délidő",
    isCombo: false,
  },
  {
    date: new Date("2026-04-26T12:00:00"),
    label: "Kombo bevezető",
    subjects: ["történelem", "magyar"],
    price: 8970,
    comboPrice: 15970,
    deadlineDate: new Date("2026-04-26T23:59:59"),
    deadlineLabel: "04.26 éjfél",
    isCombo: true,
  },
  {
    date: new Date("2026-04-26T23:59:59"),
    label: "Kombo kedvezmény",
    subjects: ["történelem", "magyar"],
    price: 9970,
    comboPrice: 15970,
    deadlineDate: new Date("2026-05-01T23:59:59"),
    deadlineLabel: "05.01 éjfél",
    isCombo: true,
  },
  {
    date: new Date("2026-05-01T23:59:59"),
    label: "Normál ár",
    subjects: ["történelem", "magyar"],
    price: 9970,
    comboPrice: 19940,
    deadlineDate: new Date("2026-05-03T16:00:00"),
    deadlineLabel: "05.03 16:00",
    isCombo: true,
  },
  {
    date: new Date("2026-05-03T16:00:00"),
    label: "Utolsó esély (Töri)",
    subjects: ["történelem"],
    price: 9970,
    deadlineDate: new Date("2026-05-05T16:00:00"),
    deadlineLabel: "05.05 16:00",
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

export function isSubjectActive(subject: string) {
  return getActiveSubjects().includes(subject);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('hu-HU').format(price) + " Ft";
}
