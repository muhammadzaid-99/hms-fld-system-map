const architecture = {
  central: {
    title: 'Central Control Plane',
    summary:
      'Coordinates trust, federation policy, metadata, and central operations across all connected hospitals.',
    components: [
      {
        id: 'hospital-registration',
        name: 'Hospital Registration Portal',
        type: 'Portal',
        tooltip: 'Onboards hospital nodes and provisions credentials for secure federation onboarding.',
        links: [{ label: 'Open', url: 'https://central.healthlake.tech/hospital/login' }],
      },
      {
        id: 'admin-portal',
        name: 'Admin Portal',
        type: 'Portal',
        tooltip: 'Tracks federation health, registered nodes, operational status, and governance activity.',
        links: [{ label: 'Open', url: 'https://central.healthlake.tech' }],
      },
      {
        id: 'central-backend',
        name: 'Central Backend',
        type: 'Service',
        tooltip: 'Core API and orchestration layer for auth, access workflow, and request lifecycle.',
      },
      {
        id: 'nessie-catalog',
        name: 'Nessie Catalog',
        type: 'Metadata',
        tooltip: 'Git-like Apache Iceberg metadata catalog used to coordinate federated table definitions.',
      },
      {
        id: 'trino-engine',
        name: 'Trino Engine',
        type: 'Query',
        tooltip: 'Distributed SQL engine that executes federated queries over hospital data lakes.',
      },
      {
        id: 'central-postgres',
        name: 'Central PostgreSQL',
        type: 'Database',
        tooltip: 'Stores user accounts, request states, and central audit records.',
      },
    ],
    guide: [
      {
        title: '1. Onboard and Trust',
        detail: 'Start with hospital onboarding and credential provisioning before any cross-institution operation.',
        focus: ['hospital-registration', 'central-backend'],
      },
      {
        title: '2. Coordinate Metadata and Queries',
        detail: 'Nessie and Trino work together so queries know what data exists and where it can be read.',
        focus: ['nessie-catalog', 'trino-engine'],
      },
      {
        title: '3. Govern and Monitor',
        detail: 'Admin and central persistence layers enforce visibility, compliance, and operational accountability.',
        focus: ['admin-portal', 'central-postgres'],
      },
    ],
  },
  hospital: {
    title: 'Hospital Edge Layer',
    summary:
      'Identical node blueprint deployed at each hospital. Choose any hospital card to inspect the same internal stack.',
    hospitals: [
      { id: 'h1', label: 'Hospital 1' },
      { id: 'h2', label: 'Hospital 2' },
      { id: 'h3', label: 'Hospital 3' },
      { id: 'hn', label: 'Hospital n' },
    ],
    sharedComponents: [
      {
        id: 'node-console',
        name: 'Node Console',
        type: 'Portal',
        tooltip: 'Manages ETL jobs, federation sync, and local operational controls.',
        portalType: 'console',
      },
      {
        id: 'clinical-admin',
        name: 'Clinical Admin',
        type: 'Portal',
        tooltip: 'Administrative workspace for users, roles, and local hospital configuration.',
        portalType: 'admin',
      },
      {
        id: 'clinical-staff',
        name: 'Clinical Staff Portal',
        type: 'Portal',
        tooltip: 'Operational interface for doctors, patients, receptionists, pathologists, and lab staff.',
        portalType: 'portal',
      },
      {
        id: 'etl-server',
        name: 'ETL Server',
        type: 'Pipeline',
        tooltip: 'Transforms and prepares local clinical records for federated lake storage.',
      },
      {
        id: 'minio-lake',
        name: 'MinIO Data Lake',
        type: 'Storage',
        tooltip: 'Hospital-local S3-compatible object store holding Iceberg data partitions.',
      },
      {
        id: 'clinical-db',
        name: 'Clinical PostgreSQL',
        type: 'Database',
        tooltip: 'Primary transactional data store for local checkups, tests, and clinical activity.',
      },
      {
        id: 'ai-services',
        name: 'Clinical AI Services',
        type: 'AI',
        tooltip: 'AI-assisted services such as transcription, extraction, and summarization workflows.',
      },
    ],
    guide: [
      {
        title: '1. Operate Locally',
        detail: 'Each hospital has the same portal surface to run operations independently.',
        focus: ['node-console', 'clinical-admin', 'clinical-staff'],
      },
      {
        title: '2. Prepare and Publish Data',
        detail: 'Clinical transactions become curated lake data through ETL and object storage.',
        focus: ['clinical-db', 'etl-server', 'minio-lake'],
      },
      {
        title: '3. Augment Clinical Work',
        detail: 'AI services extend hospital workflows while preserving node-level ownership.',
        focus: ['clinical-staff', 'ai-services'],
      },
    ],
  },
  requester: {
    title: 'Requester and Analytics Layer',
    summary:
      'Approved researchers discover datasets, request scoped access, execute federated SQL, and interpret insights.',
    components: [
      {
        id: 'requester-platform',
        name: 'Requester Platform',
        type: 'Portal',
        tooltip: 'Dataset discovery, request submission, and federated query workspace for researchers.',
        links: [{ label: 'Open', url: 'https://platform.healthlake.tech' }],
      },
      {
        id: 'access-workflow',
        name: 'Access Approval Workflow',
        type: 'Workflow',
        tooltip: 'Routes requests to hospital admins, enforces scoped approvals, and issues temporary credentials.',
      },
      {
        id: 'federated-sql',
        name: 'Federated SQL Execution',
        type: 'Query',
        tooltip: 'Runs distributed SQL via Trino using central metadata and hospital object storage.',
      },
      {
        id: 'analytics-engine',
        name: 'Analytics Engine',
        type: 'AI',
        tooltip: 'Session-isolated analytics for KPIs, trends, anomaly detection, and exploratory discovery.',
      },
      {
        id: 'model-hub',
        name: 'Plug-and-Play Model Hub',
        type: 'AI',
        tooltip: 'Manifest-driven model routing for dynamic inference containers with consistent outputs.',
      },
    ],
    guide: [
      {
        title: '1. Discover and Request',
        detail: 'Researchers start by browsing assets and submitting governed access requests.',
        focus: ['requester-platform', 'access-workflow'],
      },
      {
        title: '2. Execute Federation',
        detail: 'Approved requests trigger distributed query execution without centralizing raw hospital data.',
        focus: ['federated-sql'],
      },
      {
        title: '3. Interpret Outputs',
        detail: 'Analytics and model services convert query results into decision-ready insights.',
        focus: ['analytics-engine', 'model-hub'],
      },
    ],
  },
};

const state = {
  currentNodeId: null,
  activeGuideIndex: 0,
  selectedHospitalId: 'h1',
};

const topButtons = Array.from(document.querySelectorAll('.top-node'));
const focusView = document.getElementById('focus-view');
const backBtn = document.getElementById('back-btn');
const focusTitle = document.getElementById('focus-title');
const focusSummary = document.getElementById('focus-summary');
const focusBody = document.getElementById('focus-body');
const focusGuide = document.getElementById('focus-guide');
const tooltipEl = document.getElementById('tooltip');

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setTopActive(nodeId) {
  topButtons.forEach((button) => {
    const active = button.dataset.node === nodeId;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function getHospitalPortals(hospitalId) {
  if (hospitalId === 'hn') {
    return null;
  }

  return {
    console: `https://console.${hospitalId}.healthlake.tech`,
    admin: `https://admin.${hospitalId}.healthlake.tech`,
    portal: `https://portal.${hospitalId}.healthlake.tech`,
  };
}

function componentLinksMarkup(links) {
  if (!links || links.length === 0) {
    return '';
  }

  const chips = links
    .map((link) => {
      if (link.disabled) {
        return `<span class="mini-link is-disabled">${escapeHtml(link.label)}</span>`;
      }

      return `<a class="mini-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        link.label
      )} -></a>`;
    })
    .join('');

  return `<div class="mini-links">${chips}</div>`;
}

function renderComponentCards(components) {
  return components
    .map((component, index) => {
      return `<article class="component-card" data-component-id="${escapeHtml(component.id)}" tabindex="0" data-tooltip="${escapeHtml(
        component.tooltip
      )}" style="--delay:${index * 60}ms">
        <h3>${escapeHtml(component.name)}</h3>
        <div class="component-meta">
          <span class="info-pill">${escapeHtml(component.type)}</span>
          ${componentLinksMarkup(component.links)}
        </div>
      </article>`;
    })
    .join('');
}

function renderGenericNode(node) {
  focusBody.innerHTML = `<div class="focus-grid">${renderComponentCards(node.components)}</div>`;
  bindTooltipTargets(focusBody);
}

function renderHospitalNode(node) {
  const selector = node.hospitals
    .map((hospital) => {
      const activeClass = hospital.id === state.selectedHospitalId ? 'is-active' : '';
      return `<button class="hospital-btn ${activeClass}" type="button" data-hospital-id="${escapeHtml(hospital.id)}" data-tooltip="${escapeHtml(
        `Inspect ${hospital.label} using the same edge blueprint.`
      )}">${escapeHtml(hospital.label)}</button>`;
    })
    .join('');

  focusBody.innerHTML = `
    <div class="hospital-strip">
      <h3>Hospital Edge Selector</h3>
      <p id="hospital-context">All hospitals follow the same internal structure. Select a hospital to view that instance.</p>
      <div class="hospital-row" id="hospital-row">${selector}</div>
    </div>
    <div class="focus-grid" id="hospital-components"></div>
  `;

  const row = document.getElementById('hospital-row');
  if (row) {
    row.addEventListener('click', (event) => {
      const button = event.target.closest('.hospital-btn');
      if (!button) {
        return;
      }

      state.selectedHospitalId = button.dataset.hospitalId || 'h1';
      renderHospitalComponents(node);
      syncHospitalButtons();
    });
  }

  syncHospitalButtons();
  renderHospitalComponents(node);
  bindTooltipTargets(focusBody);
}

function syncHospitalButtons() {
  const buttons = focusBody.querySelectorAll('.hospital-btn');
  buttons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.hospitalId === state.selectedHospitalId);
  });
}

function resolveHospitalLinks(component) {
  if (!component.portalType) {
    return component.links || [];
  }

  const portals = getHospitalPortals(state.selectedHospitalId);
  if (!portals) {
    return [{ label: 'Template', disabled: true }];
  }

  return [{ label: 'Open', url: portals[component.portalType] }];
}

function renderHospitalComponents(node) {
  const selectedHospital = node.hospitals.find((hospital) => hospital.id === state.selectedHospitalId) || node.hospitals[0];
  const components = node.sharedComponents.map((component) => ({
    ...component,
    links: resolveHospitalLinks(component),
  }));

  const container = document.getElementById('hospital-components');
  if (container) {
    container.innerHTML = renderComponentCards(components);
    bindTooltipTargets(container);
  }

  const context = document.getElementById('hospital-context');
  if (context) {
    context.textContent = `${selectedHospital.label} selected. Internal components remain consistent across the edge layer.`;
  }

  focusSummary.textContent = `${node.summary} Active node: ${selectedHospital.label}.`;
  applyGuideHighlight();
}

function renderGuide(node) {
  const steps = node.guide || [];
  if (steps.length === 0) {
    focusGuide.innerHTML = '';
    return;
  }

  const stepButtons = steps
    .map((step, index) => {
      const activeClass = index === state.activeGuideIndex ? 'is-active' : '';
      return `<button class="guide-step ${activeClass}" type="button" data-guide-index="${index}">${escapeHtml(step.title)}</button>`;
    })
    .join('');

  focusGuide.innerHTML = `
    <div class="guide-head">
      <h3>Interactive Walkthrough</h3>
      <p>Use these steps to understand system behavior in sequence.</p>
    </div>
    <div class="guide-steps" id="guide-steps">${stepButtons}</div>
    <div class="guide-detail" id="guide-detail"></div>
  `;

  const guideSteps = document.getElementById('guide-steps');
  if (guideSteps) {
    guideSteps.addEventListener('click', (event) => {
      const button = event.target.closest('.guide-step');
      if (!button) {
        return;
      }

      const nextIndex = Number(button.dataset.guideIndex);
      if (Number.isNaN(nextIndex)) {
        return;
      }

      state.activeGuideIndex = nextIndex;
      updateGuideUI();
      applyGuideHighlight();
    });
  }

  updateGuideUI();
}

function updateGuideUI() {
  const node = architecture[state.currentNodeId];
  if (!node || !node.guide || node.guide.length === 0) {
    return;
  }

  const steps = Array.from(focusGuide.querySelectorAll('.guide-step'));
  steps.forEach((stepButton, index) => {
    stepButton.classList.toggle('is-active', index === state.activeGuideIndex);
  });

  const activeStep = node.guide[state.activeGuideIndex] || node.guide[0];
  const detail = document.getElementById('guide-detail');
  if (detail) {
    detail.textContent = activeStep.detail;
  }
}

function applyGuideHighlight() {
  const node = architecture[state.currentNodeId];
  if (!node || !node.guide || node.guide.length === 0) {
    return;
  }

  const activeStep = node.guide[state.activeGuideIndex] || node.guide[0];
  const focusIds = activeStep.focus || [];
  const cards = focusBody.querySelectorAll('.component-card');

  cards.forEach((card) => {
    const componentId = card.getAttribute('data-component-id') || '';
    const match = focusIds.includes(componentId);
    card.classList.toggle('is-highlight', match);
    card.classList.toggle('is-dim', !match && focusIds.length > 0);
  });
}

function renderFocusView() {
  const node = architecture[state.currentNodeId];
  if (!node) {
    return;
  }

  focusTitle.textContent = node.title;
  focusSummary.textContent = node.summary;

  if (state.currentNodeId === 'hospital') {
    renderHospitalNode(node);
  } else {
    renderGenericNode(node);
  }

  renderGuide(node);
  applyGuideHighlight();
}

function openFocus(nodeId) {
  state.currentNodeId = nodeId;
  state.activeGuideIndex = 0;

  setTopActive(nodeId);
  renderFocusView();

  focusView.classList.add('is-open');
  focusView.setAttribute('aria-hidden', 'false');
  document.body.classList.add('focus-open');
}

function closeFocus() {
  focusView.classList.remove('is-open');
  focusView.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('focus-open');
  hideTooltip();
}

function setTooltipPosition(clientX, clientY) {
  const padding = 12;
  const rect = tooltipEl.getBoundingClientRect();
  let left = clientX + 14;
  let top = clientY + 16;

  if (left + rect.width > window.innerWidth - padding) {
    left = clientX - rect.width - 14;
  }

  if (top + rect.height > window.innerHeight - padding) {
    top = clientY - rect.height - 16;
  }

  tooltipEl.style.left = `${Math.max(padding, left)}px`;
  tooltipEl.style.top = `${Math.max(padding, top)}px`;
}

function showTooltip(text) {
  if (!text) {
    return;
  }

  tooltipEl.textContent = text;
  tooltipEl.setAttribute('aria-hidden', 'false');
  tooltipEl.classList.add('is-visible');
}

function hideTooltip() {
  tooltipEl.classList.remove('is-visible');
  tooltipEl.setAttribute('aria-hidden', 'true');
}

function bindTooltipTargets(scope) {
  const targets = scope.querySelectorAll('[data-tooltip]');

  targets.forEach((target) => {
    if (target.dataset.tooltipBound === '1') {
      return;
    }

    target.dataset.tooltipBound = '1';

    target.addEventListener('mouseenter', (event) => {
      showTooltip(event.currentTarget.getAttribute('data-tooltip') || '');
    });

    target.addEventListener('mousemove', (event) => {
      setTooltipPosition(event.clientX, event.clientY);
    });

    target.addEventListener('mouseleave', () => {
      hideTooltip();
    });

    target.addEventListener('focus', (event) => {
      const tooltipText = event.currentTarget.getAttribute('data-tooltip') || '';
      showTooltip(tooltipText);

      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition(rect.left + rect.width / 2, rect.bottom + 8);
    });

    target.addEventListener('blur', () => {
      hideTooltip();
    });
  });
}

topButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openFocus(button.dataset.node || 'central');
  });
});

backBtn.addEventListener('click', () => {
  closeFocus();
});

focusView.addEventListener('click', (event) => {
  if (event.target === focusView) {
    closeFocus();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && focusView.classList.contains('is-open')) {
    closeFocus();
  }
});

bindTooltipTargets(document);
