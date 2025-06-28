# Point a domain name at a Frontend
* Ref (https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain)
* Login to name cheap, dashboard, manage your domain
* Advanced DNS, Add a CNAME record. Add the subdomain, and point to camjohnson26.github.io
* If your URL is already used by another repo, remove it from Github, settings, pages
* Open Github, settings, pages on your repo. Set the page's domain to your url
* Pull the CNAME commit, move the CNAME file into `public` (Ref: https://github.com/gitname/react-gh-pages/issues/89#issuecomment-1207271670)
* Update the "homepage" in `package.json` to the custom domain (Ref: https://create-react-app.dev/docs/deployment/#github-pages)
* Run npm run deploy
* Run to test propogation:
```
 sudo apt install bind9-dnsutils
 dig WWW.EXAMPLE.COM +nostats +nocomments +nocmd
 ```