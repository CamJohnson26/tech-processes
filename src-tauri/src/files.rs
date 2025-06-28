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

#[derive(Serialize)]
pub struct SearchResult {
    pub file: FileEntry,
    pub preview: String,
    pub line_number: usize,
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

#[tauri::command]
pub fn search_files(query: String) -> Result<Vec<SearchResult>, String> {
    // Get the data directory path
    let data_dir = get_data_directory()?;
    let data_dir_path = PathBuf::from(&data_dir);

    // Validate query length
    if query.trim().is_empty() {
        return Err("Search query cannot be empty".into());
    }

    if query.trim().len() < 2 {
        return Err("Search query must be at least 2 characters long".into());
    }

    let mut results = Vec::new();

    // Recursively search files
    search_directory(data_dir_path, &query, &mut results)?;

    Ok(results)
}

fn search_directory(dir: PathBuf, query: &str, results: &mut Vec<SearchResult>) -> Result<(), String> {
    // Check if the directory exists
    if !dir.exists() || !dir.is_dir() {
        return Err(format!("Directory does not exist: {}", dir.display()));
    }

    // Read all entries in the directory
    let entries = fs::read_dir(&dir)
        .map_err(|e| format!("Failed to read directory {}: {}", dir.display(), e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();

        if path.is_dir() {
            // Recursively search subdirectories
            search_directory(path, query, results)?;
        } else if path.is_file() {
            // Only search markdown files
            if let Some(ext) = path.extension() {
                if ext == "md" {
                    search_file(&path, query, results)?;
                }
            }
        }
    }

    Ok(())
}

fn search_file(file_path: &PathBuf, query: &str, results: &mut Vec<SearchResult>) -> Result<(), String> {
    // Open the file
    let file_content = fs::read_to_string(file_path)
        .map_err(|e| format!("Failed to read file {}: {}", file_path.display(), e))?;

    // Get the file name
    let file_name = file_path.file_name()
        .ok_or_else(|| "Invalid file name".to_string())?
        .to_string_lossy()
        .into_owned();

    // Search for the query in each line
    for (i, line) in file_content.lines().enumerate() {
        if line.to_lowercase().contains(&query.to_lowercase()) {
            // Create a preview with some context (trim if too long)
            let preview = if line.len() > 100 {
                let start_idx = line.to_lowercase().find(&query.to_lowercase())
                    .unwrap_or(0)
                    .saturating_sub(40);

                let end_idx = (start_idx + 100).min(line.len());

                if start_idx > 0 {
                    format!("...{}", &line[start_idx..end_idx])
                } else {
                    format!("{}{}", &line[start_idx..end_idx], if end_idx < line.len() { "..." } else { "" })
                }
            } else {
                line.to_string()
            };

            // Add to search results
            results.push(SearchResult {
                file: FileEntry {
                    name: file_name.clone(),
                    path: file_path.to_string_lossy().into_owned(),
                },
                preview,
                line_number: i + 1,  // Line numbers start at 1
            });

            // Limit to one result per line (to avoid duplicates if the query appears multiple times in a line)
            // But continue searching other lines
        }
    }

    Ok(())
}
