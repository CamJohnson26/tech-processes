
# Create a Tauri App
"""Note: Tauri v2 requires libwebkit2gtk-4.1, which isn't in Ubuntu at time of writing this (6/13/25). Use v1 for now."""
```
sudo apt update
sudo apt install -y libwebkit2gtk-4.0-dev build-essential curl wget libjavascriptcoregtk-4.0-dev
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```
```
export PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig:$PKG_CONFIG_PATH
```
* cd into your project
```
nvm use 20
npm install --save-dev @tauri-apps/cli@^1 @tauri-apps/api@^1
npx tauri init
```
* Accept defaults, except for these:
  * Set devUrl to http://localhost:5173
* test with `npx tauri dev`
* Add to the root .gitignore:
```
# Rust
/src-tauri/target/
src-tauri/Cargo.lock

```
