
# Add Auth0 to Frontend app
* Go to Auth0, create application, name it, single page app. Select React.
* In settings, set the callback url and logout url and allowable origins to your site's url in application settings, and also http://localhost:3000. Comma separated, provide the trailing url slash. (`http://localhost:5173/,https://camjohnson26.github.io/`)
* Set Allowed Logout URLs too
* `npm install --save @auth0/auth0-react`
* Create .env file on frontend to have `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` and `VITE_ORIGIN_URL`. Fill from settings and set the URL to the deployed location, with trailing url if needed (https://camjohnson26.github.io/). Create .env.local and Copy from the settings and set to http://localhost:3000
* ALSO create .env.production.local to make sure deployed app uses the right env vars
* Add the Auth0Provider and wrap the app in index.tsx with this:
```typescript
// auth/Auth0Provider.tsx

import {type PropsWithChildren} from "react";
import {Auth0Provider} from "@auth0/auth0-react";

export const Auth0ProviderWrapped = ({children}: PropsWithChildren) => {
    return <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN ?? ''}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''}
    authorizationParams={{
        redirect_uri: window.location.origin
    }}
>
    {children}
    </Auth0Provider>
}
```
* index.tsx
```typescript
// To prevent this issue: https://community.auth0.com/t/silent-authorization-not-working-after-login-signup/37114/5 Turn on refresh tokens

<Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN ?? ''}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
        useRefreshTokens={true}
    >{children}</Auth0Provider>
```
* Add login button to the homepage:
```typescript
// auth/LoginButton.tsx
import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
    const { loginWithRedirect, user } = useAuth0();
    return user?.nickname ? <>Hello, {user.nickname}!</> : <button onClick={() => loginWithRedirect()}>Log In</button>;
};

```
* `npm run dev`, verify it works
* Guard the main components by user from `useAuth0`
* Add LogoutButton
```typescript
// auth/LogoutButton.tsx
import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = () => {
    const { logout, user } = useAuth0();

    return (
        user ? <button onClick={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_ORIGIN_URL } })}>
    Log Out
    </button> : null
);
};

```
* Commit and push changes,
* npm run deploy
* Make sure it works on deployed app
