# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2020-05-29

### Added

- None

### Changed

- Clamped the decimal value that represents the total distance
  traveled. It's now limited to two decimal spaces.

### Removed

- Removed the intermediate calculations that were being rendered next to each input.

## [0.2.0] - 2020-04-09

### Added

- Add a function that renders each calculation

### Changed

- Set default distance to a float of 0.0 in the useEffect call (was an int of 0)

### Removed

- Replaced deprecated "string_of_float" functions.

## [0.1.0] - 2020-04-05

### Added

- Basic layout with styling
- "Total Distance" feature which outputs the total distance traveled in real time.
- "Undo" feature which subtracts the last distance traveled from the total.
- Deployed the app to [Netlify](https://hardcore-lamarr-a57d20.netlify.com/)

### Changed

- None

### Removed

- None
