use tauri::{App, Manager};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

/// setup
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let window = app.get_window("main").unwrap();
    let _apply_vibrancy = apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow);
    #[cfg(target_os = "macos")]
    _apply_vibrancy
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    #[cfg(target_os = "windows")]
    apply_blur(&window, Some((18, 18, 18, 0)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
    Ok(())
}
