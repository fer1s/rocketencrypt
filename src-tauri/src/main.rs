#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use std::fs::OpenOptions;
// use std::io::{Read, Seek, SeekFrom, Write};
// use rand::RngCore;
// use crypto::aes::{KeySize};
// use crypto::aead::{AeadEncryptor, AeadDecryptor};
// use crypto::aes_gcm::AesGcm;

// const KEY_SIZE: usize = 32;
// const NONCE_SIZE: usize = 12;
// const TAG_SIZE: usize = 16;

// #[tauri::command]
// fn encrypt(file_path: &str, key: &[u8]) {
//     let mut file = OpenOptions::new()
//         .read(true)
//         .write(true)
//         .open(file_path)
//         .unwrap();

//     let mut key = [0; KEY_SIZE];
//     key.copy_from_slice(&key);

//     let mut nonce = [0; NONCE_SIZE];
//     rand::thread_rng().fill_bytes(&mut nonce);

//     let mut buffer = Vec::new();
//     file.read_to_end(&mut buffer).unwrap();

//     // let mut encryptor = AeadEncryptor::new(
//     //     KeySize::KeySize256,
//     //     &key,
//     //     &nonce,
//     //     Gcm,
//     //     NoPadding
//     // );

//     let mut encryptor = AesGcm::new(KeySize::KeySize256, &key, &nonce, &[]);

//     let ciphertext = encryptor.encrypt(&buffer, TAG_SIZE).unwrap();
//     file.seek(SeekFrom::Start(0)).unwrap();
//     file.write_all(&nonce).unwrap();
//     file.write_all(&ciphertext).unwrap();
//     file.set_len((NONCE_SIZE + ciphertext.len()) as u64).unwrap();
// }

// #[tauri::command]
// fn decrypt(file_path: &str, key: &[u8]) {
//     let mut file = OpenOptions::new()
//         .read(true)
//         .write(true)
//         .open(file_path)
//         .unwrap();

//     let mut key = [0; KEY_SIZE];
//     key.copy_from_slice(&key);

//     let mut nonce = [0; NONCE_SIZE];
//     file.read_exact(&mut nonce).unwrap();

//     let mut buffer = Vec::new();
//     file.read_to_end(&mut buffer).unwrap();

//     let mut decryptor = AesGcm::new(KeySize::KeySize256, &key, &nonce, &[]);

//     let plaintext = decryptor.decrypt(&buffer, TAG_SIZE).unwrap();
//     file.seek(SeekFrom::Start(0)).unwrap();
//     file.write_all(&plaintext).unwrap();
//     file.set_len(plaintext.len() as u64).unwrap();
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
