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
            <div className="h-screen flex items-center justify-center text-gray-500 bg-white bg-opacity-60 backdrop-blur-sm">
                <div className="text-center p-8 max-w-md card animate-fade-in">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No document selected</h3>
                    <p className="mt-2 text-sm text-gray-500">Select a file from the sidebar to view its contents.</p>
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
                    <div className="flex items-center justify-center p-16">
                        <div className="relative">
                            <div className="animate-spin h-10 w-10 border-3 border-gray-200 border-t-blue-500 rounded-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-5 w-5 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <p className="ml-3 text-sm text-gray-500 animate-pulse">Loading document...</p>
                    </div>
                ) : (
                    selectedFile.name.toLowerCase().endsWith('.md') ? (
                        <div className="card p-8 shadow-md">
                            <MarkdownContent content={fileContent} />
                        </div>
                    ) : (
                        <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-gray-700 font-medium">This file is not a markdown file.</p>
                            <p className="text-gray-500 text-sm mt-2">Only markdown files can be rendered in the preview.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
