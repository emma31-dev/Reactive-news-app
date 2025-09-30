// IPFS/Web3.Storage integration utility
// Usage: import { uploadToIPFS, uploadToWeb3Storage } from '../lib/ipfs';

// import { create as createIpfsClient } from 'ipfs-http-client';
import { Web3Storage } from 'web3.storage';


// --- Helia-based JSON upload utility ---
import { createHelia } from 'helia';
import { json } from '@helia/json';

/**
 * Uploads a JSON-serializable object to IPFS using Helia and returns the CID and gateway URL.
 * @param data The JSON-serializable object to upload
 * @returns {Promise<{ cid: string, url: string }>} The CID and public gateway URL
 */
export async function uploadToIPFS(data: object): Promise<{ cid: string, url: string }> {
  // Create a Helia node (in-memory, browser-friendly)
  const helia = await createHelia();
  const j = json(helia);
  // Add the object to IPFS
  const cid = await j.add(data);
  return {
    cid: cid.toString(),
    url: `https://ipfs.io/ipfs/${cid}`,
  };
}

// --- Web3.Storage (requires API token) ---
function getWeb3StorageClient() {
  const token = process.env.WEB3_STORAGE_TOKEN || '';
  if (!token) throw new Error('WEB3_STORAGE_TOKEN env variable not set');
  return new Web3Storage({ token });
}

export async function uploadToWeb3Storage(data: object | Blob | Buffer, filename = 'data.json') {
  const client = getWeb3StorageClient();
  let file;
  if (data instanceof Blob) {
    file = data;
  } else if (Buffer.isBuffer(data)) {
    // Convert Buffer to Uint8Array for Blob compatibility
    file = new Blob([new Uint8Array(data)], { type: 'application/octet-stream' });
  } else {
    file = new Blob([JSON.stringify(data)], { type: 'application/json' });
  }
  const files = [new File([file], filename)];
  const cid = await client.put(files);
  return {
    cid,
    url: `https://w3s.link/ipfs/${cid}`,
  };
}
