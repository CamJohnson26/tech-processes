// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;

fn main() {
    // Print the current working directory for debugging
    if let Ok(current_dir) = std::env::current_dir() {
        println!("Current working directory: {}", current_dir.display());
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            files::get_data_directory,
            files::get_home_md_path,
            files::list_files_in_dir,
            files::read_file_contents,
            files::search_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}