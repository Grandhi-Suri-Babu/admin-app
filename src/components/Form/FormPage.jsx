import React, { useState } from 'react';
import CollapsibleSection from './CollapsibleSection';
import RecordCard from './RecordCard';
import RecordModal from './RecordModal';
import { commonFields, sections } from '../../data/formFields';
import { validateForm, isFormValid } from '../../utils/validators';
import { submitFormData, ApiError } from '../../services/formSubmitApi';
import { transformFormToPayload } from '../../utils/payloadTransformer';
import './FormPage.css';

const FormPage = () => {
  // Common form data state (single values)
  const [commonData, setCommonData] = useState({});
  
  // Section records state (arrays) - keys match API payload
  const [records, setRecords] = useState({
    news: [],
    audio: [],
    events: [],
    chat: []
  });
  
  // Expanded sections state - all expanded by default (keys match section IDs)
  const [expandedSections, setExpandedSections] = useState({
    news: true,
    audio: true,
    events: true,
    chat: true
  });
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    sectionId: null,
    sectionTitle: '',
    fields: [],
    editIndex: null,
    data: {}
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  
  // Submit status
  const [submitStatus, setSubmitStatus] = useState({ show: false, success: false, message: '' });
  
  // Loading state for API call
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle common field input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommonData(prev => ({
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

  // Toggle section expand/collapse
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Open modal to add new record
  const handleAddRecord = (section) => {
    setModalState({
      isOpen: true,
      sectionId: section.id,
      sectionTitle: section.title.replace(' Section', ''),
      fields: section.fields,
      editIndex: null,
      data: {}
    });
  };

  // Open modal to edit existing record
  const handleEditRecord = (section, index) => {
    setModalState({
      isOpen: true,
      sectionId: section.id,
      sectionTitle: section.title.replace(' Section', ''),
      fields: section.fields,
      editIndex: index,
      data: records[section.id][index]
    });
  };

  // Delete record
  const handleDeleteRecord = (sectionId, index) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => ({
        ...prev,
        [sectionId]: prev[sectionId].filter((_, i) => i !== index)
      }));
    }
  };

  // Save record from modal
  const handleSaveRecord = (data) => {
    const { sectionId, editIndex } = modalState;
    
    if (editIndex !== null) {
      // Update existing record
      setRecords(prev => ({
        ...prev,
        [sectionId]: prev[sectionId].map((record, i) => 
          i === editIndex ? data : record
        )
      }));
    } else {
      // Add new record
      setRecords(prev => ({
        ...prev,
        [sectionId]: [...prev[sectionId], data]
      }));
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      sectionId: null,
      sectionTitle: '',
      fields: [],
      editIndex: null,
      data: {}
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mandatory common fields
    const validationErrors = validateForm(commonData);
    setErrors(validationErrors);
    
    if (!isFormValid(validationErrors)) {
      const errorCount = Object.keys(validationErrors).length;
      setSubmitStatus({
        show: true,
        success: false,
        message: `Please fix ${errorCount} error(s) in Common Information.`
      });
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ show: false, success: false, message: '' });
      }, 5000);
      return;
    }
    
    // Generate API payload with proper format
    const payload = transformFormToPayload(commonData, records);
    
    // Log payload for debugging
    console.log('API Payload:', JSON.stringify(payload, null, 2));
    
    // Submit to API
    setIsSubmitting(true);
    
    try {
      await submitFormData(payload);
      
      setSubmitStatus({
        show: true,
        success: true,
        message: 'Form submitted successfully!'
      });
      
      // Reset form data on success (but keep the success message)
      setCommonData({});
      setRecords({
        news: [],
        audio: [],
        events: [],
        chat: []
      });
      setErrors({});
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitStatus({
        show: true,
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ show: false, success: false, message: '' });
      }, 5000);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setCommonData({});
    setRecords({
      news: [],
      audio: [],
      events: [],
      chat: []
    });
    setErrors({});
    setExpandedSections({
      news: true,
      audio: true,
      events: true,
      chat: true
    });
    setSubmitStatus({ show: false, success: false, message: '' });
  };

  // Render a single common form field
  const renderField = (field) => {
    const hasError = errors[field.name];
    
    return (
      <div key={field.name} className={`form-group ${hasError ? 'has-error' : ''}`}>
        <label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="required-mark">*</span>}
        </label>
        
        {field.type === 'select' && (
          <select
            id={field.name}
            name={field.name}
            value={commonData[field.name] || ''}
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
            id={field.name}
            name={field.name}
            value={commonData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={4}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {(field.type === 'text' || field.type === 'url') && (
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={commonData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {field.type === 'number' && (
          <input
            type="number"
            id={field.name}
            name={field.name}
            value={commonData[field.name] || ''}
            onChange={handleInputChange}
            min={field.min}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {field.type === 'date' && (
          <input
            type="date"
            id={field.name}
            name={field.name}
            value={commonData[field.name] || ''}
            onChange={handleInputChange}
            className={hasError ? 'error' : ''}
          />
        )}
        
        {hasError && <span className="error-message">{errors[field.name]}</span>}
      </div>
    );
  };

  // Get record count for a section
  const getRecordCount = (sectionId) => {
    return records[sectionId]?.length || 0;
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Content Form</h2>
        </div>
        
        {submitStatus.show && (
          <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Common Information Section */}
          <div className="common-fields-section">
            <h3>Common Information Section</h3>
            <div className="fields-grid">
              {commonFields.map(field => renderField(field))}
            </div>
          </div>
          
          {/* Collapsible Sections with Records */}
          {sections.map(section => (
            <CollapsibleSection
              key={section.id}
              title={`${section.title} (${getRecordCount(section.id)})`}
              isExpanded={expandedSections[section.id]}
              onToggle={() => toggleSection(section.id)}
            >
              <div className="section-content">
                {/* Add Record Button */}
                <div className="section-actions">
                  <button
                    type="button"
                    className="btn btn-add"
                    onClick={() => handleAddRecord(section)}
                  >
                    + Add {section.title.replace(' Section', '')} Record
                  </button>
                </div>
                
                {/* Records Grid */}
                {records[section.id]?.length > 0 ? (
                  <div className="records-grid">
                    {records[section.id].map((record, index) => (
                      <RecordCard
                        key={index}
                        record={record}
                        fields={section.fields}
                        index={index}
                        onEdit={() => handleEditRecord(section, index)}
                        onDelete={() => handleDeleteRecord(section.id, index)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No {section.title.replace(' Section', '').toLowerCase()} records added yet.</p>
                    <p className="empty-hint">Click the button above to add a record.</p>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          ))}
          
          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset Form
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Record Modal */}
      <RecordModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRecord}
        sectionTitle={modalState.sectionTitle}
        fields={modalState.fields}
        initialData={modalState.data}
      />
    </div>
  );
};

export default FormPage;
