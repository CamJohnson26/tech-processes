
# Creating a Frontend v2 (No Deploy)
* Setup a new repo (Do not initialize with a README or .gitignore)
* Open the folder in webstorm
```
export REPO_NAME=tech-processes
cd ~/Git/Personal
npm create vite@latest $REPO_NAME -- --template react-ts
cd $REPO_NAME
echo "20" > .nvmrc
nvm install
npm install
npm install react-router-dom gh-pages
npm install -D tailwindcss @tailwindcss/vite
```
* Edit title in index.html
* Set `base: "/REPO_NAME/",` in `vite.config.ts`
* Set `import tailwindcss from '@tailwindcss/vite'` and add `tailwindcss()` plugin
* Add `@import "tailwindcss";` to main css file
* Add
```
"predeploy": "vite build && cp dist/index.html dist/404.html",
"deploy": "gh-pages -d dist"
```
to `package.json`
* `npm run deploy`
* Wait for https://camjohnson26.github.io/REPO_NAME/
* Update the Readme with description (Goal) and Screenshot and usage instructions and technical details
* Open Sublime merge, commit all the files (I'll clean up ide files later)
