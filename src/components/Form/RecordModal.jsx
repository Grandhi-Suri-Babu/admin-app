import React, { useState, useEffect } from 'react';
import { isValidUrl } from '../../utils/validators';
import './RecordModal.css';

const RecordModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  sectionTitle, 
  fields, 
  initialData = {} 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate URL fields
  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.validateUrl && formData[field.name]) {
        if (!isValidUrl(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid URL';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  // Render a single form field
  const renderField = (field) => {
    const hasError = errors[field.name];
    
    return (
      <div key={field.name} className={`modal-form-group ${hasError ? 'has-error' : ''}`}>
        <label htmlFor={`modal-${field.name}`}>
          {field.label}
        </label>
        
        {field.type === 'select' && (
          <select
            id={`modal-${field.name}`}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className={hasError ? 'error' : ''}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
        
        {field.type === 'textarea' && (
          <textarea
            id={`modal-${field.name}`}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={3}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {(field.type === 'text' || field.type === 'url') && (
          <input
            type="text"
            id={`modal-${field.name}`}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {field.type === 'number' && (
          <input
            type="number"
            id={`modal-${field.name}`}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            min={field.min}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {field.type === 'date' && (
          <input
            type="date"
            id={`modal-${field.name}`}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {hasError && <span className="modal-error-message">{errors[field.name]}</span>}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>{initialData && Object.keys(initialData).length > 0 ? 'Edit' : 'Add'} {sectionTitle}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <div className="modal-fields-grid">
            {fields.map(field => renderField(field))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordModal;

