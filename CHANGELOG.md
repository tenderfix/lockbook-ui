# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Each version (`major`/`minor`/`patch`) consists of:

- heading 2: `[version]` and `date`
- one or multiple heading 3: can be `Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, `Security` (in this order)

## 1.x.x ongoing

## 1.8.6 ongoing

### Added

- If mobile app is used prevent usercentrics from loading

### Fixed

- Profile page: user.phone1 from API could be NULL, which caused a validation error in form

## 1.8.5

### Fixed

- second address field on the company-administration
  - initially the field where prefilled with `NULL` what wasn't accepted by the validation
  - `NULL` is now converted to empty string

## 1.8.4

### Added

- added Page for resending activation mail via username

## 1.8.3

### Added

- facebook verification via HTML-Header

## 1.8.2

### Changed

- Roboto-Font is loaded locally and not from googlefonts to prevent pricavy issues

## 1.8.1

### Added

- Move deployment to github actions with terraform

## 1.8.0

### Added

- Business sector field at registration
- `referrer` & `landing_page` are getting set and saved when user registers

## Missing versions (^1.5.1 - 1.8.0)

- ...

## (1.5.1) 2022-02-08

### Fixed

- query string logic added to `Signature`, so when coming from Docu, you'll get redirected back when saving the changes made to the signature

## (1.5.0) 2022-01-10

### Added

- Signature page in Account Super Page, where user can update his/her signature (for Docu)

### Changed

- fix Node Version to 16.13 (Docker & CI)

### Fixed

- namings: "deines" -> "Deines"

## Before (1.5.0) (before 2021-11-15)

Many things. I will not list all features of this already old application :)
