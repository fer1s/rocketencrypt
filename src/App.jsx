import { useState } from "react";
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile, writeBinaryFile, exists } from "@tauri-apps/api/fs"
import './styles/app.css'
import AES from "./AES";
import { writeText } from '@tauri-apps/api/clipboard';

function App() {

  const [selectedFile, setSelectedFile] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [log, setLog] = useState('');

  const openFile = async () => {
    const selected = await open({
      multiple: false,
    });

    if (selected === null) {
      return;
    } else {
      setSelectedFile(selected)
    }
  }
  const sendLog = (txt) => {
    setLog(txt)
    setTimeout(() => {
      setLog('')
    }, 3000);
  }
  const generateKey = async () => {
    const key = crypto.randomUUID();
    setEncryptionKey(key);
    await writeText(key);
    sendLog("Key was copied to clipboard");
  }

  const secureFilePath = async (path) => {
    var count = 0;
    while(await exists(path)) 
      path = `${path.split(".")[0]} (${count++}).${path.split(".").slice(1).join(".")}`;
    return path;
  }

  const handleEncrypt = async () => {
    if (!selectedFile) return setLog("No file selected");
    if (!encryptionKey) return setLog("No encryption key provided");

    try {
      const fileContent = await readBinaryFile(selectedFile)
      const encryptedBytes = await AES.encrypt(fileContent, encryptionKey);
      const destionationPath = selectedFile + ".rcktncrypt";

      await writeBinaryFile(await secureFilePath(destionationPath), encryptedBytes)
      sendLog(`Successfully encrypted file ${destionationPath.slice(destionationPath.lastIndexOf("\\") + 1)}`)
      setSelectedFile('');
      setEncryptionKey('');
    } catch (error) {
      setLog('Some error occured')
      console.log(error)
    }
  }

  const handleDecrypt = async () => {
    if (!selectedFile) return setLog("No file selected");
    if (!selectedFile.endsWith(".rcktncrypt")) return setLog("File isn't a RocketEncrypt file");
    if (!encryptionKey) return setLog("No encryption key provided");

    try {
      const fileContent = await readBinaryFile(selectedFile)
      const decryptedBytes = await AES.decrypt(fileContent, encryptionKey)
      const destionationPath = selectedFile.split(".").slice(0, -1).join(".");

      await writeBinaryFile(await secureFilePath(destionationPath), decryptedBytes)
      sendLog(`Successfully decrypted file ${destionationPath.slice(destionationPath.lastIndexOf("\\") + 1)}`)
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
      <p>Remember to keep your key in a safe place</p>
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
      <p className={`log ${log && " show"}`}>{log || <>&nbsp;</>}</p>
      {/* <input type="text" placeholder="Encryption key" /> */}
    </div>
  );
}

export default App;
