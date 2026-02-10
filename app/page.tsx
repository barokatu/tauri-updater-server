'use client';

import { useState, useEffect } from 'react';

interface PlatformData {
  signature: string;
  url: string;
}

interface UpdateData {
  version: string;
  notes: string;
  pub_date: string;
  platforms: Record<string, PlatformData>;
}

const PLATFORMS = [
  'linux-x86_64',
  'windows-x86_64',
  'darwin-x86_64',
  'darwin-aarch64',
];

export default function Home() {
  const [data, setData] = useState<UpdateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/updates');
      if (response.ok) {
        const json = await response.json();
        setData(json);
      } else {
        setMessage({ type: 'error', text: 'Failed to load update data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading update data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Update data saved successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save update data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving update data' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      loadData();
      setMessage(null);
    }
  };

  const updateField = (field: keyof UpdateData, value: string) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const updatePlatform = (platform: string, field: keyof PlatformData, value: string) => {
    if (!data) return;
    setData({
      ...data,
      platforms: {
        ...data.platforms,
        [platform]: {
          ...data.platforms[platform],
          [field]: value,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <div className="card">
          <p>Failed to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Tauri Updater Server <sub style={{fontSize: 12}}><a href='https://github.com/barokatu/'>by Barokatu</a></sub></h1>
        
        <div className="info-box">
          <strong>API Endpoint:</strong>
          <code>GET /api/updates</code>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            This endpoint returns the update JSON that Tauri apps will check for updates.
            Configure your Tauri app to use this URL as the endpoint.
          </p>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="version">Version *</label>
          <input
            id="version"
            type="text"
            value={data.version}
            onChange={(e) => updateField('version', e.target.value)}
            placeholder="e.g., 1.0.0 or v1.0.0"
          />
          <small style={{ color: '#666', fontSize: '0.9rem', display: 'block', marginTop: '0.25rem' }}>
            Must be a valid SemVer (with or without leading v)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Release Notes</label>
          <textarea
            id="notes"
            value={data.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Release notes for this update..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="pub_date">Publication Date</label>
          <input
            id="pub_date"
            type="datetime-local"
            value={data.pub_date ? new Date(data.pub_date).toISOString().slice(0, 16) : ''}
            onChange={(e) => updateField('pub_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
          />
          <small style={{ color: '#666', fontSize: '0.9rem', display: 'block', marginTop: '0.25rem' }}>
            Date must be formatted according to RFC 3339
          </small>
        </div>

        <h2>Platforms</h2>
        <div className="platforms-grid">
          {PLATFORMS.map((platform) => (
            <div key={platform} className="platform-card">
              <h3>{platform.replace('-', ' ')}</h3>
              <div className="form-group">
                <label htmlFor={`${platform}-url`}>Download URL *</label>
                <input
                  id={`${platform}-url`}
                  type="url"
                  value={data.platforms[platform]?.url || ''}
                  onChange={(e) => updatePlatform(platform, 'url', e.target.value)}
                  placeholder="https://example.com/update.tar.gz"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`${platform}-signature`}>Signature *</label>
                <textarea
                  id={`${platform}-signature`}
                  value={data.platforms[platform]?.signature || ''}
                  onChange={(e) => updatePlatform(platform, 'signature', e.target.value)}
                  placeholder="Paste the content of the .sig file here"
                  rows={4}
                />
                <small style={{ color: '#666', fontSize: '0.9rem', display: 'block', marginTop: '0.25rem' }}>
                  Content of the generated .sig file (not a path or URL)
                </small>
              </div>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button
            className="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            className="button button-secondary"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </button>
        </div>

        <h2>JSON Preview</h2>
        <div className="json-preview">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
