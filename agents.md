# Investigation Agents Documentation

This document describes the various investigation agents that operate during the regulatory intelligence analysis process. Each agent represents a specific function in the data collection and analysis pipeline.

## 🤖 Agent Overview

The Media Risk Intelligence platform uses a multi-agent system to collect, process, and analyze regulatory data from multiple government sources. Each agent has a specific role and operates in a coordinated sequence during the investigation process.

## 📡 Data Collection Agents

### 1. Legislative Monitor Agent
**Purpose**: Scans active congressional proceedings and bills
**Data Source**: Congress.gov API
**Function**: 
- Identifies bills mentioning target companies
- Tracks committee activities and hearings
- Monitors legislative language changes
- Flags regulatory proposals affecting target industries

**Feed Messages**:
- `Legislative Monitor scanning active congressional proceedings`
- `X active congressional proceedings identified — filtering for relevance`

### 2. Enforcement Tracker Agent
**Purpose**: Connects to FTC and FCC enforcement databases
**Data Source**: FTC RSS Feed, FCC ECFS API
**Function**:
- Reviews recent enforcement actions
- Cross-references with target company operations
- Identifies compliance patterns
- Tracks penalty trends and precedents

**Feed Messages**:
- `Enforcement Tracker connecting to FTC and FCC enforcement databases`
- `X FTC enforcement actions reviewed — cross-referencing with [company] operations`

### 3. Lobbying Analyst Agent
**Purpose**: Pulls Senate LDA filings and disclosure records
**Data Source**: Senate LDA API
**Function**:
- Analyzes lobbying expenditure patterns
- Identifies regulatory influence activities
- Tracks lobbyist registrations
- Monitors issue-specific lobbying efforts

**Feed Messages**:
- `Lobbying Analyst pulling Senate LDA filings and disclosure records`
- `X lobbying disclosure filings detected — $[company] spend pattern flagged`

### 4. Signal Monitor Agent
**Purpose**: Scans Federal Register and NewsAPI feeds
**Data Source**: Federal Register API, NewsAPI
**Function**:
- Monitors regulatory proposals and rule changes
- Tracks media coverage of regulatory issues
- Identifies public sentiment trends
- Detects early warning signals in news coverage

**Feed Messages**:
- `Signal Monitor scanning Federal Register and NewsAPI feeds`
- `X regulatory signals retrieved across X/6 government sources`

## 🧠 Analysis Agents

### 5. Policy Analyst Agent
**Purpose**: Evaluates regulatory language and enforcement precedent
**Function**:
- Analyzes statutory language complexity
- Identifies compliance requirements
- Evaluates enforcement likelihood
- Assesses penalty severity ranges

**Feed Messages**:
- `Policy Analyst evaluating regulatory language and enforcement precedent`

### 6. Risk Modeler Agent
**Purpose**: Correlates signals across legislative, enforcement, and lobbying tracks
**Function**:
- Builds risk correlation models
- Identifies signal patterns
- Calculates risk probability scores
- Models regulatory timeline scenarios

**Feed Messages**:
- `Risk Modeler correlating signals across legislative, enforcement, and lobbying tracks`

### 7. Competitive Intelligence Agent
**Purpose**: Estimates peer exposure from industry signals
**Function**:
- Analyzes competitor regulatory patterns
- Identifies industry-wide risks
- Benchmarks against peer companies
- Estimates market impact scenarios

**Feed Messages**:
- `Competitive Intelligence Agent estimating peer exposure from industry signals`

## 📊 Velocity Analysis Agents

### 8. Velocity Calculator Agent
**Purpose**: Identifies velocity acceleration patterns across time windows
**Function**:
- Calculates 30/90/180-day signal velocity
- Identifies acceleration/deceleration patterns
- Computes velocity multipliers
- Tracks trend changes over time

**Feed Messages**:
- `Identifying velocity acceleration patterns across 30-day and 180-day windows`

### 9. Trend Analyst Agent
**Purpose**: Evaluates FTC consumer protection posture and trends
**Function**:
- Analyzes enforcement trend directions
- Identifies pattern shifts
- Evaluates regulatory focus areas
- Assesses timeline implications

**Feed Messages**:
- `Evaluating FTC consumer protection posture — reviewing recent enforcement precedent`

## 🎯 Synthesis Agents

### 10. Signal Synthesizer Agent
**Purpose**: Synthesizes signals across legislative, enforcement, and lobbying tracks
**Function**:
- Combines multi-source signals
- Identifies converging risk factors
- Weights signal importance
- Creates unified risk picture

**Feed Messages**:
- `Synthesizing signals across legislative, enforcement, and lobbying tracks`

### 11. Exposure Mapper Agent
**Purpose**: Maps company regulatory exposure against historical enforcement patterns
**Function**:
- Compares current signals to historical patterns
- Identifies similar regulatory scenarios
- Maps exposure likelihood
- Estimates risk magnitude

**Feed Messages**:
- `Mapping [company]'s regulatory exposure against historical enforcement patterns`

### 12. Cross-Reference Analyst Agent
**Purpose**: Cross-references congressional committee activity with lobbying disclosure timing
**Function**:
- Correlates legislative activity with lobbying efforts
- Identifies timing patterns
- Detects influence attempts
- Maps committee focus areas

**Feed Messages**:
- `Cross-referencing congressional committee activity with lobbying disclosure timing`

## 📈 Risk Scoring Agents

### 13. Risk Vector Scorer Agent
**Purpose**: Scores risk vectors across content regulation, antitrust, and data policy domains
**Function**:
- Assigns risk scores to regulatory domains
- Weights risk by severity and likelihood
- Calculates composite risk metrics
- Identifies highest-risk areas

**Feed Messages**:
- `Scoring risk vectors across content regulation, antitrust, and data policy domains`

### 14. Brief Drafter Agent
**Purpose**: Drafts executive intelligence brief applying Activate regulatory framework
**Function**:
- Synthesizes all analysis into coherent brief
- Applies regulatory framework methodology
- Structures findings for executive consumption
- Highlights key risk factors

**Feed Messages**:
- `Drafting executive intelligence brief — applying Activate regulatory framework`

### 15. Action Prioritizer Agent
**Purpose**: Finalizes strategic action recommendations prioritized by time to impact
**Function**:
- Prioritizes strategic recommendations
- Estimates implementation timelines
- Assigns action urgency levels
- Creates actionable roadmap

**Feed Messages**:
- `Finalising strategic action recommendations — prioritising by time to impact`

## ✅ Validation Agents

### 16. Source Validator Agent
**Purpose**: Validates signal sources confirming government data recency
**Function**:
- Verifies data source reliability
- Checks data recency and accuracy
- Validates signal authenticity
- Ensures quality standards

**Feed Messages**:
- `Validating signal sources — confirming government data recency`

## 🔄 Agent Coordination

### Execution Sequence
1. **Data Collection Phase** (Agents 1-4): Parallel data gathering
2. **Initial Analysis Phase** (Agents 5-7): Basic signal processing
3. **Velocity Analysis Phase** (Agents 8-9): Trend and pattern analysis
4. **Synthesis Phase** (Agents 10-12): Multi-source correlation
5. **Risk Scoring Phase** (Agents 13-15): Comprehensive risk assessment
6. **Validation Phase** (Agent 16): Quality assurance

### Parallel Processing
- **Data Collection Agents** operate simultaneously for efficiency
- **Analysis Agents** process data as it becomes available
- **Synthesis Agents** wait for sufficient data before correlation
- **Validation Agent** runs final quality checks

### Agent Communication
- **Feed Lines**: Each agent reports progress via the investigation feed
- **Data Sharing**: Agents share processed data through centralized state
- **Error Handling**: Failed agent operations trigger error reporting
- **Completion Signals**: Agents signal completion to trigger next phase

## 🎨 Visual Representation

### Agent Status Indicators
- **Gold (▸)**: Agent initiation and data collection activities
- **Teal (◆)**: Real data results and quantitative findings
- **Blue (◎)**: Analysis and processing operations
- **Green (✓)**: Successful completion and validation

### Progress Tracking
- **Active Dot**: Pulsing indicator shows currently operating agent
- **Completed Dots**: Small dim circles show finished operations
- **Sequential Flow**: Agents operate in coordinated sequence
- **Real-time Updates**: Feed provides live agent status updates

## 🚀 Performance Optimization

### Agent Efficiency
- **Parallel Execution**: Multiple agents run simultaneously when possible
- **Data Caching**: Agents cache results to avoid redundant operations
- **Timeout Management**: Each agent has configurable timeout limits
- **Error Recovery**: Failed agents can be retried or bypassed

### Resource Management
- **Memory Optimization**: Agents clean up temporary data after completion
- **API Rate Limiting**: Agents respect API rate limits and quotas
- **Network Efficiency**: Agents batch requests when possible
- **CPU Optimization**: Heavy processing is distributed across time

---

**Investigation Agents** - The coordinated intelligence system that powers the Media Risk Intelligence platform's regulatory analysis capabilities.
