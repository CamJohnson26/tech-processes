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
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Browse Folder</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Directory Path:
                </label>
                <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter directory path..."
                />
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <p className="text-red-700">Error: {error}</p>
                </div>
            )}

            {files.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No files found in this directory.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {files.map((file) => (
                        <div
                            key={file.path}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <h3 className="text-lg font-medium text-gray-900">
                                {file.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{file.path}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}