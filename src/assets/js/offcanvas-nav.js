(function () {
  'use strict';

  var rubricsEl = document.getElementById('rubricsData');
  if (!rubricsEl) return;

  var RUBRICS = JSON.parse(rubricsEl.textContent);

  var offcanvasEl  = document.getElementById('offcanvasRubrics');
  var ocPanel2     = document.getElementById('ocPanel2');
  var ocPanel3     = document.getElementById('ocPanel3');
  var ocSubList    = document.getElementById('ocSubList');
  var ocSubSubList = document.getElementById('ocSubSubList');
  var ocCloseBtn2  = document.getElementById('ocCloseBtn2');
  var ocCloseBtn3  = document.getElementById('ocCloseBtn3');
  var ocPanel2Title = document.getElementById('ocPanel2Title');
  var ocPanel3Title = document.getElementById('ocPanel3Title');

  var hoverTimer = null;

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function buildLevel2Items(children, parentSlug) {
    return children.map(function (child) {
      var href = '/' + parentSlug + '/' + child.slug + '/';
      if (child.children && child.children.length) {
        return '<li class="oc-sub-item">'
          + '<div class="oc-split-row" data-l3-href="' + esc(href) + '" data-l3-json="' + esc(JSON.stringify(child)) + '">'
          + '<a href="' + esc(href) + '" class="oc-split-row__link oc-dismiss-all">' + esc(child.title) + '</a>'
          + '<button class="oc-split-row__toggle oc-open-l3" type="button" aria-label="Открыть подразделы: ' + esc(child.title) + '">'
          + '<i class="bi bi-chevron-right" aria-hidden="true"></i>'
          + '</button>'
          + '</div>'
          + '</li>';
      }
      return '<li class="oc-sub-item">'
        + '<a href="' + esc(href) + '" class="oc-split-row__link oc-split-row__link--leaf oc-dismiss-all">' + esc(child.title) + '</a>'
        + '</li>';
    }).join('');
  }

  function buildLevel3Items(children, parentHref) {
    return children.map(function (gc) {
      var href = parentHref + gc.slug + '/';
      return '<li class="oc-sub-item">'
        + '<a href="' + esc(href) + '" class="oc-split-row__link oc-split-row__link--leaf oc-dismiss-all">' + esc(gc.title) + '</a>'
        + '</li>';
    }).join('');
  }

  function openPanel2(rubric) {
    closePanel3();

    ocPanel2Title.textContent = rubric.title;
    ocSubList.innerHTML       = buildLevel2Items(rubric.children, rubric.slug);

    ocSubList.querySelectorAll('.oc-open-l3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row   = btn.closest('.oc-split-row');
        var child = JSON.parse(row.dataset.l3Json);
        var href  = row.dataset.l3Href;
        openPanel3(child, href);
      });
    });

    ocSubList.querySelectorAll('.oc-dismiss-all').forEach(function (el) {
      el.addEventListener('click', closeAll);
    });

    var l2isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (l2isPointer) {
      ocSubList.querySelectorAll('.oc-split-row').forEach(function (row) {
        row.addEventListener('mouseenter', function () {
          var child = JSON.parse(row.dataset.l3Json || 'null');
          var href  = row.dataset.l3Href;
          if (child && child.children) {
            hoverTimer = setTimeout(function () { openPanel3(child, href); }, 220);
          }
        });
        row.addEventListener('mouseleave', function () {
          clearTimeout(hoverTimer);
        });
      });
    }

    ocPanel2.classList.add('is-open');
    ocPanel2.setAttribute('aria-hidden', 'false');
    ocPanel2.querySelector('.oc-panel__scroll').scrollTop = 0;
  }

  function closePanel2() {
    closePanel3();
    ocPanel2.classList.remove('is-open');
    ocPanel2.setAttribute('aria-hidden', 'true');
  }

  function openPanel3(child, parentHref) {
    ocPanel3Title.textContent = child.title;
    ocSubSubList.innerHTML    = buildLevel3Items(child.children, parentHref);

    ocSubSubList.querySelectorAll('.oc-dismiss-all').forEach(function (el) {
      el.addEventListener('click', closeAll);
    });

    ocPanel3.classList.add('is-open');
    ocPanel3.setAttribute('aria-hidden', 'false');
    ocPanel3.querySelector('.oc-panel__scroll').scrollTop = 0;
  }

  function closePanel3() {
    ocPanel3.classList.remove('is-open');
    ocPanel3.setAttribute('aria-hidden', 'true');
  }

  function closeAll() {
    closePanel3();
    closePanel2();
    if (offcanvasEl) {
      var bsOc = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOc) bsOc.hide();
    }
  }

  document.querySelectorAll('.oc-split-row__toggle[data-rubric-index]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx    = parseInt(this.dataset.rubricIndex, 10);
      var rubric = RUBRICS[idx];
      if (rubric && rubric.children) openPanel2(rubric);
    });
  });

  document.querySelectorAll('#ocPanel1 .oc-dismiss-all').forEach(function (el) {
    el.addEventListener('click', closeAll);
  });

  if (ocCloseBtn2) ocCloseBtn2.addEventListener('click', closePanel2);
  if (ocCloseBtn3) ocCloseBtn3.addEventListener('click', closePanel3);

  if (offcanvasEl) {
    offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
      closePanel3();
      closePanel2();
    });
  }

  var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isPointer) {
    document.querySelectorAll('.oc-split-row[data-rubric-index]').forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var idx    = parseInt(this.dataset.rubricIndex, 10);
        var rubric = RUBRICS[idx];
        if (rubric && rubric.children) {
          hoverTimer = setTimeout(function () { openPanel2(rubric); }, 220);
        }
      });
      row.addEventListener('mouseleave', function () {
        clearTimeout(hoverTimer);
      });
    });
  }
})();
