/**
 * Master Baiter — top worldwide buck attractants & recipes.
 * Educational only. Always follow local law (Nova Scotia DNR / municipal bylaws).
 */

export type BaitCategory =
  | "mineral"
  | "food"
  | "scent"
  | "scrape"
  | "diy";

export interface MasterBait {
  rank: number;
  name: string;
  category: BaitCategory;
  region: string;
  why: string;
  how: string;
  season: string;
  recipe?: string[];
  legalNote: string;
}

export const MASTER_BAITS_TOP_10: MasterBait[] = [
  {
    rank: 1,
    name: "Natural mineral rock / Trophy Rock–style lick",
    category: "mineral",
    region: "North America (global mineral sites)",
    why: "Deer seek salt and 60+ trace minerals for antler growth and herd health. Long-lasting draw; cams light up for months when legal.",
    how: "Place a natural mineral rock or pour commercial mineral mix into bare soil. Refresh soil contact so deer dig and re-visit.",
    season: "Year-round establishment; strongest spring–summer for bucks in velvet",
    legalNote: "Often treated as bait/attractant. Illegal or restricted in many places — verify NS and local bylaws.",
  },
  {
    rank: 2,
    name: "DIY mineral lick (salt + dical + trace minerals)",
    category: "diy",
    region: "Worldwide private-land classic",
    why: "Cheapest long-term site builder. Outlasts sweet baits; builds a true destination for bucks.",
    how: "Mix dry, dig a shallow pit, pour in, cover lightly with soil. Mark for cams.",
    season: "Establish off-season; maintain lightly pre-season",
    recipe: [
      "50 lb livestock / stock salt (no medication)",
      "25 lb di-calcium phosphate (feed store)",
      "5 lb trace mineral premix (no medicated cattle mix)",
      "Mix dry in a barrel → shallow pit 15–20 cm deep → cover with a thin soil layer",
    ],
    legalNote: "Mineral sites may be banned as baiting. Know your zone and land rules.",
  },
  {
    rank: 3,
    name: "Herd / calm scent (EverCalm-style synthetic)",
    category: "scent",
    region: "Widely used in US & Canada",
    why: "Mimics a content deer herd. Bucks investigate without the intimidation of a dominant buck or the narrow window of estrus.",
    how: "Rub stick or apply to branches near a trail or mock scrape. Low mess; works all season.",
    season: "Year-round; excellent early season and pre-rut",
    legalNote: "Scents are usually legal where food bait is not — still confirm local rules and CWD scent bans.",
  },
  {
    rank: 4,
    name: "Doe-in-rut / estrus lure (synthetic preferred)",
    category: "scent",
    region: "Global rut tactics",
    why: "Classic buck magnet in the breeding window. Synthetics avoid CWD concerns and spoilage of natural urine.",
    how: "Wicks, drippers, or boot drags on the downwind side of your setup. Fresh application each sit.",
    season: "Pre-rut through peak rut only",
    legalNote: "Some regions ban natural cervid urine. Synthetic is safer legally and for disease.",
  },
  {
    rank: 5,
    name: "Mock scrape + licking branch system",
    category: "scrape",
    region: "Whitetail country worldwide",
    why: "Language bucks already speak. Combines visual sign, scent, and territorial curiosity — often better than pure food bait.",
    how: "Clear a scrape under an overhanging licking branch. Add pre/post-rut scrape scent or herd scent. Refresh weekly.",
    season: "Early season through rut",
    legalNote: "Generally scent-based; still check if placing attractants is restricted.",
  },
  {
    rank: 6,
    name: "Molasses + corn / apple food attractant",
    category: "food",
    region: "Americas, Europe food-plot & bait culture",
    why: "Sweet + starch is a hardwired draw where feeding is legal. Fast trail-cam results.",
    how: "Pour liquid molasses over corn or use commercial cane/molasses powders on bare ground.",
    season: "Where legal: late summer through season",
    recipe: [
      "4 cups whole corn",
      "2 cups apple juice",
      "2 cups rolled oats",
      "2 cups molasses or dark corn syrup",
      "Mix; spread thin at a legal site — do not pile wastefully",
    ],
    legalNote: "This is classic bait. Illegal or tightly controlled in many jurisdictions including parts of Canada.",
  },
  {
    rank: 7,
    name: "Blackstrap molasses + mineral + vanilla DIY",
    category: "diy",
    region: "Homemade favourite (field-tested recipes)",
    why: "Strong smell, minerals, and sweet draw in one pour. Cheap per application.",
    how: "Mix to syrup consistency; pour on stumps, logs, or soil at legal sites only.",
    season: "Where baiting is allowed",
    recipe: [
      "1 cup blackstrap molasses",
      "1/4 cup corn oil",
      "1/4 cup trace mineral salt",
      "2 Tbsp pure vanilla extract",
      "Stir to thick pourable syrup; use sparingly",
    ],
    legalNote: "Food attractant = bait. Illegal unless your land and province allow it.",
  },
  {
    rank: 8,
    name: "Apple / fruit-based attractants",
    category: "food",
    region: "Orchard country & commercial apple scents worldwide",
    why: "Apples are a known preferred browse and scent. Works as liquid, powder, or orchard drop where legal.",
    how: "Commercial apple powders/liquids, or fallen orchard fruit only if lawful. Pair with a camera.",
    season: "Fall food phase",
    legalNote: "Fruit piles can be illegal bait. Municipal no-deer-feeding bylaws may apply.",
  },
  {
    rank: 9,
    name: "Peanut butter / brown sugar block (DIY)",
    category: "diy",
    region: "Budget DIY (private land where legal)",
    why: "Intense smell and salt/sugar draw. Sticky blocks hold scent in wet weather.",
    how: "Warm gently, pour into a mold or onto a stump.",
    season: "Where baiting is legal only",
    recipe: [
      "1 large jar peanut butter (~1 kg)",
      "1 kg brown sugar",
      "1 cup stock salt",
      "Warm and stir; splash of water to syrup; set in a mold",
    ],
    legalNote: "Food bait — high legal risk in regulated provinces.",
  },
  {
    rank: 10,
    name: "Food plots & natural browse (clover, brassicas, soft mast)",
    category: "food",
    region: "Global habitat management gold standard",
    why: "The real #1 long-term: grow what bucks want. Beats any bottle when you can plant or protect browse.",
    how: "Small clearings, clover strips, brassicas, or protect soft mast. Hunt the travel corridors — not the plot center every sit.",
    season: "Plant spring/summer; hunt fall patterns",
    legalNote: "Crops for agriculture are usually fine; dumping feed as bait is a different legal question. Check NS rules.",
  },
];

export const CATEGORY_LABEL: Record<BaitCategory, string> = {
  mineral: "Mineral",
  food: "Food / bait",
  scent: "Scent",
  scrape: "Scrape system",
  diy: "DIY recipe",
};
