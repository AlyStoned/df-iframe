import cn from 'classnames';
import React, { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import Modal from 'react-responsive-modal';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    decrement,
    increment,
    selectCount,
} from './counterSlice';
import { FileObject } from './types';

import styles from './Counter.module.css';

const maxFiles = 1
const multiple = maxFiles > 1;

export function Counter() {
    const dispatch = useAppDispatch();
    const count = useAppSelector(selectCount);
    const [isIframeOpen, setIframeOpen] = useState(false);

    const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
    const disabled = fileObjects.length === maxFiles;

    const handleDropAccepted: DropzoneOptions['onDropAccepted'] = (acceptedFiles, evt) => {
        const fileObjs = acceptedFiles.map(file => {
            return {
                uuid: nanoid(),
                file,
            };
        })

        // Notify added files
        setFileObjects(exists => {
            // Handle a single file
            if (maxFiles <= 1) {
                return [fileObjs[0]];
            }

            // Handle multiple files
            return exists.concat(fileObjs);
        });
    };

    const handleRemove = (uuit: string) => (event: MouseEvent) => {
        event.stopPropagation(); // case into dropzone

        // Update local state
        setFileObjects(exists => exists.filter(fileObject => fileObject.uuid !== uuit));
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        // onDrop,
        onDropAccepted: handleDropAccepted,
        multiple,
        disabled,
        maxFiles,
    });

    return (
        <div>
            <div className={cn(styles.row, {'hidden': disabled})}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drop file here, or click to select file</p>
                </div>
            </div>
            <div className={cn(styles.row, {'hidden': !disabled})}>
                {fileObjects.map(fileObject => (
                    <button
                        key={fileObject.uuid}
                        title='Click to remove'
                        // @ts-ignore
                        onClick={handleRemove(fileObject.uuid)}
                    >
                        {fileObject.file.name}
                    </button>
                ))}
            </div>

            <div className={styles.row}>
                <button
                    className={styles.button}
                    onClick={() => setIframeOpen(true)}
                >
                    Open Iframe
                </button>
            </div>

            <Modal
                open={isIframeOpen}
                onClose={() => setIframeOpen(false)}
                closeOnEsc={true}
                center={true}
                classNames={{
                    modal: styles.popup,
                }}
            >
                <iframe id="df-iframe"
                        title="DF Iframe Example"
                        width="800"
                        height="720"
                        frameBorder="0"
                        allow="fullscreen"
                        src="http://localhost:4200/4taps/widget/cart">
                </iframe>
            </Modal>
        </div>
    );
}
