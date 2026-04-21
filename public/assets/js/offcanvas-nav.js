(function () {
  'use strict';

  var rubricsEl = document.getElementById('rubricsData');
  if (!rubricsEl) return;

  var RUBRICS = JSON.parse(rubricsEl.textContent);
  var currentPath = window.location.pathname;

  var offcanvasEl    = document.getElementById('offcanvasRubrics');
  var ocPanel2       = document.getElementById('ocPanel2');
  var ocPanel3       = document.getElementById('ocPanel3');
  var ocSubList      = document.getElementById('ocSubList');
  var ocSubSubList   = document.getElementById('ocSubSubList');
  var ocCloseBtn2    = document.getElementById('ocCloseBtn2');
  var ocCloseBtn3    = document.getElementById('ocCloseBtn3');
  var ocPanel2Title  = document.getElementById('ocPanel2Title');
  var ocPanel3Title  = document.getElementById('ocPanel3Title');
  var ocPanel2Breadcrumb = document.getElementById('ocPanel2Breadcrumb');
  var ocPanel3Breadcrumb = document.getElementById('ocPanel3Breadcrumb');
  var ocPanel2Count  = document.getElementById('ocPanel2Count');
  var ocPanel3Count  = document.getElementById('ocPanel3Count');
  var ocPanel2OpenLink = document.getElementById('ocPanel2OpenLink');
  var ocPanel3OpenLink = document.getElementById('ocPanel3OpenLink');
  var ocPanel2Scroll = document.getElementById('ocPanel2Scroll');

  var hoverTimer = null;
  var currentL1Toggle = null;
  var currentParentRubric = null;

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function pluralRu(n, forms) {
    var mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return n + '\u00a0' + forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return n + '\u00a0' + forms[1];
    return n + '\u00a0' + forms[2];
  }

  function isActive(href) {
    return currentPath === href || currentPath.startsWith(href);
  }

  function focusFirstIn(panel) {
    var focusable = panel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) {
      setTimeout(function () { focusable[0].focus(); }, 50);
    }
  }

  function scrollActiveIntoView(listEl) {
    var active = listEl.querySelector('.active');
    if (active) {
      setTimeout(function () {
        active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 120);
    }
  }

  function buildLevel2Items(children, parentSlug) {
    return children.map(function (child) {
      var href = '/' + parentSlug + '/' + child.slug + '/';
      var active = isActive(href);
      var activeAttr = active ? ' class="oc-split-row__link oc-dismiss-all active" aria-current="page"' : ' class="oc-split-row__link oc-dismiss-all"';
      var activeLeafAttr = active ? ' class="oc-split-row__link oc-split-row__link--leaf oc-dismiss-all active" aria-current="page"' : ' class="oc-split-row__link oc-split-row__link--leaf oc-dismiss-all"';

      if (child.children && child.children.length) {
        return '<li class="oc-sub-item' + (active ? ' is-active' : '') + '">'
          + '<div class="oc-split-row' + (active ? ' is-active' : '') + '" data-l3-href="' + esc(href) + '" data-l3-json="' + esc(JSON.stringify(child)) + '">'
          + '<a href="' + esc(href) + '"' + activeAttr + '>' + esc(child.title) + '</a>'
          + '<button class="oc-split-row__toggle oc-open-l3" type="button"'
          + ' aria-label="Открыть подразделы: ' + esc(child.title) + '"'
          + ' aria-expanded="false">'
          + '<i class="bi bi-chevron-right" aria-hidden="true"></i>'
          + '</button>'
          + '</div>'
          + '</li>';
      }
      return '<li class="oc-sub-item' + (active ? ' is-active' : '') + '">'
        + '<a href="' + esc(href) + '"' + activeLeafAttr + '>' + esc(child.title) + '</a>'
        + '</li>';
    }).join('');
  }

  function buildLevel3Items(children, parentHref) {
    return children.map(function (gc) {
      var href = parentHref + gc.slug + '/';
      var active = isActive(href);
      var activeAttr = active
        ? ' class="oc-split-row__link oc-split-row__link--leaf oc-dismiss-all active" aria-current="page"'
        : ' class="oc-split-row__link oc-split-row__link--leaf oc-dismiss-all"';
      return '<li class="oc-sub-item' + (active ? ' is-active' : '') + '">'
        + '<a href="' + esc(href) + '"' + activeAttr + '>' + esc(gc.title) + '</a>'
        + '</li>';
    }).join('');
  }

  function openPanel2(rubric, toggleBtn, silent) {
    closePanel3();
    currentParentRubric = rubric;

    if (ocPanel2Breadcrumb) ocPanel2Breadcrumb.textContent = 'Разделы сайта /';
    if (ocPanel2Title)      ocPanel2Title.textContent      = rubric.title;
    if (ocPanel2Count && rubric.children) {
      ocPanel2Count.textContent = pluralRu(rubric.children.length, ['раздел', 'раздела', 'разделов']);
    }
    if (ocPanel2OpenLink) ocPanel2OpenLink.href = '/' + rubric.slug + '/';
    if (ocSubList) ocSubList.innerHTML = buildLevel2Items(rubric.children, rubric.slug);

    ocSubList.querySelectorAll('.oc-open-l3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row   = btn.closest('.oc-split-row');
        var child = JSON.parse(row.dataset.l3Json);
        var href  = row.dataset.l3Href;
        openPanel3(child, href, btn, rubric);
      });
    });

    ocSubList.querySelectorAll('.oc-dismiss-all').forEach(function (el) {
      el.addEventListener('click', closeAll);
    });

    if (ocPanel2OpenLink) ocPanel2OpenLink.addEventListener('click', closeAll);

    var l2isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (l2isPointer) {
      ocSubList.querySelectorAll('.oc-split-row').forEach(function (row) {
        row.addEventListener('mouseenter', function () {
          var child = JSON.parse(row.dataset.l3Json || 'null');
          var href  = row.dataset.l3Href;
          if (child && child.children) {
            hoverTimer = setTimeout(function () {
              openPanel3(child, href, row.querySelector('.oc-open-l3'), rubric);
            }, 220);
          }
        });
        row.addEventListener('mouseleave', function () { clearTimeout(hoverTimer); });
      });
    }

    if (currentL1Toggle && currentL1Toggle !== toggleBtn) {
      currentL1Toggle.setAttribute('aria-expanded', 'false');
    }
    currentL1Toggle = toggleBtn || null;
    if (currentL1Toggle) currentL1Toggle.setAttribute('aria-expanded', 'true');

    ocPanel2.classList.add('is-open');
    ocPanel2.setAttribute('aria-hidden', 'false');
    if (ocPanel2Scroll) ocPanel2Scroll.scrollTop = 0;

    if (!silent) {
      focusFirstIn(ocPanel2);
    } else {
      scrollActiveIntoView(ocSubList);
    }
  }

  function closePanel2() {
    closePanel3();
    ocPanel2.classList.remove('is-open');
    ocPanel2.setAttribute('aria-hidden', 'true');
    if (currentL1Toggle) {
      currentL1Toggle.setAttribute('aria-expanded', 'false');
      currentL1Toggle = null;
    }
    currentParentRubric = null;
  }

  function openPanel3(child, parentHref, toggleBtn, parentRubric, silent) {
    var parent = parentRubric || currentParentRubric;

    if (ocPanel3Breadcrumb) {
      ocPanel3Breadcrumb.textContent = (parent ? parent.title + ' /' : 'Разделы сайта /');
    }
    if (ocPanel3Title) ocPanel3Title.textContent = child.title;
    if (ocPanel3Count && child.children) {
      ocPanel3Count.textContent = pluralRu(child.children.length, ['раздел', 'раздела', 'разделов']);
    }
    if (ocPanel3OpenLink) ocPanel3OpenLink.href = parentHref;
    if (ocSubSubList) {
      ocSubSubList.innerHTML = buildLevel3Items(child.children, parentHref);
      ocSubSubList.querySelectorAll('.oc-dismiss-all').forEach(function (el) {
        el.addEventListener('click', closeAll);
      });
    }
    if (ocPanel3OpenLink) ocPanel3OpenLink.addEventListener('click', closeAll);

    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');

    ocPanel3.classList.add('is-open');
    ocPanel3.setAttribute('aria-hidden', 'false');
    var p3scroll = ocPanel3.querySelector('.oc-panel__scroll');
    if (p3scroll) p3scroll.scrollTop = 0;

    if (!silent) {
      focusFirstIn(ocPanel3);
    } else {
      scrollActiveIntoView(ocSubSubList);
    }
  }

  function closePanel3() {
    ocPanel3.classList.remove('is-open');
    ocPanel3.setAttribute('aria-hidden', 'true');
    if (ocSubList) {
      ocSubList.querySelectorAll('.oc-open-l3[aria-expanded="true"]').forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function closeAll() {
    closePanel3();
    closePanel2();
    if (offcanvasEl) {
      var bsOc = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOc) bsOc.hide();
    }
  }

  // ─── Автовыделение: определяем текущую позицию в иерархии ───
  function autoHighlight() {
    for (var i = 0; i < RUBRICS.length; i++) {
      var rubric = RUBRICS[i];
      var l1href = '/' + rubric.slug + '/';
      if (!currentPath.startsWith(l1href)) continue;
      if (!rubric.children || !rubric.children.length) continue;

      var toggleBtn = document.querySelector('.oc-split-row__toggle[data-rubric-index="' + i + '"]');
      openPanel2(rubric, toggleBtn, true /* silent */);

      // Проверяем 2-й уровень
      for (var j = 0; j < rubric.children.length; j++) {
        var child = rubric.children[j];
        var l2href = l1href + child.slug + '/';
        if (!currentPath.startsWith(l2href)) continue;
        if (!child.children || !child.children.length) break;

        // Нашли активный L2 — открываем панель 3
        var l2toggle = ocSubList
          ? ocSubList.querySelectorAll('.oc-open-l3')[j] || null
          : null;
        openPanel3(child, l2href, l2toggle, rubric, true /* silent */);
        break;
      }
      break;
    }
  }

  // ─── Привязка кнопок L1 ───
  document.querySelectorAll('.oc-split-row__toggle[data-rubric-index]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx    = parseInt(this.dataset.rubricIndex, 10);
      var rubric = RUBRICS[idx];
      if (rubric && rubric.children) openPanel2(rubric, btn);
    });
  });

  document.querySelectorAll('#ocPanel1 .oc-dismiss-all').forEach(function (el) {
    el.addEventListener('click', closeAll);
  });

  if (ocCloseBtn2) ocCloseBtn2.addEventListener('click', closePanel2);
  if (ocCloseBtn3) ocCloseBtn3.addEventListener('click', closePanel3);

  // ─── Автовыделение при открытии offcanvas ───
  if (offcanvasEl) {
    offcanvasEl.addEventListener('show.bs.offcanvas', function () {
      autoHighlight();
    });
    offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
      closePanel3();
      closePanel2();
    });
  }

  // ─── Escape закрывает самую глубокую панель ───
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (ocPanel3.classList.contains('is-open')) {
        e.stopPropagation();
        closePanel3();
        focusFirstIn(ocPanel2);
      } else if (ocPanel2.classList.contains('is-open')) {
        e.stopPropagation();
        closePanel2();
        if (offcanvasEl) {
          var first = offcanvasEl.querySelectorAll('a[href], button:not([disabled]), input');
          if (first.length) first[0].focus();
        }
      }
    }
  });

  // ─── Hover-открытие на десктопе ───
  var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isPointer) {
    document.querySelectorAll('.oc-split-row[data-rubric-index]').forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var idx    = parseInt(this.dataset.rubricIndex, 10);
        var rubric = RUBRICS[idx];
        var toggle = row.querySelector('.oc-split-row__toggle');
        if (rubric && rubric.children) {
          hoverTimer = setTimeout(function () { openPanel2(rubric, toggle); }, 220);
        }
      });
      row.addEventListener('mouseleave', function () { clearTimeout(hoverTimer); });
    });
  }
})();
