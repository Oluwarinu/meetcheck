import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Assuming you have a Progress component from shadcn/ui
import { AlertCircle, CheckCircle, File as FileIcon, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // For conditional class names

interface FileUploadInputProps {
  onChange: (file: File | null) => void;
  acceptedFileTypes?: string[]; // e.g., ['image/png', '.pdf']
  maxFileSizeMB?: number;
  initialFile?: File | null; // For pre-filling if needed (e.g. in an edit scenario, though less common for pure uploads)
  id?: string;
}

export default function FileUploadInput({
  onChange,
  acceptedFileTypes,
  maxFileSizeMB,
  initialFile = null,
  id = 'file-upload',
}: FileUploadInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // Mock progress
  const [isUploading, setIsUploading] = useState(false); // Mock upload state

  useEffect(() => {
    // If initialFile changes, update internal state
    setSelectedFile(initialFile);
    if (initialFile) {
        // Potentially simulate completion if a file is pre-filled and considered 'uploaded'
        setProgress(100);
        setIsUploading(false);
    } else {
        setProgress(0);
    }
  }, [initialFile]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      setProgress(0);
      setIsUploading(false);

      if (rejectedFiles && rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        if (firstError.code === 'file-too-large') {
          setError(`File is too large. Max size is ${maxFileSizeMB}MB.`);
        } else if (firstError.code === 'file-invalid-type') {
          setError(`Invalid file type. Accepted types: ${acceptedFileTypes?.join(', ')}`);
        } else {
          setError(firstError.message);
        }
        setSelectedFile(null);
        onChange(null);
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onChange(file);

        // Simulate upload progress
        setIsUploading(true);
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += 10;
          if (currentProgress <= 100) {
            setProgress(currentProgress);
          } else {
            clearInterval(interval);
            setIsUploading(false);
            // You might want to set progress to 100 explicitly here
            // setProgress(100); // Or handle it based on actual upload success in real scenario
          }
        }, 100); // Adjust timing for simulation
      }
    },
    [onChange, maxFileSizeMB, acceptedFileTypes]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedFileTypes ? acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}) : undefined,
    maxSize: maxFileSizeMB ? maxFileSizeMB * 1024 * 1024 : undefined,
    multiple: false,
    onFileDialogOpen: () => { // Clear errors when dialog opens
        setError(null);
        // Optionally reset file and progress if dialog is re-opened
        // setSelectedFile(null);
        // onChange(null);
        // setProgress(0);
    }
  });

  const handleRemoveFile = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent opening file dialog if remove button is inside dropzone
    setSelectedFile(null);
    onChange(null);
    setError(null);
    setProgress(0);
    setIsUploading(false);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600',
          error ? 'border-destructive bg-destructive/10' : '',
          selectedFile && !error && !isUploading ? 'border-green-500 bg-green-500/10' : ''
        )}
      >
        <input {...getInputProps()} id={id} />
        {selectedFile && !error ? (
          <div className="text-center">
            <FileIcon className="w-12 h-12 mx-auto text-gray-600 dark:text-gray-400" />
            <p className="mt-2 font-semibold text-gray-700 dark:text-gray-300">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatBytes(selectedFile.size)}</p>
            {isUploading && <Progress value={progress} className="w-full mt-2 h-2" />}
            {!isUploading && progress === 100 && <CheckCircle className="w-6 h-6 mx-auto text-green-500 mt-1" />}
            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="mt-2 text-destructive hover:text-destructive/80">
              <X className="w-4 h-4 mr-1" /> Remove File
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <UploadCloud className={cn("w-12 h-12 mx-auto", error ? "text-destructive" : "text-gray-400 dark:text-gray-500")} />
            <p className={cn("mt-2 text-sm", error ? "text-destructive" : "text-gray-600 dark:text-gray-300")}>
              {isDragActive ? 'Drop the file here ...' : "Drag 'n' drop a file here, or click to select"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {acceptedFileTypes && `Accepted: ${acceptedFileTypes.join(', ')}.`} {maxFileSizeMB && `Max size: ${maxFileSizeMB}MB.`}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={open} className="mt-4">
              Select File
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center text-sm text-destructive p-2 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
