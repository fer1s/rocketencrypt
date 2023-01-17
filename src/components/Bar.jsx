import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import '../styles/bar.css'

const Bar = () => {
    return (
        <div className='bar' data-tauri-drag-region>
            <div className="buttons">
                <div className="button" onClick={() => appWindow.close()} />
                <div className="button" onClick={() => appWindow.minimize()} />
            </div>
            <i className='bx bx-rocket bg'></i>
            <i className='bx bx-rocket'></i>
        </div>
    )
}

export default Bar