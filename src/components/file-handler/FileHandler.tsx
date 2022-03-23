import cn from 'classnames';
import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

import { FileObject } from './types';
import { exposedApi, nanoid } from '../../utils';
import { DigifabsterCloseWidgetClassname, DigifabsterOpenWidgetBtnSelector } from '../../constants';

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

    const { getRootProps, getInputProps } = useDropzone({
        // onDrop,
        onDropAccepted: handleDropAccepted,
        multiple,
        disabled,
        maxFiles,
    });

    const transferModels = useCallback(async () => {
        if (fileObjects.length) {
            await exposedApi.call(
                'transferModels',
                fileObjects.map(fileObject => fileObject.file),
            );

            // reset dropzone files
            setFileObjects([]);
        }
    }, [fileObjects]);

    const handleDocumentClick = useCallback(
        event => {
            const element = event.target;

            if (element.classList.contains(DigifabsterCloseWidgetClassname)) {
                // console.log(event.target);
            } else if (element.closest(DigifabsterOpenWidgetBtnSelector)) {
                transferModels();
            }
        },
        [transferModels],
    );

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
