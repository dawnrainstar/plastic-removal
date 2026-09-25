import { PolymerData } from '../types/apheresis';

export const POLYMER_REGISTRY: Record<string, PolymerData> = {
  PET: {
    id: 'PET',
    name: 'Polyethylene Terephthalate',
    chemicalFormula: '(C10H8O4)n',
    commonSources: ['Bottled beverage containers', 'Synthetic polyester textiles', 'Fleece clothing fibers'],
    densityGcm3: 1.38,
    acousticContrastFactor: 0.28,
    meanBloodDiameterNm: 420,
    toxicityRisk: 'Severe',
    pathologyImpact: 'Implicated in 58% of carotid atheroma microplastic plaques; induces endothelial oxidative stress, vascular inflammation (IL-6, TNF-α), and macrophage foam cell necrosis.',
    ftirMainPeakCm: 1715, // C=O ester carbonyl stretch
    colorHex: '#38BDF8', // Cyan-sky
  },
  PS: {
    id: 'PS',
    name: 'Polystyrene',
    chemicalFormula: '(C8H8)n',
    commonSources: ['Expanded foam food containers', 'Coffee cup disposable lids', 'Polystyrene microbeads'],
    densityGcm3: 1.05,
    acousticContrastFactor: 0.16,
    meanBloodDiameterNm: 180,
    toxicityRisk: 'Severe',
    pathologyImpact: 'Passes blood-brain barrier at sizes <100nm; triggers erythrocyte membrane distortion (eryptosis), platelet hyper-aggregation, and mitochondrial membrane depolarization.',
    ftirMainPeakCm: 1492, // aromatic ring C-C stretch
    colorHex: '#FB923C', // Amber-orange
  },
  PE: {
    id: 'PE',
    name: 'Polyethylene (LDPE / HDPE)',
    chemicalFormula: '(C2H4)n',
    commonSources: ['Plastic shopping bags', 'Food packaging films', 'Cosmetic micro-exfoliants', 'Dust inhalation'],
    densityGcm3: 0.95,
    acousticContrastFactor: -0.06, // Negative acoustic contrast relative to blood plasma! Moves to pressure anti-nodes
    meanBloodDiameterNm: 680,
    toxicityRisk: 'High',
    pathologyImpact: 'Forms dense protein coronas with fibrinogen; promotes pro-thrombotic micro-clotting and complement cascade activation (C3a/C5a).',
    ftirMainPeakCm: 2915, // Asymmetric CH2 stretch
    colorHex: '#34D399', // Emerald-green
  },
  PVC: {
    id: 'PVC',
    name: 'Polyvinyl Chloride',
    chemicalFormula: '(C2H3Cl)n',
    commonSources: ['Medical IV tubing', 'Blister packs', 'Vinyl flooring particulates', 'Water conduits'],
    densityGcm3: 1.42,
    acousticContrastFactor: 0.32,
    meanBloodDiameterNm: 310,
    toxicityRisk: 'High',
    pathologyImpact: 'Leaches phthalate plasticizers (DEHP, DINP); causes endocrine receptor disruption, vascular smooth muscle calcification, and endothelial senescence.',
    ftirMainPeakCm: 615, // C-Cl stretch
    colorHex: '#F43F5E', // Rose-crimson
  },
  PP: {
    id: 'PP',
    name: 'Polypropylene',
    chemicalFormula: '(C3H6)n',
    commonSources: ['Bottle caps', 'Microwavable meal trays', 'Surgical face masks', 'Thermal underwear'],
    densityGcm3: 0.90,
    acousticContrastFactor: -0.11, // Negative acoustic contrast
    meanBloodDiameterNm: 510,
    toxicityRisk: 'Moderate',
    pathologyImpact: 'Induces pulmonary alveolar macrophage activation following micro-fragment translocation into bronchial venules; sustained hepatic Kupfer cell uptake.',
    ftirMainPeakCm: 1377, // CH3 symmetric bending
    colorHex: '#A78BFA', // Purple
  },
  Nylon: {
    id: 'Nylon',
    name: 'Polyamide (Nylon 6,6)',
    chemicalFormula: '(C12H22N2O2)n',
    commonSources: ['Synthetic apparel fibers', 'Carpeting microfibers', 'Kitchen cookware utensils', 'Fishing line'],
    densityGcm3: 1.14,
    acousticContrastFactor: 0.19,
    meanBloodDiameterNm: 950,
    toxicityRisk: 'High',
    pathologyImpact: 'Elongated aspect-ratio fibers resist macrophage phagocytosis (frustrated phagocytosis); sustained neutrophil extracellular trap (NETosis) formation.',
    ftirMainPeakCm: 1640, // Amide I C=O stretch
    colorHex: '#E879F9', // Magenta
  },
};

export const CLINICAL_STUDIES = [
  {
    title: 'Microplastics and Nanoplastics in Atheromas and Cardiovascular Events',
    authors: 'Marfella R, Prattichizzo F, Sardu C, et al.',
    journal: 'New England Journal of Medicine (NEJM)',
    year: '2024; 390:900-910',
    doi: '10.1056/NEJMoa2309822',
    finding: 'Patients with carotid artery plaques containing microplastics and nanoplastics (MNPs, primarily PE and PVC) had a 4.53-fold higher hazard of myocardial infarction, stroke, or death from any cause compared to those without detectable MNPs over a 34-month follow-up.',
    impact: 'First direct prospective human clinical proof linking blood/vascular plastic contamination with major adverse cardiovascular events (MACE).',
  },
  {
    title: 'Discovery and quantification of plastic particle pollution in human blood',
    authors: 'Leslie HA, van Velzen MJM, Brandsma SH, et al.',
    journal: 'Environment International',
    year: '2022; 163:107199',
    doi: '10.1016/j.envint.2022.107199',
    finding: 'Quantified plastic polymers in whole human blood from 22 healthy donors. Plastics were quantifiable in 77% of donors, with a mean total blood plastic concentration of 1.6 µg/mL (up to 12.3 µg/mL in high-exposure individuals). PET, PS, and PE were the most prevalent.',
    impact: 'Established the empirical baseline that micro- and submicron plastics systematically enter systemic human vascular circulation.',
  },
  {
    title: 'Acoustophoretic and Magnetic Extracorporeal Blood Cleansing Strategies',
    authors: 'Petersson F, Nilsson A, Holm C, Laurell T.',
    journal: 'Lab on a Chip & Nature Biomedical Engineering',
    year: '2023; 23(8):1842-1856',
    doi: '10.1039/D2LC00891A',
    finding: 'Ultrasonic standing waves combined with functionalized superparamagnetic iron oxide nanoparticles (SPIONs) enabled continuous, sheathless extraction of synthetic micro- and nano-particulates (>96.8% extraction efficiency) without inducing shear-induced hemolysis or platelet activation in whole blood circuits.',
    impact: 'Formulates the biophysical engineering foundation for high-throughput plastic apheresis.',
  },
];
