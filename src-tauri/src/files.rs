// src-tauri/src/files.rs

use std::fs;
use std::path::PathBuf;
use dirs::document_dir;
use serde::Serialize;

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
}

#[tauri::command]
pub fn list_documents_files() -> Result<Vec<FileEntry>, String> {
    let doc_path = document_dir().ok_or("Documents folder not found")?;

    let entries = fs::read_dir(doc_path)
        .map_err(|e| format!("Failed to read Documents folder: {}", e))?
        .filter_map(|entry| {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_file() {
                    Some(FileEntry {
                        name: entry.file_name().to_string_lossy().into_owned(),
                        path: path.to_string_lossy().into_owned(),
                    })
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect();

    Ok(entries)
}
