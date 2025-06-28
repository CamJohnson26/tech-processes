import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export type FileEntry = {
    name: string;
    path: string;
};

export type SearchResult = {
    file: FileEntry;
    preview: string;
    line_number: number;
};

type SidebarProps = {
    onFileSelect: (file: FileEntry) => void;
    selectedFile: FileEntry | null;
};

export function Sidebar({ onFileSelect, selectedFile }: SidebarProps) {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dataDir, setDataDir] = useState<string>("");
    const [homeMdPath, setHomeMdPath] = useState<string>("");

    // Search state
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Fetch data directory path and home.md file
    useEffect(() => {
        // Get the data directory path
        invoke<string>("get_data_directory")
            .then((dir) => {
                setDataDir(dir);

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

    // Load files from the data directory
    useEffect(() => {
        if (!dataDir) return;

        // If we have a search query, don't load directory files
        if (searchQuery.trim().length >= 2) return;

        invoke<FileEntry[]>("list_files_in_dir", { dirPath: dataDir })
            .then((filesList) => {
                setFiles(filesList);

                // Auto-select home.md if homeMdPath is set and we don't have a selected file yet
                if (homeMdPath && !selectedFile) {
                    const homeFile = filesList.find(file => file.path === homeMdPath);
                    if (homeFile) {
                        onFileSelect(homeFile);
                    }
                }
            })
            .catch((err) => {
                setError(err.toString());
                setFiles([]);
            });
    }, [dataDir, homeMdPath, searchQuery, selectedFile, onFileSelect]);

    // Handle search
    const handleSearch = async () => {
        // If search query is empty or too short, show directory files
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            setSearchError(null);
            const results = await invoke<SearchResult[]>("search_files", { query: searchQuery.trim() });
            setSearchResults(results);
            setIsSearching(false);
        } catch (err) {
            setSearchError(`Search failed: ${err}`);
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    // Perform search when query changes
    useEffect(() => {
        // Debounce search to avoid too many requests
        const timerId = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Display either search results or directory files
    const displayItems = searchQuery.trim().length >= 2 ? 
        searchResults.map(result => result.file) : 
        files;

    return (
        <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Documents</h2>

                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Search files..."
                    />
                    <svg 
                        className="absolute left-2.5 top-2.5 text-gray-400"
                        fill="none" 
                        stroke="currentColor" 
                        width="14"
                        height="14"
                        viewBox="0 0 24 24" 
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>

                    {isSearching && (
                        <div className="absolute right-2.5 top-2.5 animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                    )}
                </div>

                {searchError && (
                    <p className="mt-2 text-xs text-red-600">{searchError}</p>
                )}
            </div>

            <div className="flex-grow overflow-y-auto">
                {error && (
                    <div className="m-2 p-3 text-xs text-red-600 bg-red-50 rounded border border-red-200">
                        {error}
                    </div>
                )}

                {displayItems.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        {searchQuery.trim().length >= 2 ? 
                            `No results for "${searchQuery}"` : 
                            "No files found"}
                    </div>
                ) : (
                    <nav className="divide-y divide-gray-100">
                        {displayItems.map((file) => {
                            const isSearchResult = searchQuery.trim().length >= 2;
                            const resultInfo = isSearchResult ? 
                                searchResults.find(r => r.file.path === file.path) : null;
                            const isSelected = selectedFile?.path === file.path;

                            return (
                                <div
                                    key={file.path}
                                    className={`group px-4 py-3 cursor-pointer transition-all duration-150 ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                                    onClick={() => onFileSelect(file)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className={`text-sm truncate ${isSelected ? 'font-medium text-blue-600' : 'font-normal text-gray-700 group-hover:text-gray-900'}`}>
                                            {file.name}
                                        </h3>
                                    </div>

                                    {resultInfo && (
                                        <div className="mt-2 ml-8">
                                            <p className="text-xs text-gray-500 mb-1.5">Line {resultInfo.line_number}</p>
                                            <p className="text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200 whitespace-pre-wrap max-h-24 overflow-y-auto shadow-sm">
                                                {resultInfo.preview}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                )}
            </div>
        </aside>
    );
}
