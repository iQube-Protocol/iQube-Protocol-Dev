import React, { useState } from 'react';
import { pinata } from '../../utilities/pinata-config';
import PolygonNFTInterface from '../../utilities/MetaContract';
import axios from 'axios';

interface MetadataFields {
  iQubeIdentifier: string;
  iQubeCreator: string;
  ownerType: 'Person' | 'Organisation' | 'Thing';
  iQubeContentType: 'mp3' | 'mp4' | 'pdf' | 'txt' | 'Code' | 'Other';
  ownerIdentifiability: 'Anonymous' | 'Semi-Anonymous' | 'Identifiable' | 'Semi-Identifiable';
  transactionDate: string;
  sensitivityScore: number;
  verifiabilityScore: number;
  accuracyScore: number;
  riskScore: number;
}

interface BlakQubeFields {
  format?: string;
  episode?: string;
  version?: string;
  rarity?: string;
  serialNumber?: string;
  specificTraits?: string;
  payloadFile?: string;
  currentOwner?: string;
  updatableData?: string;
}

interface ContentQubeProps {
  nftInterface: PolygonNFTInterface;
  onContentChange?: (content: any) => void;
}

const ContentQube: React.FC<ContentQubeProps> = ({ nftInterface, onContentChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  
  // State for BlakQube structured data
  const [blakQubeData, setBlakQubeData] = useState<BlakQubeFields>({
    format: '',
    episode: '',
    version: '',
    rarity: '',
    serialNumber: '',
    specificTraits: '',
    payloadFile: '',
    currentOwner: '',
    updatableData: ''
  });

  // State for MetaQube data
  const [metaQubeData, setMetaQubeData] = useState<MetadataFields>({
    iQubeIdentifier: '',
    iQubeCreator: '',
    ownerType: 'Person',
    iQubeContentType: 'Other',
    ownerIdentifiability: 'Semi-Anonymous',
    transactionDate: new Date().toISOString(),
    sensitivityScore: 5,
    verifiabilityScore: 5,
    accuracyScore: 5,
    riskScore: 5
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create file preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlakQubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlakQubeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMetaQubeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetaQubeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMint = async () => {
    if (!selectedFile) {
      setError('Please select a file to mint');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload file to IPFS
      const fileUpload = await pinata.upload.file(selectedFile);

      // Prepare metadata
      const metaQube: MetadataFields = {
        ...metaQubeData,
        iQubeIdentifier: `ContentQube-${Date.now()}`,
        iQubeContentType: selectedFile.type.includes('image') ? 'Other' : 
                          selectedFile.type.includes('video') ? 'mp4' :
                          selectedFile.type.includes('audio') ? 'mp3' :
                          selectedFile.type.includes('pdf') ? 'pdf' :
                          selectedFile.type.includes('text') ? 'txt' : 'Other',
      };

      // Prepare encrypted content data
      const contentQubeData = {
        metaQube,
        blakQube: {
          ...blakQubeData,
          blobFile: selectedFile,
          blobPreview: filePreview,
          encryptedFileHash: fileUpload.IpfsHash,
        }
      };

      // Encrypt the content
      const encryptedFile = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/encrypt-file`, 
        { file: fileUpload.IpfsHash }
      );

      // Encrypt BlakQube data
      const encryptedBlakQube = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/encrypt-data`,
        {
          ...contentQubeData.blakQube,
          blobFile: null,
          blobPreview: null,
          encryptedFileHash: fileUpload.IpfsHash,
          encryptedFileKey: encryptedFile.data.key
        }
      );

      if (!encryptedBlakQube.data.success) {
        throw new Error('Failed to encrypt BlakQube data');
      }

      // Create metadata
      const metadata = JSON.stringify({
        name: `ContentQube NFT #${Date.now()}`,
        description: 'An encrypted ContentQube NFT',
        image: encryptedFile.data,
        attributes: [
          { trait_type: 'metaQube', value: contentQubeData.metaQube },
          { trait_type: 'blakQube', value: encryptedBlakQube.data.encryptedData.blakQube }
        ],
      });

      // Upload metadata to IPFS
      const metadataUpload = await pinata.upload.json(JSON.parse(metadata));

      // Mint NFT
      const receipt = await nftInterface.mintQube(
        `ipfs://${metadataUpload.IpfsHash}`,
        encryptedBlakQube.data.encryptedData.key
      );

      const newTokenId = await nftInterface.getTokenIdFromReceipt(receipt);
      if (newTokenId) {
        setTokenId(newTokenId);
        console.log('NFT minted successfully with token ID:', newTokenId);
        
        // Call onContentChange if provided
        if (onContentChange) {
          onContentChange({
            metaQube,
            blakQube: {
              ...contentQubeData.blakQube,
              encryptedFileKey: encryptedFile.data.key,
              tokenId: newTokenId
            }
          });
        }
      } else {
        console.log("NFT minted successfully, but couldn't retrieve token ID");
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      setError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      
      {/* MetaQube Data Section */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-green-500">
            <path d="M18 1.5c-2.9 0-5.25 2.35-5.25 5.25v3h-7.5a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3a3.75 3.75 0 1 1 7.5 0v1.5h1.5v-1.5c0-2.9-2.35-5.25-5.25-5.25Z" />
          </svg>
          MetaQube
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="iQubeIdentifier"
            placeholder="iQube Identifier"
            value={metaQubeData.iQubeIdentifier}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          />
          <input 
            type="text" 
            name="iQubeCreator"
            placeholder="iQube Creator"
            value={metaQubeData.iQubeCreator}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          />
          <select 
            name="ownerType"
            value={metaQubeData.ownerType}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          >
            <option value="Person">Person</option>
            <option value="Organisation">Organisation</option>
            <option value="Thing">Thing</option>
          </select>
          <select 
            name="iQubeContentType"
            value={metaQubeData.iQubeContentType}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          >
            <option value="mp3">mp3</option>
            <option value="mp4">mp4</option>
            <option value="pdf">pdf</option>
            <option value="txt">txt</option>
            <option value="Code">Code</option>
            <option value="Other">Other</option>
          </select>
          <select 
            name="ownerIdentifiability"
            value={metaQubeData.ownerIdentifiability}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          >
            <option value="Anonymous">Anonymous</option>
            <option value="Semi-Anonymous">Semi-Anonymous</option>
            <option value="Identifiable">Identifiable</option>
            <option value="Semi-Identifiable">Semi-Identifiable</option>
          </select>
          <input 
            type="datetime-local" 
            name="transactionDate"
            value={metaQubeData.transactionDate}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          />
          <input 
            type="number" 
            name="sensitivityScore"
            placeholder="Sensitivity Score"
            value={metaQubeData.sensitivityScore}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          />
          <input 
            type="number" 
            name="verifiabilityScore"
            placeholder="Verifiability Score"
            value={metaQubeData.verifiabilityScore}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          />
          <input 
            type="number" 
            name="accuracyScore"
            placeholder="Accuracy Score"
            value={metaQubeData.accuracyScore}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          />
          <input 
            type="number" 
            name="riskScore"
            placeholder="Risk Score"
            value={metaQubeData.riskScore}
            onChange={handleMetaQubeChange}
            className="border p-2 bg-green-50"
          />
        </div>
      </div>

      {/* BlakQube Structured Data Section */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-red-500">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
          </svg>
          BlakQube
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="format"
            placeholder="Format"
            value={blakQubeData.format}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="episode"
            placeholder="Episode"
            value={blakQubeData.episode}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="version"
            placeholder="Version"
            value={blakQubeData.version}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="rarity"
            placeholder="Rarity"
            value={blakQubeData.rarity}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="serialNumber"
            placeholder="Serial Number"
            value={blakQubeData.serialNumber}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="specificTraits"
            placeholder="Specific Traits"
            value={blakQubeData.specificTraits}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="payloadFile"
            placeholder="Payload File"
            value={blakQubeData.payloadFile}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="currentOwner"
            placeholder="Current Owner"
            value={blakQubeData.currentOwner}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
          <input 
            type="text" 
            name="updatableData"
            placeholder="Updatable Data"
            value={blakQubeData.updatableData}
            onChange={handleBlakQubeChange}
            className="border p-2 bg-red-50"
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <label className="block text-sm font-medium text-gray-700">Upload File</label>
        <input 
          type="file" 
          onChange={handleFileUpload}
          className="mt-1 block w-full bg-red-50"
        />
        {filePreview && (
          <div className="mt-2">
            <img 
              src={filePreview} 
              alt="File Preview" 
              className="max-h-48 max-w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Mint Button */}
      <button 
        onClick={handleMint} 
        disabled={isLoading || !selectedFile}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Minting...' : 'Mint NFT'}
      </button>

      {/* Error and Token ID Display */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {tokenId && <p className="text-green-500 mt-2">Minted Token ID: {tokenId}</p>}
    </div>
  );
};

export default ContentQube;
