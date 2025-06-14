use std::fs;
use std::path::PathBuf;
use serde::Serialize;

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
}

#[tauri::command]
pub fn list_files_in_dir(dir_path: String) -> Result<Vec<FileEntry>, String> {
    let dir = PathBuf::from(dir_path);

    if !dir.exists() || !dir.is_dir() {
        return Err("Invalid or non-existent directory path".into());
    }

    let entries = fs::read_dir(&dir)
        .map_err(|e| format!("Failed to read directory: {}", e))?
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

use dirs::document_dir;

#[tauri::command]
pub fn get_default_documents_path() -> Option<String> {
    document_dir().map(|p| p.to_string_lossy().into_owned())
}
