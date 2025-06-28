import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { MarkdownContent } from "./MarkdownContent";

type FileEntry = {
    name: string;
    path: string;
};

type SearchResult = {
    file: FileEntry;
    preview: string;
    line_number: number;
};

export function DocumentsList() {
    const [path, setPath] = useState<string>("");
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
    const [fileContent, setFileContent] = useState<string>("");

    // Search state
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

    // Store the home.md path for auto-selection
    const [homeMdPath, setHomeMdPath] = useState<string>("");

    // Fetch data directory path and home.md file
    useEffect(() => {
        // Get the data directory path
        invoke<string>("get_data_directory")
            .then((dataDir) => {
                setPath(dataDir);

                // Also get the home.md path
                return invoke<string>("get_home_md_path");
            })
            .then((homePath) => {
                setHomeMdPath(homePath);
            })
            .catch((err) => {
                setError(`Failed to get data directory: ${err}`);
            });
    }, []);

    // Fetch files whenever path changes
    useEffect(() => {
        if (!path) return;

        invoke<FileEntry[]>("list_files_in_dir", { dirPath: path })
            .then((filesList) => {
                setFiles(filesList);

                // Auto-select home.md if homeMdPath is set and we haven't selected a file yet
                if (homeMdPath && !selectedFile) {
                    const homeFile = filesList.find(file => file.path === homeMdPath);
                    if (homeFile) {
                        handleFileSelect(homeFile);
                    }
                }
            })
            .catch((err) => {
                setError(err.toString());
                setFiles([]);
            });
    }, [path, homeMdPath]);

    const handleFileSelect = async (file: FileEntry) => {
        try {
            setSelectedFile(file);
            // Only fetch content for markdown files
            if (file.name.toLowerCase().endsWith('.md')) {
                const content = await invoke<string>("read_file_contents", { filePath: file.path });
                setFileContent(content);
                setShowSearchResults(false); // Hide search results when a file is selected
            } else {
                setFileContent("Not a markdown file.");
            }
        } catch (err) {
            setError(`Failed to read file: ${err}`);
            setFileContent("");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setSearchError("Search query must be at least 2 characters long");
            return;
        }

        try {
            setIsSearching(true);
            setSearchError(null);
            const results = await invoke<SearchResult[]>("search_files", { query: searchQuery.trim() });
            setSearchResults(results);
            setShowSearchResults(true);
            setIsSearching(false);
        } catch (err) {
            setSearchError(`Search failed: ${err}`);
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    const handleSearchResultClick = (result: SearchResult) => {
        handleFileSelect(result.file);
    };

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

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Markdown Files:
                </label>
                <div className="flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-grow p-3 border border-gray-300 rounded-l-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Search for text in markdown files..."
                    />
                    <button 
                        onClick={handleSearch}
                        className="px-4 py-3 bg-blue-500 text-white font-medium rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        disabled={isSearching}
                    >
                        {isSearching ? "Searching..." : "Search"}
                    </button>
                </div>
                {searchError && (
                    <p className="mt-2 text-sm text-red-600">{searchError}</p>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <p className="text-red-700">Error: {error}</p>
                </div>
            )}

            {/* Search Results Section */}
            {showSearchResults && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Search Results {searchResults.length > 0 ? `(${searchResults.length})` : ""}
                    </h3>

                    {searchResults.length === 0 ? (
                        <div className="p-4 bg-gray-50 rounded-md text-gray-600">
                            No results found for "{searchQuery}"
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {searchResults.map((result, index) => (
                                <div 
                                    key={`${result.file.path}-${result.line_number}-${index}`}
                                    className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={() => handleSearchResultClick(result)}
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-md font-medium text-blue-600">
                                            {result.file.name}
                                        </h4>
                                        <span className="text-xs text-gray-500">Line {result.line_number}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-800 font-mono whitespace-pre-wrap">{result.preview}</p>
                                    <p className="mt-1 text-xs text-gray-500">{result.file.path}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!showSearchResults && (
                files.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No files found in this directory.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {files.map((file) => (
                        <div
                            key={file.path}
                            className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedFile?.path === file.path ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}
                            onClick={() => handleFileSelect(file)}
                        >
                            <h3 className="text-lg font-medium text-gray-900">
                                {file.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{file.path}</p>
                        </div>
                    ))}
                </div>
                )
            )}

            {selectedFile && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {selectedFile.name}
                    </h2>
                    {fileContent ? (
                        selectedFile.name.toLowerCase().endsWith('.md') ? (
                            <MarkdownContent content={fileContent} />
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p>This file is not a markdown file.</p>
                            </div>
                        )
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p>Loading content...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}