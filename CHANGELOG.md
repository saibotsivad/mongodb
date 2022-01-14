# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Change categories are:

* `Added` for new features.
* `Changed` for changes in existing functionality.
* `Deprecated` for once-stable features removed in upcoming releases.
* `Removed` for deprecated features removed in this release.
* `Fixed` for any bug fixes.
* `Security` to invite users to upgrade in case of vulnerabilities.

## [Unreleased](https://github.com/saibotsivad/mongodb/compare/v0.0.0...HEAD)
### Added
### Changed
### Deprecated
### Fixed
### Removed
### Security

## [0.0.4](https://github.com/saibotsivad/mongodb/compare/v0.0.3...v0.0.4) - 2022-01-14
### Added
- JSDoc documentation for all the functions. I tried adding a little more to the TS definition.
### Changed
- Made the function results more consistent with the MongoDB Data API, e.g. calling `deleteOne` returns `{ deletedCount: Number }` instead of `Number`. This was done to make it easier to add properties as the Data API becomes more feature complete.

## [0.0.1-0.0.3](https://github.com/saibotsivad/mongodb/compare/v0.0.0...v0.0.3) - 2022-01-12
### Fixed
- Correction to paths so IDEs recognize the module correctly.

## [0.0.0](https://github.com/saibotsivad/mongodb/tree/v0.0.0) - 2022-01-12
### Added
- Created the base project from [saibotsivad/init](https://github.com/saibotsivad/init).
- Basic functionality and documentation in the readme.
