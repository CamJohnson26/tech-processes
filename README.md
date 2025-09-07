# tech-processes

## Next Steps
- [ ] Document deploying a python job

## Goal
A desktop app to display markdown files with instructions for running a process.

## Usage
Run the tauri app and point it to a directory with specially formatted markdown.

## Running the App

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- Platform-specific dependencies for Tauri as described in the [Tauri setup guide](https://tauri.app/v1/guides/getting-started/prerequisites)

### Development Mode
1. Install dependencies:
   ```
   npm install
   ```

2. Run the app in development mode:
   ```
   cd src-tauri
   cargo tauri dev
   ```

   Alternatively, if you have @tauri-apps/cli installed globally:
   ```
   tauri dev
   ```

### Building for Production
1. Install dependencies (if not already done):
   ```
   npm install
   ```

2. Build the app:
   ```
   cd src-tauri
   cargo tauri build
   ```

   Alternatively, if you have @tauri-apps/cli installed globally:
   ```
   tauri build
   ```

The built application will be available in the `src-tauri/target/release` directory.

## Technical Details
A react app running on Tauri with rust backend.
