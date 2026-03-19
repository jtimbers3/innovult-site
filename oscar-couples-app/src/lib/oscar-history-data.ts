export type OscarNominee = {
  id: string;
  name: string;
  winner?: boolean;
};

export type OscarCategory = {
  id: string;
  name: string;
  nominees: OscarNominee[];
};

export type OscarYear = {
  id: string;
  year: number;
  title: string;
  categories: OscarCategory[];
};

// NOTE:
// This file is intentionally hardcoded so history works without a database/API.
// Add additional years/categories directly here as needed.
export const OSCAR_HISTORY: OscarYear[] = [
  {
    id: "oscars-2025",
    year: 2025,
    title: "97th Academy Awards",
    categories: [
      {
        id: "best-picture",
        name: "Best Picture",
        nominees: [
          { id: "anora", name: "Anora", winner: true },
          { id: "the-brutalist", name: "The Brutalist" },
          { id: "conclave", name: "Conclave" },
          { id: "dune-part-two", name: "Dune: Part Two" },
          { id: "emilia-perez", name: "Emilia Pérez" },
          { id: "im-still-here", name: "I’m Still Here" },
          { id: "nickel-boys", name: "Nickel Boys" },
          { id: "the-substance", name: "The Substance" },
          { id: "a-complete-unknown", name: "A Complete Unknown" },
          { id: "wicked", name: "Wicked" }
        ]
      },
      {
        id: "best-director",
        name: "Best Director",
        nominees: [
          { id: "sean-baker", name: "Sean Baker", winner: true },
          { id: "brady-corbet", name: "Brady Corbet" },
          { id: "james-mangold", name: "James Mangold" },
          { id: "jacques-audiard", name: "Jacques Audiard" },
          { id: "coralie-fargeat", name: "Coralie Fargeat" }
        ]
      },
      {
        id: "best-actress",
        name: "Best Actress",
        nominees: [
          { id: "mikey-madison", name: "Mikey Madison", winner: true },
          { id: "demi-moore", name: "Demi Moore" },
          { id: "fernanda-torres", name: "Fernanda Torres" },
          { id: "karla-sofia-gascon", name: "Karla Sofía Gascón" },
          { id: "cynthia-erivo", name: "Cynthia Erivo" }
        ]
      },
      {
        id: "best-actor",
        name: "Best Actor",
        nominees: [
          { id: "adrien-brody", name: "Adrien Brody", winner: true },
          { id: "timothee-chalamet", name: "Timothée Chalamet" },
          { id: "colman-domingo", name: "Colman Domingo" },
          { id: "ralph-fiennes", name: "Ralph Fiennes" },
          { id: "sebastian-stan", name: "Sebastian Stan" }
        ]
      },
      {
        id: "best-animated-feature",
        name: "Best Animated Feature",
        nominees: [
          { id: "flow", name: "Flow", winner: true },
          { id: "inside-out-2", name: "Inside Out 2" },
          { id: "the-wild-robot", name: "The Wild Robot" },
          { id: "wallace-gromit", name: "Wallace & Gromit: Vengeance Most Fowl" },
          { id: "memoir-of-a-snail", name: "Memoir of a Snail" }
        ]
      }
    ]
  },
  {
    id: "oscars-2024",
    year: 2024,
    title: "96th Academy Awards",
    categories: [
      {
        id: "best-picture",
        name: "Best Picture",
        nominees: [
          { id: "oppenheimer", name: "Oppenheimer", winner: true },
          { id: "american-fiction", name: "American Fiction" },
          { id: "anatomy-of-a-fall", name: "Anatomy of a Fall" },
          { id: "barbie", name: "Barbie" },
          { id: "the-holdovers", name: "The Holdovers" },
          { id: "killers-of-the-flower-moon", name: "Killers of the Flower Moon" },
          { id: "maestro", name: "Maestro" },
          { id: "past-lives", name: "Past Lives" },
          { id: "poor-things", name: "Poor Things" },
          { id: "the-zone-of-interest", name: "The Zone of Interest" }
        ]
      },
      {
        id: "best-director",
        name: "Best Director",
        nominees: [
          { id: "christopher-nolan", name: "Christopher Nolan", winner: true },
          { id: "justine-triet", name: "Justine Triet" },
          { id: "martin-scorsese", name: "Martin Scorsese" },
          { id: "yosorgos-lanthimos", name: "Yorgos Lanthimos" },
          { id: "jonathan-glazer", name: "Jonathan Glazer" }
        ]
      },
      {
        id: "best-actress",
        name: "Best Actress",
        nominees: [
          { id: "emma-stone", name: "Emma Stone", winner: true },
          { id: "annette-bening", name: "Annette Bening" },
          { id: "lily-gladstone", name: "Lily Gladstone" },
          { id: "sandra-huller", name: "Sandra Hüller" },
          { id: "carey-mulligan", name: "Carey Mulligan" }
        ]
      },
      {
        id: "best-actor",
        name: "Best Actor",
        nominees: [
          { id: "cillian-murphy", name: "Cillian Murphy", winner: true },
          { id: "bradley-cooper", name: "Bradley Cooper" },
          { id: "colman-domingo", name: "Colman Domingo" },
          { id: "paul-giamatti", name: "Paul Giamatti" },
          { id: "jeffrey-wright", name: "Jeffrey Wright" }
        ]
      },
      {
        id: "best-animated-feature",
        name: "Best Animated Feature",
        nominees: [
          { id: "the-boy-and-the-heron", name: "The Boy and the Heron", winner: true },
          { id: "elemental", name: "Elemental" },
          { id: "nimona", name: "Nimona" },
          { id: "robot-dreams", name: "Robot Dreams" },
          { id: "spider-verse", name: "Spider-Man: Across the Spider-Verse" }
        ]
      }
    ]
  }
].sort((a, b) => b.year - a.year);
