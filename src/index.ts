import { Hono } from "hono";

const app = new Hono();

const IPFS_CID = "bafybeicgwg2xklqnvddmdp33n55chwrivyye35gnoatvlwd7dvgdaldboa";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StakeWise Exit Queue | Ethereum Staking Withdrawal</title>
  <meta name="description" content="How the StakeWise V3 exit queue works -- entering, processing, and claiming ETH from the Chorus One Max Vault.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --color-bg: #ffffff;
      --color-bg-secondary: #ffffff;
      --color-bg-alt: #fafafa;
      --color-hover-bg: #e8e8e8;
      --color-text: #111111;
      --color-text-muted: #666666;
      --color-border: #e5e5e5;
      --color-border-dark: #000000;
      --color-shadow: #000000;
      --color-link: #0066cc;
      --color-accent: #FFD600;
      --color-success: #28a745;
      --color-success-bg: #D4F5E9;
      --color-error: #FF3333;
      --font-mono: 'IBM Plex Mono', ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
    }

    body {
      font-family: var(--font-mono);
      font-size: 14px;
      line-height: 1.6;
      color: var(--color-text);
      background: var(--color-bg);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    a { color: var(--color-link); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Hero */
    .hero {
      border: 3px solid var(--color-border-dark);
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 8px 8px 0 var(--color-shadow);
      background: var(--color-accent);
    }

    .hero h1 {
      font-family: var(--font-mono);
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 0.5rem;
      color: var(--color-border-dark);
    }

    .hero .subtitle {
      font-size: 0.85rem;
      color: var(--color-border-dark);
      opacity: 0.8;
    }

    /* Badges */
    .badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.4rem;
      border: 1px solid;
      border-radius: 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .badge-success {
      background: var(--color-success-bg);
      border-color: var(--color-success);
      color: var(--color-success);
    }

    .badge-accent {
      background: var(--color-accent);
      border-color: var(--color-border-dark);
      color: var(--color-border-dark);
    }

    .badge-step {
      background: var(--color-border-dark);
      border-color: var(--color-border-dark);
      color: var(--color-bg);
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
    }

    /* Cards / Sections */
    .card {
      background: var(--color-bg-secondary);
      border: 3px solid var(--color-border-dark);
      border-radius: 0;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 8px 8px 0 var(--color-shadow);
    }

    .card h2 {
      font-family: var(--font-mono);
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--color-border-dark);
    }

    .card h3 {
      font-family: var(--font-mono);
      font-size: 1rem;
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
    }

    /* Video */
    .video-container {
      border: 3px solid var(--color-border-dark);
      box-shadow: 8px 8px 0 var(--color-shadow);
      margin-bottom: 2rem;
      background: #000;
    }

    .video-container video {
      display: block;
      width: 100%;
      height: auto;
    }

    .video-label {
      background: var(--color-border-dark);
      color: var(--color-bg);
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin-top: 0.75rem;
    }

    th {
      background: var(--color-hover-bg);
      text-align: left;
      padding: 0.75rem;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 2px solid var(--color-border-dark);
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid var(--color-border);
      word-break: break-all;
    }

    /* Code blocks */
    .code-block {
      background: #111;
      color: #4AF626;
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      overflow-x: auto;
      border: 2px solid var(--color-border-dark);
      margin: 0.75rem 0;
      line-height: 1.5;
    }

    .code-block .comment { color: #666; }
    .code-block .fn { color: #FFD600; }
    .code-block .num { color: #FF6B6B; }
    .code-block .addr { color: #7EC8E3; }

    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 2rem;
      margin-top: 1rem;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--color-border-dark);
    }

    .timeline-item {
      position: relative;
      padding-bottom: 1.5rem;
    }

    .timeline-item:last-child { padding-bottom: 0; }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -2rem;
      top: 0.25rem;
      width: 14px;
      height: 14px;
      background: var(--color-bg);
      border: 3px solid var(--color-border-dark);
    }

    .timeline-item.done::before {
      background: var(--color-success);
      border-color: var(--color-success);
    }

    .timeline-item.pending::before {
      background: var(--color-accent);
      border-color: var(--color-border-dark);
    }

    .timeline-item.future::before {
      background: var(--color-bg);
      border-color: var(--color-border-dark);
    }

    .timeline-item .label {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .timeline-item .desc {
      color: var(--color-text-muted);
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    /* Step cards */
    .step {
      border-left: 4px solid var(--color-border-dark);
      padding: 1rem 1rem 1rem 1.25rem;
      margin: 1rem 0;
      background: var(--color-bg-alt);
    }

    .step p { margin-top: 0.5rem; }

    /* Links bar */
    .links-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .link-btn {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border: 2px solid var(--color-border-dark);
      border-radius: 0;
      background: var(--color-bg-secondary);
      box-shadow: 3px 3px 0 var(--color-shadow);
      color: var(--color-text);
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      transition: transform 0.1s, box-shadow 0.1s;
    }

    .link-btn:hover {
      text-decoration: none;
      background: var(--color-hover-bg);
      box-shadow: 4px 4px 0 var(--color-shadow);
    }

    .link-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 1px 1px 0 var(--color-shadow);
    }

    /* Footer */
    .footer {
      margin-top: 2rem;
      padding: 1rem 0;
      border-top: 2px solid var(--color-border-dark);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-align: center;
    }

    /* Mono value highlight */
    .mono-val {
      background: var(--color-bg-alt);
      padding: 0.1rem 0.3rem;
      border: 1px solid var(--color-border);
      font-size: 0.8rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container { padding: 1rem; }
      .hero { padding: 1.5rem; }
      .hero h1 { font-size: 1.4rem; }
      .card { padding: 1rem; box-shadow: 4px 4px 0 var(--color-shadow); }
      .video-container { box-shadow: 4px 4px 0 var(--color-shadow); }
      .hero { box-shadow: 4px 4px 0 var(--color-shadow); }
      td, th { padding: 0.5rem; font-size: 0.75rem; }
    }

    @media (max-width: 480px) {
      .container { padding: 0.75rem; }
      .hero h1 { font-size: 1.25rem; }
      .links-bar { flex-direction: column; }
      .link-btn { text-align: center; }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- HERO -->
    <div class="hero">
      <h1>StakeWise V3 Exit Queue</h1>
      <div class="subtitle">
        Chorus One Max Vault &middot; Ethereum Mainnet &middot; 2026-03-08
      </div>
    </div>

    <!-- VIDEO -->
    <div class="video-container">
      <div class="video-label">Screen Recording &mdash; Exit Queue Entry</div>
      <video
        controls
        preload="metadata"
        src="https://dweb.link/ipfs/${IPFS_CID}"
        type="video/quicktime"
      >
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- TX SUMMARY -->
    <div class="card">
      <h2>Transaction Summary</h2>
      <table>
        <tbody>
          <tr>
            <th style="width:140px">Status</th>
            <td><span class="badge badge-success">SUCCESS</span></td>
          </tr>
          <tr>
            <th>TX Hash</th>
            <td>
              <a href="https://etherscan.io/tx/0x7f6de35b604eb62b5db79a9c0b7944e75efc64821b74c08cb4dd0a6ab2122cbc" target="_blank" rel="noopener">
                0x7f6de3...2122cbc
              </a>
            </td>
          </tr>
          <tr>
            <th>Block</th>
            <td>24,614,821</td>
          </tr>
          <tr>
            <th>Timestamp</th>
            <td>2026-03-08 19:25:11 UTC</td>
          </tr>
          <tr>
            <th>Contract</th>
            <td>
              <a href="https://etherscan.io/address/0xe6d8d8ac54461b1c5ed15740eee322043f696c08" target="_blank" rel="noopener">
                StakeWise: Chorus One Max Vault
              </a>
              <br><span style="color: var(--color-text-muted); font-size: 0.75rem;">ERC1967 Proxy &rarr; EthVault @ 0x927a83...e2cc</span>
            </td>
          </tr>
          <tr>
            <th>Method</th>
            <td>
              <span class="badge badge-accent">enterExitQueue</span>
              <span class="mono-val" style="margin-left: 0.5rem">0x8ceab9aa</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DECODED PARAMS -->
    <div class="card">
      <h2>Decoded Parameters</h2>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>shares</strong></td>
            <td>1,479,328,247,112,265,996 <span style="color: var(--color-text-muted)">(~1.4793 ETH)</span></td>
          </tr>
          <tr>
            <td><strong>receiver</strong></td>
            <td>
              <a href="https://etherscan.io/address/0x12be23fe58132ce4128503fa22be93c72de5cbdb" target="_blank" rel="noopener">
                0x12be23...e5cbdb
              </a>
              <span style="color: var(--color-text-muted); font-size: 0.75rem">(same as sender)</span>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Event: ExitQueueEntered</h3>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>owner</strong></td>
            <td>0x12be23fe58132ce4128503fa22be93c72de5cbdb</td>
          </tr>
          <tr>
            <td><strong>receiver</strong></td>
            <td>0x12be23fe58132ce4128503fa22be93c72de5cbdb</td>
          </tr>
          <tr>
            <td><strong>positionTicket</strong></td>
            <td>102566688116739847095594</td>
          </tr>
          <tr>
            <td><strong>shares</strong></td>
            <td>1,479,328,247,112,265,996</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- HOW TO CLAIM -->
    <div class="card">
      <h2>How to Claim Exited Assets</h2>

      <div class="step">
        <span class="badge badge-step">Step 1</span>
        <strong style="margin-left: 0.5rem">Wait for vault to process the exit</strong>
        <p>The vault creates a checkpoint during the next oracle update. Check readiness by calling:</p>
        <div class="code-block"><span class="fn">getExitQueueIndex</span>(<span class="num">102566688116739847095594</span>)
<span class="comment">// Returns -1  &rarr; not yet processed, keep waiting</span>
<span class="comment">// Returns >= 0 &rarr; checkpoint found, proceed to step 2</span></div>
      </div>

      <div class="step">
        <span class="badge badge-step">Step 2</span>
        <strong style="margin-left: 0.5rem">Wait for claim delay</strong>
        <p>After the checkpoint exists, the contract enforces <span class="mono-val">_exitingAssetsClaimDelay</span>. The <span class="mono-val">claimExitedAssets</span> function reverts if called too early. This delay is typically <strong>24 hours</strong> for StakeWise V3 vaults.</p>
      </div>

      <div class="step">
        <span class="badge badge-step">Step 3</span>
        <strong style="margin-left: 0.5rem">Call claimExitedAssets</strong>
        <p>Once the delay has passed:</p>
        <div class="code-block"><span class="fn">claimExitedAssets</span>(
    positionTicket: <span class="num">102566688116739847095594</span>,
    timestamp:      <span class="num">1772997911</span>,
    exitQueueIndex: <span class="comment">&lt;value from getExitQueueIndex&gt;</span>
)</div>
        <p>Preview what you'll receive first (read-only):</p>
        <div class="code-block"><span class="fn">calculateExitedAssets</span>(
    receiver:       <span class="addr">0x12be23fe58132ce4128503fa22be93c72de5cbdb</span>,
    positionTicket: <span class="num">102566688116739847095594</span>,
    timestamp:      <span class="num">1772997911</span>,
    exitQueueIndex: <span class="comment">&lt;value from getExitQueueIndex&gt;</span>
)
<span class="comment">// Returns: (leftTickets, exitedTickets, exitedAssets)</span></div>
      </div>
    </div>

    <!-- TIMELINE -->
    <div class="card">
      <h2>Timeline</h2>
      <div class="timeline">
        <div class="timeline-item done">
          <div class="label">Shares locked in exit queue</div>
          <div class="desc">TX confirmed at block 24,614,821 &mdash; 2026-03-08 19:25 UTC</div>
        </div>
        <div class="timeline-item pending">
          <div class="label">Vault processes exits</div>
          <div class="desc">Hours to days &mdash; next oracle update triggers validator withdrawal</div>
        </div>
        <div class="timeline-item future">
          <div class="label">Claim ETH</div>
          <div class="desc">+24h after checkpoint &mdash; call claimExitedAssets to receive ETH</div>
        </div>
      </div>
    </div>

    <!-- LINKS -->
    <div class="links-bar">
      <a class="link-btn" href="https://etherscan.io/address/0xe6d8d8ac54461b1c5ed15740eee322043f696c08#readProxyContract" target="_blank" rel="noopener">
        Vault Contract &rarr;
      </a>
      <a class="link-btn" href="https://etherscan.io/tx/0x7f6de35b604eb62b5db79a9c0b7944e75efc64821b74c08cb4dd0a6ab2122cbc" target="_blank" rel="noopener">
        Transaction &rarr;
      </a>
      <a class="link-btn" href="https://app.stakewise.io/vaults" target="_blank" rel="noopener">
        StakeWise App &rarr;
      </a>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      Analysis date: 2026-03-08 &middot; StakeWise V3 &middot; Ethereum Mainnet
    </div>

  </div>
</body>
</html>`;

app.get("/", (c) => {
  return c.html(html);
});

export default app;
