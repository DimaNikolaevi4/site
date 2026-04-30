---
title: Студентам и родителям
layout: layouts/page-full.njk
description: Раздел «Студентам и родителям» ГБПОУ РО «Сальский индустриальный техникум» — расписание, библиотека, образовательные ресурсы, информация для родителей, приказы о зачислении.
permalink: /studentam-i-roditeljam/
section: studentam-i-roditeljam
sectionTitle: Студентам и родителям
suppressSubrubrics: true
---

# Студентам и родителям

В разделе собрана практическая информация для обучающихся техникума и их родителей: учебное расписание, доступ к библиотеке и образовательным ресурсам, материалы для родителей и приказы о зачислении.

{% set newsMode = 'razdel' %}
{% set newsTitle = "Подразделы" %}
{% set excludeUrls = none %}
{% set newsCards = [
  { url: "/studentam-i-roditeljam/raspisanie/", emoji: "🗓️", title: "Расписание занятий", description: "Актуальное расписание учебных групп по корпусам и сменам." },
  { url: "/studentam-i-roditeljam/biblioteka/", emoji: "📚", title: "Библиотека", description: "Фонд библиотеки, электронные каталоги, режим работы." },
  { url: "/studentam-i-roditeljam/resursy/", emoji: "🌐", title: "Образовательные ресурсы", description: "Электронно-образовательные ресурсы и сервисы для обучающихся." },
  { url: "/studentam-i-roditeljam/roditeljam/", emoji: "👨‍👩‍👧", title: "Родителям", description: "Материалы для родителей: правила, рекомендации, психологическая помощь." },
  { url: "/studentam-i-roditeljam/prikaz-zachislenie/", emoji: "📜", title: "Приказы о зачислении", description: "Приказы о зачислении в число обучающихся техникума." }
] %}
{% include "components/news.njk" %}
