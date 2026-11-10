/* Fictional lecture content that Buddy "read" from Canvas. Source chips look their excerpt up by label,
   so every answer can show the exact slide or brief it came from. */
export type Excerpt = {
  kind: string; // what sort of file it is
  where: string; // where in the file
  heading: string;
  lines: string[];
};

export const LECTURE: Record<string, Excerpt> = {
  "EGB275 · Week 7 slides p.12": {
    kind: "lecture slides",
    where: "Week 7, slide 12",
    heading: "Moment-area: deflection at a point",
    lines: [
      "The deflection of A from the tangent at B equals the first moment of the M/EI area between A and B, taken about A.",
      "Quickest when you need one deflection or slope and the M/EI diagram is simple shapes.",
      "Use double integration when you need the whole deflection curve.",
    ],
  },
  "EGB275 · Week 5 slides p.8": {
    kind: "lecture slides",
    where: "Week 5, slide 8",
    heading: "Fixed-end moments for common loads",
    lines: [
      "Point load P at midspan, both ends fixed: PL/8 at each end.",
      "Uniformly distributed load w over the span: wL²/12 at each end.",
      "Propped cantilever: remove the prop, find the deflection there, then apply compatibility.",
    ],
  },
  "EGB275 · Tutorial 5 worked solution": {
    kind: "tutorial solution",
    where: "Tutorial 5, question 3",
    heading: "Propped cantilever under a uniform load",
    lines: [
      "Degree of indeterminacy is 1: the prop reaction R is the redundant.",
      "Release the prop. Find the tip deflection from the load, then from R acting alone.",
      "Compatibility: the two deflections at the prop cancel. Solve for R.",
    ],
  },
  "EGB273 · Assessment 2 brief": {
    kind: "assessment brief",
    where: "Section 3, workforce plan",
    heading: "What the workforce section is marked on",
    lines: [
      "Crew size and roles for each construction stage.",
      "Peak labour demand and when it occurs.",
      "Skills and licences required, with one identified risk and your response to it.",
    ],
  },
  "EGB273 · Week 9 slides: Workforce planning": {
    kind: "lecture slides",
    where: "Week 9, slides 5 to 8",
    heading: "Planning labour against the program",
    lines: [
      "A resource histogram plots labour per week against the program, and shows the peak.",
      "Ramp up early. Late hires cost productivity while they get up to speed.",
      "Check licences (crane, rigging, working at heights) before you lock the roster.",
    ],
  },
  "BSB105 · Week 4 slides: Frameworks": {
    kind: "lecture slides",
    where: "Week 4, slides 10 to 14",
    heading: "Applying a framework to a case",
    lines: [
      "Choose one framework and apply it to the case with a specific example.",
      "Explaining where the framework does not fit shows deeper understanding.",
    ],
  },
  "BSB105 · Case study guide": {
    kind: "assignment guide",
    where: "Reflection task",
    heading: "Suggested reflection structure",
    lines: [
      "Name the framework, apply it, note its limits, then say what you would do as the manager.",
    ],
  },
  "EGB270 · Week 3 slides p.4": {
    kind: "lecture slides",
    where: "Week 3, slide 4",
    heading: "The elastic region",
    lines: [
      "Stress is proportional to strain: σ = Eε.",
      "Young's modulus E is the slope of the linear part of the curve.",
    ],
  },
  "EGB270 · Week 3 slides p.6": {
    kind: "lecture slides",
    where: "Week 3, slide 6",
    heading: "Yield point",
    lines: [
      "Yield is the stress where permanent (plastic) deformation begins.",
      "Below yield, unloading returns the material to its original length.",
      "Design keeps working stress below yield, using a factor of safety.",
    ],
  },
  "EGB270 · Week 3 slides p.7": {
    kind: "lecture slides",
    where: "Week 3, slide 7",
    heading: "Ultimate tensile strength and necking",
    lines: [
      "UTS is the maximum engineering stress on the curve.",
      "Beyond UTS the specimen necks, and engineering stress falls until fracture.",
    ],
  },
};
