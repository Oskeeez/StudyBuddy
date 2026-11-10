/* Little illustrations for the study-preference pickers. Same language as the Peely mascot:
   thick navy outline, round joins, flat pastel fills. All drawn on an 80x80 grid. */

const INK = "#0F2D5E";
const st = (w = 4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const Y = "#FFD84D", Y2 = "#FFE680", MINT = "#BDEBD3", PINK = "#FFB3C7", LILAC = "#D3C7F5", SKY = "#BFD9FF", W = "#FFFFFF";

const ray = (x1: number, y1: number, x2: number, y2: number) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" ${st()}/>`;

export const PICK_ART: Record<string, string> = {
  /* Visual: a framed painting with sun and hills */
  Visual: `<rect x="8" y="12" width="64" height="54" rx="9" fill="${Y2}" ${st()}/>
<rect x="17" y="21" width="46" height="36" rx="3" fill="${SKY}" ${st(3.5)}/>
<circle cx="31" cy="33" r="5.5" fill="${Y}" ${st(3.5)}/>
<path d="M17 57L35 39L45 49L51 43L63 57Z" fill="${MINT}" ${st(3.5)}/>`,

  /* Talking it through: speech bubble with dots */
  "Talking it through": `<path d="M22 12H58A12 12 0 0 1 70 24V42A12 12 0 0 1 58 54H40L24 69V54H22A12 12 0 0 1 10 42V24A12 12 0 0 1 22 12Z" fill="${LILAC}" ${st()}/>
<circle cx="26" cy="33" r="3.4" fill="${INK}"/><circle cx="40" cy="33" r="3.4" fill="${INK}"/><circle cx="54" cy="33" r="3.4" fill="${INK}"/>`,

  /* Practice problems: a marked test paper */
  "Practice problems": `<path d="M20 8H46L64 26V68A4 4 0 0 1 60 72H20A4 4 0 0 1 16 68V12A4 4 0 0 1 20 8Z" fill="${W}" ${st()}/>
<path d="M46 8V26H64" fill="${Y}" ${st()}/>
<path d="M23 38L28 43L36 33" fill="none" stroke="#1B8A57" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M42 39H55" fill="none" ${st(3.5)}/>
<path d="M23 56L28 61L36 51" fill="none" stroke="#1B8A57" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M42 57H55" fill="none" ${st(3.5)}/>`,

  /* Reading: an open textbook */
  Reading: `<path d="M5 22V64C18 59 31 59 40 66C49 59 62 59 75 64V22" fill="${SKY}" ${st()}/>
<path d="M40 24C31 17 19 16 9 20V58C20 54 31 55 40 61Z" fill="${W}" ${st()}/>
<path d="M40 24C49 17 61 16 71 20V58C60 54 49 55 40 61Z" fill="${W}" ${st()}/>
<path d="M17 30C22 28 27 28 32 30M17 39C22 37 27 37 32 39M48 30C53 28 58 28 63 30M48 39C53 37 58 37 63 39" fill="none" ${st(3)}/>`,

  /* Mornings: sun coming up over the horizon */
  Mornings: `<path d="M21 52A19 19 0 0 1 59 52Z" fill="${Y}" ${st()}/>
${ray(40, 22, 40, 13)}${ray(61, 31, 67, 25)}${ray(19, 31, 13, 25)}${ray(10, 45, 4, 44)}${ray(70, 45, 76, 44)}
<path d="M8 52H72" fill="none" ${st()}/>
<path d="M22 62H58" fill="none" ${st(3.5)}/>`,

  /* Afternoons: full midday sun */
  Afternoons: `<circle cx="40" cy="40" r="15" fill="${Y}" ${st()}/>
${ray(40, 8, 40, 16)}${ray(40, 64, 40, 72)}${ray(8, 40, 16, 40)}${ray(64, 40, 72, 40)}${ray(17.4, 17.4, 23, 23)}${ray(57, 57, 62.6, 62.6)}${ray(17.4, 62.6, 23, 57)}${ray(57, 23, 62.6, 17.4)}`,

  /* Evenings: moon and stars at night */
  Evenings: `<circle cx="40" cy="40" r="31" fill="#24467F" ${st()}/>
<circle cx="37" cy="41" r="17" fill="${Y2}"/>
<circle cx="46" cy="34" r="14.500" fill="#24467F"/>
<path d="M57 46L59 51L64 53L59 55L57 60L55 55L50 53L55 51Z" fill="${Y2}"/>
<path d="M55 21L56.500 24.500L60 26L56.500 27.500L55 31L53.500 27.500L50 26L53.500 24.500Z" fill="${W}"/>`,

  /* On campus: a university hall with a clock tower */
  "On campus": `<rect x="8" y="38" width="64" height="30" rx="3" fill="${PINK}" ${st()}/>
<rect x="29" y="16" width="22" height="52" rx="2" fill="${Y2}" ${st()}/>
<path d="M26 16L40 4L54 16Z" fill="${LILAC}" ${st()}/>
<circle cx="40" cy="27" r="5.500" fill="${W}" ${st(3.5)}/>
<path d="M40 24V27H43" fill="none" ${st(2.5)}/>
<path d="M34 68V56A6 6 0 0 1 46 56V68Z" fill="${SKY}" ${st(3.5)}/>
<rect x="14" y="46" width="9" height="9" rx="1.500" fill="${W}" ${st(3)}/>
<rect x="57" y="46" width="9" height="9" rx="1.500" fill="${W}" ${st(3)}/>`,

  /* Online: a laptop with someone on a video call */
  Online: `<rect x="12" y="12" width="56" height="40" rx="6" fill="${SKY}" ${st()}/>
<circle cx="40" cy="28" r="6" fill="${W}" ${st(3.5)}/>
<path d="M28 46C28 39 34 37 40 37C46 37 52 39 52 46" fill="${W}" ${st(3.5)}/>
<path d="M6 56H74L70 68H10Z" fill="${LILAC}" ${st()}/>`,

  /* Small groups: three people together */
  "Small groups": `<circle cx="19" cy="33" r="7.500" fill="${PINK}" ${st(3.5)}/>
<path d="M6 62C6 52 11 47 19 47C27 47 32 52 32 62Z" fill="${PINK}" ${st(3.5)}/>
<circle cx="61" cy="33" r="7.500" fill="${MINT}" ${st(3.5)}/>
<path d="M48 62C48 52 53 47 61 47C69 47 74 52 74 62Z" fill="${MINT}" ${st(3.5)}/>
<circle cx="40" cy="26" r="10" fill="${Y2}" ${st()}/>
<path d="M22 66C22 53 29 46 40 46C51 46 58 53 58 66Z" fill="${Y2}" ${st()}/>`,
};
