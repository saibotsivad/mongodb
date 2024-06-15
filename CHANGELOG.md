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

## Unreleased
### Added
### Changed
### Deprecated
### Fixed
### Removed
### Security

## [1.2.0](https://github.com/saibotsivad/mongodb/compare/v1.1.0...v1.2.0) - 2024-06-15
### Added
- Support for Web API [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers),
  so you can use the global `fetch` as-is.
- Updated tests to run against Node.js version 18 and 20 as well as 16 (original).
### Fixed
- Type for option parameters had `cluster` instead of `dataSource`, which was a breaking
  change in `1.0.0`. Types are now fixed. Closes #3

## [1.1.0](https://github.com/saibotsivad/mongodb/compare/v1.0.0...v1.1.0) - 2022-09-30
### Added
- The `interpose` method allows you to inspect and mutate requests immediately prior to
  sending them, for things like logging and debugging.

## [1.0.0](https://github.com/saibotsivad/mongodb/compare/v0.0.10...v1.0.0) - 2022-09-30

Since MongoDB Data API is now out of beta, this library is going to v1 as well! 🎉

### Added
- Full test suite (it's the demo code) that actually connects to a MongoDB Data API
  instance to verify that all requests are being made correctly. (Note to my future
  self: this is using a free version, which will likely be automatically spun down
  due to inactivity. I will need to go spin it back up for tests to pass.)
### Changed
- BREAKING: Simplified the interface a bit, by requiring the fully qualified URL instead of region
  and/or app ID. Here are the [MongoDB URL docs](https://www.mongodb.com/docs/atlas/api/data-api-resources/#base-url).
- BREAKING: Renamed `cluster` to `dataSource` to match their parameter names better.
- Change the default-vs-overrides a bit: you don't *need* to specify the `dataSource`, `database`,
  or `collection` properties at initialization. If you do, you can still specify them at
  the request to override the defaults.

## [0.0.10](https://github.com/saibotsivad/mongodb/compare/v0.0.9...v0.0.10) - 2022-02-23
### Fixed
- Documentation only: the `insertMany` examples were incorrectly written.

## [0.0.9](https://github.com/saibotsivad/mongodb/compare/v0.0.8...v0.0.9) - 2022-01-28
### Fixed
- After using this for a while now, I was able to make the error handling more consistent.

## [0.0.8](https://github.com/saibotsivad/mongodb/compare/v0.0.7...v0.0.8) - 2022-01-25
### Fixed
- Tidy up the response handling code a bit after experimenting with the Data API responses more thoroughly.
- Several example corrections to the docs.

## [0.0.6-0.0.7](https://github.com/saibotsivad/mongodb/compare/v0.0.5...v0.0.7) - 2022-01-24
### Fixed
- Creating can return a 201, and errors aren't always JSON bodies.
- Parameters needs rest expansion.

## [0.0.4-0.0.5](https://github.com/saibotsivad/mongodb/compare/v0.0.3...v0.0.5) - 2022-01-14
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
