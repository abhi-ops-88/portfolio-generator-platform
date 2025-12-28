import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const ContactForm = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData('contact', {
      ...data.contact,
      [field]: value
    });
  };

  return (
    <div className="contact-form">
      <div className="form-section">
        <h3 className="section-title">
          <MessageSquare className="w-5 h-5" />
          Contact Information
        </h3>
        <p className="section-description">
          Provide your contact details so visitors can reach out to you
        </p>
        
        <div className="contact-inputs">
          <div className="form-group">
            <label className="form-label">
              <Mail className="w-4 h-4" />
              Email Address *
            </label>
            <input
              type="email"
              className="form-input"
              value={data.contact.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              required
            />
            <small className="form-help">Primary email for professional inquiries</small>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              className="form-input"
              value={data.contact.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
            <small className="form-help">Optional - include if you want to be contacted by phone</small>
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              type="text"
              className="form-input"
              value={data.contact.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="New York, NY, USA"
            />
            <small className="form-help">City, State/Country or "Remote" if you work remotely</small>
          </div>
        </div>

        <div className="contact-preview">
          <h4>Contact Section Preview</h4>
          <p>This is how your contact information will appear:</p>
          <div className="contact-preview-card">
            {data.contact.email && (
              <div className="contact-item-preview">
                <Mail className="w-4 h-4" />
                <span>{data.contact.email}</span>
              </div>
            )}
            {data.contact.phone && (
              <div className="contact-item-preview">
                <Phone className="w-4 h-4" />
                <span>{data.contact.phone}</span>
              </div>
            )}
            {data.contact.location && (
              <div className="contact-item-preview">
                <MapPin className="w-4 h-4" />
                <span>{data.contact.location}</span>
              </div>
            )}
            {!data.contact.email && !data.contact.phone && !data.contact.location && (
              <p className="no-contact">No contact information added yet</p>
            )}
          </div>
        </div>

        <div className="contact-tips">
          <h4>Tips for Contact Information</h4>
          <ul>
            <li>
              <strong>Email:</strong> Use a professional email address that you check regularly
            </li>
            <li>
              <strong>Phone:</strong> Only include if you're comfortable receiving calls from potential employers or clients
            </li>
            <li>
              <strong>Location:</strong> Be as specific or general as you're comfortable with. Many people just put their city or "Remote"
            </li>
            <li>
              <strong>Privacy:</strong> Remember that this information will be publicly visible on your portfolio
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .contact-form {
          max-width: 600px;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .section-description {
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .contact-inputs {
          space-y: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .form-help {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .contact-preview {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .contact-preview h4 {
          margin: 0 0 0.5rem;
          color: #374151;
          font-weight: 600;
        }

        .contact-preview p {
          margin: 0 0 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .contact-preview-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .contact-item-preview {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #374151;
        }

        .contact-item-preview:last-child {
          margin-bottom: 0;
        }

        .no-contact {
          color: #9ca3af;
          font-style: italic;
          margin: 0;
          text-align: center;
          padding: 2rem;
        }

        .contact-tips {
          background: #eff6ff;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #dbeafe;
        }

        .contact-tips h4 {
          margin: 0 0 1rem;
          color: #1e40af;
          font-weight: 600;
        }

        .contact-tips ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #1e40af;
        }

        .contact-tips li {
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }

        .contact-tips li:last-child {
          margin-bottom: 0;
        }

        .contact-tips strong {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ContactForm;