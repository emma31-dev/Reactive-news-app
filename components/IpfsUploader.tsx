import React, { useState } from 'react';

export default function IpfsUploader() {
  const [json, setJson] = useState('{"hello":"world"}');
  const [result, setResult] = useState<{cid: string, url: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ipfs-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || 'Upload failed');
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white dark:bg-neutral-900 rounded shadow mt-8">
      <h2 className="font-bold mb-2">Upload JSON to IPFS</h2>
      <textarea
        className="w-full p-2 border rounded mb-2 bg-neutral-100 dark:bg-neutral-800 text-sm font-mono"
        rows={6}
        value={json}
        onChange={e => setJson(e.target.value)}
        disabled={loading}
      />
      <button
        className="btn btn-primary w-full mb-2"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload to IPFS'}
      </button>
      {result && (
        <div className="mt-2 text-xs break-all">
          <div><b>CID:</b> {result.cid}</div>
          <div><b>URL:</b> <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{result.url}</a></div>
        </div>
      )}
      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
    </div>
  );
}
