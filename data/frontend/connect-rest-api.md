# Connect frontend to a REST api
* Open DO and copy the api url from App Platform > Apps
* Add an env var to `.env.local` and `.env`: `VITE_WORKER_API_URL=API_URL`
* `npm install --save axios`
* Create folder `src/myApi` (Camel Case)
* Create a route file named `useRouteApi.ts`
```typescript
import {useEffect, useState} from "react";

export const useRouteApi = () => {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (import.meta.env.VITE_WORKER_API_URL) {
                    const response = await fetch(import.meta.env.VITE_WORKER_API_URL, {
                        cache: 'no-store',
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
* use the hook and fetch the data
* Open the App in DO, click Settings, and click the right component.
* Edit the `ALLOWED_ORIGINS` env var in DO to comma include the new origin, ie http://localhost:5174,https://camjohnson26.github.io/stable-diff-frontend/ 
* add any new frontend routes to the DigitalOcean CORS options, exact, and without any trailing slashes (ie http://localhost:3000)
* Don't forget to click Save
* `npm run dev` to test
* npm run deploy