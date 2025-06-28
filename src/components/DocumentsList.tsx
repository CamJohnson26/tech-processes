// src/app/components/DocumentsList.tsx

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

type FileEntry = {
    name: string;
    path: string;
};

export function DocumentsList() {
    const [path, setPath] = useState<string>("");
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch default Documents path from backend
    useEffect(() => {
        invoke<string>("get_default_documents_path")
            .then((defaultPath) => {
                if (defaultPath) setPath(defaultPath);
                else setError("Documents folder not found");
            })
            .catch((err) => setError(err.toString()));
    }, []);

    // Fetch files whenever path changes
    useEffect(() => {
        if (!path) return;

        invoke<FileEntry[]>("list_files_in_dir", { dirPath: path })
            .then(setFiles)
            .catch((err) => {
                setError(err.toString());
                setFiles([]);
            });
    }, [path]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Browse Folder</h2>

            <label className="block mb-2 font-medium">Directory Path:</label>
            <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            />

            {error && <p className="text-red-600">Error: {error}</p>}

            {files.length === 0 ? (
                <p>No files found.</p>
            ) : (
                <ul className="list-disc list-inside">
                    {files.map((file) => (
                        <li key={file.path}>
                            <strong>{file.name}</strong>
                            <br />
                            <small className="text-gray-500">{file.path}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
