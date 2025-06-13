// src/app/components/DocumentsList.tsx

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

type FileEntry = {
    name: string;
    path: string;
};

export function DocumentsList() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        invoke<FileEntry[]>("list_documents_files")
            .then(setFiles)
            .catch((err) => setError(err.toString()));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Documents Folder</h2>
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