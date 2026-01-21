import React, { useState, useRef } from 'react';
import { uploadExcelFile } from '../../services/formSubmitApi';
import './UploadPage.css';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedSheets, setUploadedSheets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await uploadExcelFile(selectedFile);
      
      // Add the uploaded file to the list
      const uploadedSheet = {
        id: Date.now(),
        name: selectedFile.name,
        size: selectedFile.size,
        uploadedAt: new Date().toLocaleString()
      };
      
      setUploadedSheets(prev => [uploadedSheet, ...prev]);
      setSelectedFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h2>Excel Upload</h2>
          <p>Upload an Excel file to bulk import content metadata</p>
        </div>
        
        <div className="upload-area">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept=".xlsx,.xls"
            className="file-input-hidden"
          />
          
          <div 
            className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
            onClick={handleDropzoneClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <>
                <div className="upload-icon">📊</div>
                <h3>Drop your Excel file here</h3>
                <p>or click to browse files</p>
                <span className="file-types">Supports: .xlsx, .xls</span>
              </>
            ) : (
              <div className="selected-file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {selectedFile && (
          <div className="upload-actions">
            <button 
              className="btn-clear"
              onClick={handleClearFile}
              disabled={isLoading}
            >
              Clear
            </button>
            <button 
              className="btn-upload"
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        )}

        {uploadedSheets.length > 0 && (
          <div className="uploaded-sheets-section">
            <h3>Uploaded Sheets</h3>
            <div className="uploaded-sheets-list">
              {uploadedSheets.map((sheet) => (
                <div key={sheet.id} className="uploaded-sheet-card">
                  <div className="sheet-icon">📊</div>
                  <div className="sheet-info">
                    <span className="sheet-name">{sheet.name}</span>
                    <span className="sheet-meta">
                      {formatFileSize(sheet.size)} • {sheet.uploadedAt}
                    </span>
                  </div>
                  <div className="sheet-status">
                    <span className="status-badge success">Uploaded</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
