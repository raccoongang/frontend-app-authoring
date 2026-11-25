RG Changelog
############

All notable changes to this project will be documented in this file.

The format is based on `Keep a Changelog <https://keepachangelog.com/en/1.0.0/>`_,
and this project adheres to customized Semantic Versioning e.g.: `teak-rg.1`

[Unreleased]
************

[release/teak-rg.6] - 2026-11-25
********************************

Fixed:
======
* Show the "library ID already taken" error under the Library ID field when creating a library (TEA-304)
* Fix field validation on the Grading page and stop the save error loop (CC-163)
* Let authors drag items into collapsed blocks in the course outline (TEA-402)
* Open the taxonomies page in the top window when its link is clicked in the tags drawer (TEA-403)

[release/teak-rg.5] - 2026-09-10
================================

Added:
======
* Apply dark-theme content styles to the TinyMCE editing surface when the shared ``theme-variant`` cookie is ``dark`` (ENG-63)

[release/teak-rg.4] - 2026-02-27
================================

Maintenance:
============
* Rebased on upstream/release/teak.3

[release/teak-rg.3] - 2025-09-09
********************************

Added:
======
* Implement HTML and Problem editors plugin slots

Fixed:
======
* Loading unit page directly from link after logging in in Teak
* Load sequences in unit page

[release/teak-rg.2]
*******************
[release/teak-rg.1] - 2025-08-06
********************************

Sync:
=====
* sync with upstream teak branch (TEA-27)
* sync with upstream teak branch (TEA-18)

Added:
======
* add direct import of openedx-brand overrides (TEA-18)
* add design tokens support (TEA-18)
