import './App.css'
import { useState } from 'react';
import { Sidebar, type FileEntry } from "./components/Sidebar";
import { ContentView } from "./components/ContentView";

function App() {
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  const handleFileSelect = (file: FileEntry) => {
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen flex flex-row">
          <Sidebar
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
      <div className="flex-1">
        <ContentView selectedFile={selectedFile} />
      </div>
    </div>
  );
}

export default App
