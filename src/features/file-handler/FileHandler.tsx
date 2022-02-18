import cn from 'classnames';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import Modal from 'react-responsive-modal';

// import { useAppSelector, useAppDispatch } from '../../app/hooks';
// import { decrement, increment, selectCount } from './counterSlice';
import { ClientExposedAPI } from '../../utils';
import { FileObject } from './types';
import { Iframe } from './Iframe';

import styles from './FileHandler.module.css';

const iframeSrc = 'https://app-test.digifabster.com/4taps/widget/upload';
// const iframeSrc = 'http://localhost:4200/4taps/widget/cart';
const maxFiles = 1;
const multiple = maxFiles > 1;

export function FileHandler() {
    // const dispatch = useAppDispatch();
    // const count = useAppSelector(selectCount);
    const exposedAPI = useRef<ClientExposedAPI>();

    const [isIframeOpen, setIframeOpen] = useState(false);

    const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
    const disabled = fileObjects.length === maxFiles;

    const handleDropAccepted: DropzoneOptions['onDropAccepted'] = (acceptedFiles, evt) => {
        const fileObjs = acceptedFiles.map(file => {
            return {
                uuid: nanoid(),
                file,
            };
        });

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        // onDrop,
        onDropAccepted: handleDropAccepted,
        multiple,
        disabled,
        maxFiles,
    });

    const onAPIReady = useCallback(
        async event => {
            if (fileObjects.length) {
                // console.log('onAPIReady', fileObjects);
                await event.data.models.transfer(fileObjects.map(fileObject => fileObject.file));

                // reset dropzone files
                setFileObjects([]);
            }

            // console.log('result 1 + 3 = ', await event.data.add(1, 3));
            // console.log('field = ', await event.data.field);
            // console.log('test', exposedAPI.current && exposedAPI.current.call('test', false, '343'));
            // exposedAPI.current && exposedAPI.current.call('add', 3, 6);
            // exposedAPI.current && exposedAPI.current.api?.add(3, 6);
        },
        [fileObjects],
    );

    return (
        <div>
            <div className={cn(styles.row, { hidden: disabled })}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drop file here, or click to select file</p>
                </div>
            </div>
            <div className={cn(styles.row, { hidden: !disabled })}>
                {fileObjects.map(fileObject => (
                    <button
                        key={fileObject.uuid}
                        title="Click to remove"
                        // @ts-ignore
                        onClick={handleRemove(fileObject.uuid)}
                    >
                        {fileObject.file.name}
                    </button>
                ))}
            </div>

            <div className={styles.row}>
                <button className={styles.button} onClick={() => setIframeOpen(true)}>
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
                <Iframe exposedAPI={exposedAPI} onAPIReady={onAPIReady} src={iframeSrc} />
            </Modal>
        </div>
    );
}
