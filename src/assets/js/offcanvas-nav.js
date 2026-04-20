(function () {
  'use strict';

  const wrapper = document.getElementById('ocPanelsWrapper');
  if (!wrapper) return;

  const rubricsEl = document.getElementById('rubricsData');
  if (!rubricsEl) return;

  const RUBRICS = JSON.parse(rubricsEl.textContent);

  const ocPanel1        = document.getElementById('ocPanel1');
  const ocPanel2        = document.getElementById('ocPanel2');
  const ocBackArea      = document.getElementById('ocBackArea');
  const ocBackBtn       = document.getElementById('ocBackBtn');
  const ocHeaderTitle   = document.querySelector('.oc-header__title');
  const ocSubParentLink = document.getElementById('ocSubParentLink');
  const ocSubParentTitle= document.getElementById('ocSubParentTitle');
  const ocSubList       = document.getElementById('ocSubList');
  const offcanvasEl     = document.getElementById('offcanvasRubrics');

  let hoverTimer = null;

  function buildSubList(children) {
    return children.map(function (child) {
      if (child.children && child.children.length) {
        var grandItems = child.children.map(function (gc) {
          return '<li><a href="/' + gc.slug + '/" class="oc-sub-link oc-sub-link--grand" data-bs-dismiss="offcanvas">'
            + gc.title + '</a></li>';
        }).join('');
        return '<li class="oc-sub-item oc-sub-item--has-children">'
          + '<a href="/' + child.slug + '/" class="oc-sub-link oc-sub-link--parent" data-bs-dismiss="offcanvas">'
          + '<span>' + child.title + '</span>'
          + '<span class="oc-sub-badge">' + child.children.length + '</span>'
          + '</a>'
          + '<ul class="list-unstyled oc-sub-grandlist">' + grandItems + '</ul>'
          + '</li>';
      }
      return '<li class="oc-sub-item">'
        + '<a href="/' + child.slug + '/" class="oc-sub-link" data-bs-dismiss="offcanvas">' + child.title + '</a>'
        + '</li>';
    }).join('');
  }

  function openSubPanel(idx) {
    var rubric = RUBRICS[idx];
    if (!rubric || !rubric.children) return;

    ocSubParentLink.href        = '/' + rubric.slug + '/';
    ocSubParentTitle.textContent = rubric.title;
    ocSubList.innerHTML          = buildSubList(rubric.children);

    wrapper.classList.add('show-sub');
    ocPanel1.setAttribute('aria-hidden', 'true');
    ocPanel2.setAttribute('aria-hidden', 'false');
    ocBackArea.classList.remove('d-none');
    if (ocHeaderTitle) ocHeaderTitle.classList.add('d-none');

    ocPanel2.querySelector('.oc-panel__scroll').scrollTop = 0;
  }

  function closeSubPanel() {
    wrapper.classList.remove('show-sub');
    ocPanel1.setAttribute('aria-hidden', 'false');
    ocPanel2.setAttribute('aria-hidden', 'true');
    ocBackArea.classList.add('d-none');
    if (ocHeaderTitle) ocHeaderTitle.classList.remove('d-none');
  }

  document.querySelectorAll('.oc-split-row__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openSubPanel(parseInt(this.dataset.rubricIndex, 10));
    });
  });

  if (ocBackBtn) {
    ocBackBtn.addEventListener('click', closeSubPanel);
  }

  if (offcanvasEl) {
    offcanvasEl.addEventListener('hidden.bs.offcanvas', closeSubPanel);
  }

  var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isPointer) {
    document.querySelectorAll('.oc-split-row').forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var idx = parseInt(this.dataset.rubricIndex, 10);
        hoverTimer = setTimeout(function () { openSubPanel(idx); }, 220);
      });
      row.addEventListener('mouseleave', function () {
        clearTimeout(hoverTimer);
      });
    });
  }
})();
