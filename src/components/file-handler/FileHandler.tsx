import cn from 'classnames';
import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { Event } from '@billjs/event-emitter';

import { FileObject } from './types';
import { exposedApi, nanoid } from '../../utils';

import styles from './FileHandler.module.css';

const maxFiles = 1;
const multiple = maxFiles > 1;

export function FileHandler() {
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

    const transferModels = useCallback(
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

    // transferModels && exposedAPI.current.once('ready', transferModels);
    // onAPIReady?: (event: Event) => void;

    const handleDocumentClick = useCallback(event => {
        const element = event.target;

        if (element.classList.contains('df-widget-close')) {
            console.log(event.target);
        } else if (element.closest('#df-widget-btn')) {
            console.log(event.target, 'element.id');
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [handleDocumentClick]);

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
        </div>
    );
}
