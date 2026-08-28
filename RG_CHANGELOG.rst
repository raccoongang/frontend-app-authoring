RG Changelog
############

All notable changes to this project will be documented in this file.

The format is based on `Keep a Changelog <https://keepachangelog.com/en/1.0.0/>`_,
and this project adheres to customized Semantic Versioning e.g.: `verawood-rg.1`

[Unreleased]
************

Fixed:
======
* New dropdown problems no longer start with ``undefined`` in every answer field (VERA-39).
  Drop this patch once `#3216 <https://github.com/openedx/frontend-app-authoring/pull/3216>`_ and `#3217 <https://github.com/openedx/frontend-app-authoring/pull/3217>`_ are merged upstream.

Added:
======
* ``TextEditorPluginSlot`` and ``ProblemEditorPluginSlot`` so plugins can inject UI into the HTML and Problem editors (AILab-146)
* Apply dark-theme content styles to the TinyMCE editing surface when the shared ``theme-variant`` cookie is ``dark`` (ENG-63)

Removed:
========
* codecov CI action, and the ``coverage`` job left with nothing to do — the fork has no codecov project, so the step failed every run (VERA-6)
