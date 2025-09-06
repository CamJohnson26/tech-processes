
# Creating an NPM project
* Make sure you've provisioned npm on this machine (see the npm whoami script)
* Setup a new repo (Do not initialize with a README or .gitignore)
* Open the folder in webstorm
* Create a classic PAT token on https://github.com/settings/personal-access-tokens with read/write packages scopes
* Fill out the exported variables and run the script:
```
export REPO_NAME="test-npm"
export PKG_NAME="@camjohnson26/$REPO_NAME"
export PKG_DSC="Testing Creating NPM Package"
export PKG_AUTHOR="Cameron Johnson"
export REPO_URL="https://github.com/camjohnson26/$REPO_NAME"

cd ~/Git/Personal
cd $REPO_NAME
curl -fsSL https://raw.githubusercontent.com/CamJohnson26/tech-processes/refs/heads/master/data/scripts/init-npm-project.sh -o init-npm-project.sh
chmod +x init-npm-project.sh
./init-npm-project.sh
rm init-npm-project.sh
```
* run `npm publish`, verify it's posted on the repo
* Update the Readme with description (Goal) and usage instructions and technical details
* Verify you can pull into another project (`npm install @camjohnson26/REPO_NAME`)
* Don't have to worry about CI if you build and publish the frontend locally
* Open Sublime merge, commit all the files (I'll clean up ide files later)
