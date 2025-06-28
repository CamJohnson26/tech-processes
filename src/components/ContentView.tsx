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
                            <div className="h-screen flex items-center justify-center text-gray-500 bg-white">
                <div className="text-center p-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm">Select a file from the sidebar to view its contents.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-auto bg-white">
            <div className="max-w-4xl mx-auto px-6 py-8">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                        <p className="text-red-700">Error: {error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                    </div>
                ) : (
                    selectedFile.name.toLowerCase().endsWith('.md') ? (
                        <MarkdownContent content={fileContent} />
                    ) : (
                                                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-700">This file is not a markdown file.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
