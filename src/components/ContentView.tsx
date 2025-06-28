import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { MarkdownContent } from "./MarkdownContent";
import { type FileEntry } from "./Sidebar";

type ContentViewProps = {
    selectedFile: FileEntry | null;
};

export function ContentView({ selectedFile }: ContentViewProps) {
    const [fileContent, setFileContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedFile) return;

        const loadFileContent = async () => {
            try {
                setLoading(true);
                setError(null);

                // Only fetch content for markdown files
                if (selectedFile.name.toLowerCase().endsWith('.md')) {
                    const content = await invoke<string>("read_file_contents", { 
                        filePath: selectedFile.path 
                    });
                    setFileContent(content);
                } else {
                    setFileContent("Not a markdown file.");
                }

                setLoading(false);
            } catch (err) {
                setError(`Failed to read file: ${err}`);
                setFileContent("");
                setLoading(false);
            }
        };

        loadFileContent();
    }, [selectedFile]);

    if (!selectedFile) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a file from the sidebar to view its contents.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    {selectedFile.name}
                </h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                        <p className="text-red-700">Error: {error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                    </div>
                ) : (
                    selectedFile.name.toLowerCase().endsWith('.md') ? (
                        <MarkdownContent content={fileContent} />
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p>This file is not a markdown file.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
