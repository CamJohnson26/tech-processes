import { useState } from 'react';
import { Sidebar, type FileEntry } from "./components/Sidebar";
import { ContentView } from "./components/ContentView";

function App() {
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  const handleFileSelect = (file: FileEntry) => {
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      <Sidebar
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
      />
      <main className="flex-1 overflow-hidden">
        <ContentView selectedFile={selectedFile} />
      </main>
    </div>
  );
}

export default App
