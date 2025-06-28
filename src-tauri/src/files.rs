use std::fs;
use std::path::PathBuf;
use std::io::{Read, Write};
use std::env;
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

#[tauri::command]
pub fn get_data_directory() -> Result<String, String> {
    // Get the path to the project root directory
    // In development, we need to go up one level from the src-tauri directory
    // In production, we use the current executable's directory
    let app_dir = if cfg!(debug_assertions) {
        // Development mode - go up from the current directory
        let mut current_dir = env::current_dir()
            .map_err(|e| format!("Failed to get current directory: {}", e))?;

        // Move up to the project root (from src-tauri to project root)
        if current_dir.ends_with("src-tauri") {
            current_dir.pop();
        }

        current_dir
    } else {
        // Production mode - use the executable's directory
        let exe_path = std::env::current_exe()
            .map_err(|e| format!("Failed to get executable path: {}", e))?;
        exe_path.parent()
            .ok_or_else(|| "Could not determine parent directory of executable".to_string())?
            .to_path_buf()
    };

    // Create the path to the data directory at the project root
    let data_dir = app_dir.join("data");

    // Check if the data directory exists
    if !data_dir.exists() {
        // Create the data directory if it doesn't exist
        fs::create_dir_all(&data_dir)
            .map_err(|e| format!("Failed to create data directory: {}", e))?;
    }

    Ok(data_dir.to_string_lossy().into_owned())
}

#[tauri::command]
pub fn get_home_md_path() -> Result<String, String> {
    // Get the data directory path
    let data_dir = get_data_directory()?;

    // Print the data directory path for debugging
    println!("Data directory path: {}", data_dir);

    // Create the path to home.md
    let home_md_path = PathBuf::from(&data_dir).join("home.md");

    // Check if home.md exists
    if !home_md_path.exists() {
        // Create an empty home.md file if it doesn't exist
        let mut file = fs::File::create(&home_md_path)
            .map_err(|e| format!("Failed to create home.md: {}", e))?;

        // Write some default content
        file.write_all(b"# Welcome to Markdown Viewer\n\nThis is your home page.")
            .map_err(|e| format!("Failed to write to home.md: {}", e))?;
    }

    Ok(home_md_path.to_string_lossy().into_owned())
}

#[tauri::command]
pub fn read_file_contents(file_path: String) -> Result<String, String> {
    let path = PathBuf::from(file_path);

    if !path.exists() || !path.is_file() {
        return Err("Invalid or non-existent file path".into());
    }

    let mut file = fs::File::open(&path)
        .map_err(|e| format!("Failed to open file: {}", e))?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| format!("Failed to read file contents: {}", e))?;

    Ok(contents)
}
