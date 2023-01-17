import { useState } from "react";
import { open } from '@tauri-apps/api/dialog';
import { invoke } from "@tauri-apps/api/tauri";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import CryptoJS from "crypto-js";
import './styles/app.css'

function App() {

  const [selectedFile, setSelectedFile] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [log, setLog] = useState('');

  const openFile = async () => {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Text file',
        extensions: ['txt']
      }]
    });

    if (selected === null) {
      return;
    } else {
      setSelectedFile(selected)
    }
  }
  const generateKey = () => {
    const generatedKey = CryptoJS.lib.WordArray.random(32);

    setEncryptionKey(generatedKey)
  }
  const sendLog = (txt) => {
    setLog(txt)
    setTimeout(() => {
      setLog('')
    }, 3000);
  }


  const handleEncrypt = async () => {
    if (!selectedFile) return setLog("No file selected");
    if (!encryptionKey) return setLog("No encryption key provided");

    try {
      const fileContent = await readTextFile(selectedFile)
      const cipherText = CryptoJS.AES.encrypt(fileContent, encryptionKey, { iv: 'rocketencryptxyz' }).toString();

      await writeTextFile(selectedFile, cipherText)
      sendLog(`Successfully encrypted file ${selectedFile.split('\\')[selectedFile.split('\\').length - 1]}`)
      setSelectedFile('');
      setEncryptionKey('');
    } catch (error) {
      setLog('Some error occured')
      console.log(error)
    }
  }

  const handleDecrypt = async () => {
    if (!selectedFile) return setLog("No file selected");
    if (!encryptionKey) return setLog("No encryption key provided");

    try {
      const fileContent = await readTextFile(selectedFile)
      const bytes = CryptoJS.AES.decrypt(fileContent, encryptionKey)
      const normalText = bytes.toString(CryptoJS.enc.Utf8)

      await writeTextFile(selectedFile, normalText)
      sendLog(`Successfully decrypted file ${selectedFile.split('\\')[selectedFile.split('\\').length - 1]}`)
      setSelectedFile('');
      setEncryptionKey('');
    } catch (error) {
      setLog('Some error occured')
      console.log(error)
    }
  }

  return (
    <div className="main">
      <h1>RocketEncrypt</h1>
      <p>- The key must be 32 bytes</p>
      <p>- Keep the key in a safe place</p>
      <p>- Copy key before encrypt/decrypt</p>
      <div className="break" />
      <div className="input">
        <div className="icon">
          <i className='bx bx-file-blank'></i>
        </div>
        <button onClick={() => openFile()}>{selectedFile ? `${selectedFile.split('\\')[selectedFile.split('\\').length - 1]}` : 'Select file'}</button>
      </div>
      <div className="input">
        <div className="icon">
          <i className='bx bx-key' ></i>
        </div>
        <input type="text" placeholder="Encryption key" value={encryptionKey} onChange={(e) => setEncryptionKey(e.target.value)} />
        <div className="generate" onClick={generateKey}>
          <i className='bx bx-dice-5' ></i>
        </div>
      </div>
      <div className="buttons">
        <button onClick={handleEncrypt}>Encrypt</button>
        <button onClick={handleDecrypt}>Decrypt</button>
      </div>
      <p>{log}</p>
      {/* <input type="text" placeholder="Encryption key" /> */}
    </div>
  );
}

export default App;
