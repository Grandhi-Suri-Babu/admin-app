import React from 'react';
import './RecordCard.css';

const RecordCard = ({ record, fields, index, onEdit, onDelete }) => {
  // Get display values for the card (first 4 fields with values)
  const getDisplayFields = () => {
    const displayFields = [];
    for (const field of fields) {
      if (record[field.name] && displayFields.length < 4) {
        displayFields.push({
          label: field.label,
          value: record[field.name]
        });
      }
    }
    return displayFields;
  };

  const displayFields = getDisplayFields();

  return (
    <div className="record-card">
      <div className="record-card-header">
        <span className="record-number">Record {index + 1}</span>
        <div className="record-actions">
          <button 
            type="button" 
            className="btn-icon btn-edit" 
            onClick={() => onEdit(index)}
            title="Edit record"
          >
            ✏️
          </button>
          <button 
            type="button" 
            className="btn-icon btn-delete" 
            onClick={() => onDelete(index)}
            title="Delete record"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="record-card-body">
        {displayFields.length > 0 ? (
          <div className="record-fields">
            {displayFields.map((field, idx) => (
              <div key={idx} className="record-field">
                <span className="field-label">{field.label}</span>
                <span className="field-value" title={field.value}>
                  {field.value.length > 30 ? `${field.value.substring(0, 30)}...` : field.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No data entered</p>
        )}
      </div>
    </div>
  );
};

export default RecordCard;

