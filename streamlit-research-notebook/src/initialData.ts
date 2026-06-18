import { ResearchFinding } from './types';

export const initialFindings: ResearchFinding[] = [
  {
    id: '1',
    title: 'Room-Temperature Superconductivity Anomaly in Carbonaceous Sulfur Hydride',
    category: 'Quantum Materials',
    summary: 'Observed transient zero-resistance states under high pressure conditions at 287.7 Kelvin.',
    findings: `### 1. Abstract
Recent laser-heating DAC (Diamond Anvil Cell) experiments on carbonaceous sulfur hydride (CSH) indicate transient phases demonstrating sharp drops in resistivity. This report logs the replication protocols and molecular vibration signatures.

### 2. Experimental Apparatus
- **Pressure Vessel**: Modified symmetric diamond anvil cell with 100-micron culets.
- **Diagnostics**: Synchrotron X-ray diffraction, confocal Raman spectroscopy.
- **Precursor Mix**: Carbon, sulfur, and molecular diatomic hydrogen ($H_2$) under 267 GPa local stress lines.

### 3. Key Observations & Data Logs
1. **Resistivity Cliff**: Resistance drops below instrument detection threshold ($< 10^{-6}\\,\\Omega$) at approximately **14.8°C (287.7 K)**.
2. **Meissner Effect verification**: AC magnetic susceptibility measures a distinct diamagnetic shift of $-3.2\\times10^{-4}$ emu.
3. **Reproducibility**: Limited by culet alignment degradation under high gigapascal states. Further containment optimization is required in Phase B.

### 4. Next Iterations
Deploy helium-recirculating cryostat lines to capture structural phase boundaries with nanosecond resolution during decompression sweeps.`,
    confidence: 82,
    importance: 9,
    status: 'In Review',
    sources: [
      'Nature Materials Vol 672, pp. 110-115 (2025)',
      'Advanced High-Pressure Physics Quarterly, Issue 4'
    ],
    tags: ['Superconductivity', 'High Pressure', 'Materials Science'],
    createdAt: '2026-06-12T10:30:00.000Z'
  },
  {
    id: '2',
    title: 'Benchmarking Multi-Modal Hallucination Ratios via Recursive Prompting',
    category: 'Artificial Intelligence',
    summary: 'Evaluated LLMs on structured spatial reasoning tasks to analyze self-reinforcing epistemic errors.',
    findings: `### Evaluation Methodology
We developed a closed-loop benchmarking environment that forces vision-language models to solve complex geometrical navigation puzzles. We measure the "epistemic descent rate," which tracks how quickly a model convinces itself of an incorrect spatial layout when prompted recursively.

### Foundational Framework
\`\`\`python
# Recursive Spatial Prompt Loop
def query_spatial_loop(model, image, steps=5):
    spatial_prompt = "Verify if the green circle is strictly northeast of the crimson prism."
    log = []
    for step in range(steps):
        response = model.analyze(image, spatial_prompt)
        log.append(response.confidence_score)
        # Re-feed own response as minor premise
        spatial_prompt = f"Confirm your previous statement: '{response.text}'. Explain any micro-anomalies."
    return log
\`\`\`

### High-Level Metrics
- **Base Error Rate**: Model A (35.2%), Model B (12.4%), Model C (15.1%).
- **Self-Feedback Amplification**: Repeated confirmation queries causes AI models to increase their subjective confidence by an average of **28%**, irrespective of factual correctness! This is a dangerous cognitive loop for scientific queries.

### Proposed Mitigations
- Inject cross-examiner peer agents with conflicting priors.
- Integrate mathematical formal verification engines directly in output parsing loops.`,
    confidence: 94,
    importance: 8,
    status: 'Completed',
    sources: [
      'IEEE Transactions on Cognitive Intelligence, Sec. B',
      'AI Research Labs Internal Preprint v1.0.4'
    ],
    tags: ['LLMs', 'Hallucinations', 'Multi-Modal', 'Benchmarking'],
    createdAt: '2026-06-15T14:15:00.000Z'
  },
  {
    id: '3',
    title: 'Graphene-Enhanced Lithium-Sulfur Cathode Degradation Analysis',
    category: 'Energy Storage',
    summary: 'Investigated chemical shuttle suppression using protective sulfur-doped graphene layers in prototype coin-cells.',
    findings: `### Executive Summary
Lithium-sulfur batteries offer theoretical energy densities up to $2600\\,\\text{Wh kg}^{-1}$, but practical implementation is stalled due to the "polysulfide shuttle effect" where active sulfur material leaks into the electrolyte. This study tests the effectiveness of structural graphene shielding.

### Material Prep & Cell Setup
1. **Cathode Active Material**: Pristine elemental sulfur nanoparticles embedded into a sulfur-doped porous graphene matrix (S-PGM).
2. **Electrolyte**: $1\\,\\text{M LiTFSI}$ in DOL/DME with $2\\%\\,\\text{LiNO}_3$ additive.
3. **Testing Envelope**: Charge-discharge cycles performed at $0.5\\,\\text{C}$ inside an argon-filled glove box system.

### Performance Indicators
- **Initial Specific Capacity**: $1240\\,\\text{mAh g}^{-1}$ at first discharge.
- **Retention Rate**: Stable retention at **87.2%** capacity over 500 complete recharge/discharge loops.
- **Observations**: Scanning Electron Microscope (SEM) analysis post-mortem reveals that the S-PGM host safely encapsulates lithium polysulfides, reducing volumetric expansion to under 4%.

### Strategic Hurdles
High-yield synthesis of uniform pore sizes in graphene remains highly cost-prohibitive for massive multi-kilowatt designs.`,
    confidence: 76,
    importance: 7,
    status: 'Draft',
    sources: [
      'Journal of Electrochemical Systems, Oct 2025 Edition',
      'Department of Chemical Sciences Lab Records #442a'
    ],
    tags: ['Batteries', 'Graphene', 'Electrochemistry', 'Energy Storage'],
    createdAt: '2026-06-17T09:45:00.000Z'
  }
];
