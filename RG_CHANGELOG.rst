RG Changelog
############

All notable changes to this project will be documented in this file.

The format is based on `Keep a Changelog <https://keepachangelog.com/en/1.0.0/>`_,
and this project adheres to customized Semantic Versioning e.g.: `verawood-rg.1`

[Unreleased]
************

Changed:
========
* Rebased onto ``release/verawood.2``
* Backported course-scoped AuthZ permission checks from upstream master, `#3151 <https://github.com/openedx/frontend-app-authoring/pull/3151>`_. Drop once a Verawood release includes it.

Fixed:
======
* Show a taken library ID as an error under the Library ID field (TEA-304)
* Grading page: block saving invalid values, stop re-sending a failed save (CC-163)
* Course outline: dragging into a collapsed section or subsection (TEA-402)
* Open the Taxonomies page in the top window from the iframe tags drawer (TEA-403)

Added:
======
* ``TextEditorPluginSlot`` and ``ProblemEditorPluginSlot`` so plugins can inject UI into the HTML and Problem editors (AILab-146)
* Apply dark-theme content styles to the TinyMCE editing surface when the shared ``theme-variant`` cookie is ``dark`` (ENG-63)

Removed:
========
* codecov CI action, and the ``coverage`` job left with nothing to do — the fork has no codecov project, so the step failed every run (VERA-6)
