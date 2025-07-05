# New Frontend Protected API
* Add env var `VITE_WORKER_API_AUDIENCE` to the api audience (Auth0 settings)
* Create a new Frontend Route file:
```typescript jsx
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

export const useProtectedApi = () => {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)
    const {
        getAccessTokenSilently,
        isAuthenticated,
        isLoading: auth0Loading
    } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (auth0Loading || !isAuthenticated) {
                    console.log('Auth failed', auth0Loading, isAuthenticated)
                    return;
                }

                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_WORKER_API_AUDIENCE,
                    }
                })

                const path = '/private'

                if (import.meta.env.VITE_WORKER_API_URL) {
                    const url = new URL(path, import.meta.env.VITE_WORKER_API_URL)
                    const response = await fetch(url, {
                        cache: 'no-store',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const textData = await response.text();
                    setData(textData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false)
        };

        void fetchData();
    }, []);

    return {
        data,
        loading
    }
}
```
* Add `audience: import.meta.env.VITE_WORKER_API_AUDIENCE,` to `Auth0ProviderWrapped`
* Auth0 documentation is worthless. Things don't work and community is the only way to get it.