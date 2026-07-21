// import { useState, useRef } from 'react';
// import styles from './styles.module.css';

// export default function UploadPage() {
//   const [files, setFiles] = useState([]);
//   const [error, setError] = useState('');
//   const [isDragging, setIsDragging] = useState(false);
//   const inputRef = useRef(null);

//   const addFiles = (fileList) => {
//     const incoming = Array.from(fileList);
//     const invalid = incoming.filter((f) => !isValidFile(f));

//     if (invalid.length > 0) {
//       setError(`File tidak didukung: ${invalid.map((f) => f.name).join(', ')}. Hanya .md / .mdx yang diizinkan.`);
//     } else {
//       setError('');
//     }

//     const valid = incoming.filter(isValidFile);
//     setFiles((prev) => [...prev, ...valid]);
//   };

//   const handleInputChange = (e) => {
//     if (e.target.files?.length) {
//       addFiles(e.target.files);
//     }
//     e.target.value = '';
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files?.length) {
//       addFiles(e.dataTransfer.files);
//     }
//   };

//   const handleRemove = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       setError('Pilih minimal satu file .md atau .mdx terlebih dahulu.');
//       return;
//     }
//     console.log('Files to upload:', files);
//     // TODO: kirim ke backend, misal via FormData + fetch/axios
//   };
//   return (
//     <div className={styles.pageWrapper}>
//       <div className={styles.cardUpload}>
//         <div className={styles.headingUpload}>
//           <h1>Upload File</h1>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <label>File Markdown (.md /.mdx)</label>
//           <div
//             className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
//             onClick={() => inputRef.current?.click()}
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={handleDrop}
//           >
//             <p>Seret file ke sini, atau klik untuk memilih</p>
//             <span className={styles.dropZoneHint}>Format didukung: .md, .mdx</span>
//             <input ref={inputRef} type="file" accept=".md, .mdx" multiple className={styles.hiddenInput} onChange={handleInputChange} />
//           </div>

//           {error && <p className={styles.errorText}>{error}</p>}

//           {files.length > 0 && (
//             <ul className={styles.fileList}>
//               {files.map((file, index) => (
//                 <li key={`${file.name}-${index}`} className={styles.fileItem}>
//                   <span className={styles.fileName}>{file.name}</span>
//                   <span className={styles.removeBtn} onClick={() => handleRemove(index)}>
//                     ✕
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}

//           <button className={styles.uploadBtn} type="submit">
//             Upload
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useCallback } from 'react';
import styles from './styles.module.css';

const ACCEPTED_EXT = ['.md', '.mdx'];
const MAX_FILE_SIZE_MB = 500;

const Categories = [
  { value: 'getting-started', label: 'Getting Started' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'operations', label: 'Operations' },
];

function isValidExtension(file) {
  const name = (file.name || '').toLowerCase();
  return ACCEPTED_EXT.some((ext) => name.endsWith(ext));
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let idCounter = 0;

/**
 * Props:
 * - onClose(): dipanggil saat user klik ✕ (untuk menutup modal)
 * - defaultCategory: string, kategori yang otomatis terpilih (misal saat dibuka dari folder tertentu)
 * - onUploadComplete(uploadedFiles): dipanggil saat submit sukses, uploadedFiles = [{ id, name, size, category }]
 */
export default function UploadPage({ onClose, defaultCategory, onUploadComplete, variant = 'page' }) {
  const [category, setCategory] = useState(defaultCategory || Categories[0].value);
  const [items, setItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState('');
  const inputRef = useRef(null);

  const simulateUpload = useCallback((id) => {
    // TODO: ganti dengan upload asli (axios/XHR + onUploadProgress) ke backend kamu
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id || item.status !== 'uploading') return item;
          const nextProgress = Math.min(item.progress + Math.random() * 25, 100);
          if (nextProgress >= 100) {
            clearInterval(interval);
            return { ...item, progress: 100, status: 'completed' };
          }
          return { ...item, progress: nextProgress };
        }),
      );
    }, 400);
  }, []);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    const invalidExt = incoming.filter((f) => !isValidExtension(f));
    const tooLarge = incoming.filter((f) => isValidExtension(f) && f.size > MAX_FILE_SIZE_MB * 1024 * 1024);

    if (invalidExt.length > 0) {
      setFormError(`Format tidak didukung: ${invalidExt.map((f) => f.name).join(', ')}. Hanya .md / .mdx.`);
    } else if (tooLarge.length > 0) {
      setFormError(`Ukuran file melebihi ${MAX_FILE_SIZE_MB} MB: ${tooLarge.map((f) => f.name).join(', ')}.`);
    } else {
      setFormError('');
    }

    const valid = incoming.filter((f) => isValidExtension(f) && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

    const newItems = valid.map((file) => ({
      id: `file-${idCounter++}`,
      file,
      progress: 0,
      status: 'uploading',
    }));

    setItems((prev) => [...prev, ...newItems]);
    newItems.forEach((item) => simulateUpload(item.id));
  };

  const handleInputChange = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setFormError('Pilih minimal satu file .md atau .mdx terlebih dahulu.');
      return;
    }
    const stillUploading = items.some((item) => item.status === 'uploading');
    if (stillUploading) {
      setFormError('Tunggu sampai semua file selesai diupload.');
      return;
    }

    const uploaded = items.map((item) => ({
      id: item.id,
      name: item.file.name,
      size: item.file.size,
      category,
      uploadedAt: new Date().toISOString(),
    }));

    // TODO: panggil endpoint finalisasi di sini kalau backend butuh commit terpisah

    if (onUploadComplete) onUploadComplete(uploaded);
    if (onClose) onClose();
  };

  return (
    <div className={variant === 'modal' ? styles.modalWrapper : styles.pageWrapper}>
      <div className={styles.cardUpload}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBox} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0-12l-5 5m5-5l5 5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1>Upload Files</h1>
              <p className={styles.subtitle}>Select and upload markdown files</p>
            </div>
          </div>
          {onClose && (
            <span className={styles.closeBtn} onClick={onClose} role="button" aria-label="Close">
              ✕
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="category">Kategori / Folder</label>
          <select id="category" className={styles.categorySelect} value={category} onChange={(e) => setCategory(e.target.value)}>
            {Categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <div
            className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <button type="button" className={styles.uploadTriggerBtn} onClick={() => inputRef.current?.click()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0-12l-5 5m5-5l5 5" stroke="#1b1b1b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#1b1b1b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Upload
            </button>
            <p className={styles.dropZoneText}>Choose a file or drag &amp; drop it here</p>
            <span className={styles.dropZoneHint}>Maximum {MAX_FILE_SIZE_MB} MB file size · .md / .mdx</span>
            <input ref={inputRef} type="file" accept=".md,.mdx" multiple className={styles.hiddenInput} onChange={handleInputChange} />
          </div>

          {formError && <p className={styles.errorText}>{formError}</p>}

          {items.length > 0 && (
            <ul className={styles.fileList}>
              {items.map((item) => (
                <li key={item.id} className={styles.fileItem}>
                  <div className={styles.fileIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="#1b1b1b" strokeWidth="1.6" strokeLinejoin="round" />
                      <path d="M15 2v5h5" stroke="#1b1b1b" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className={styles.fileInfo}>
                    <div className={styles.fileTopRow}>
                      <span className={styles.fileName}>{item.file.name}</span>
                      <span className={styles.removeIcon} onClick={() => removeItem(item.id)} role="button" aria-label="Remove file">
                        {item.status === 'completed' ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" stroke="#1b1b1b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          '✕'
                        )}
                      </span>
                    </div>

                    <div className={styles.fileMetaRow}>
                      <span className={styles.fileSize}>
                        {formatSize((item.progress / 100) * item.file.size)} / {formatSize(item.file.size)}
                      </span>
                      <span className={styles.dotSeparator}>•</span>
                      {item.status === 'completed' ? <span className={styles.statusCompleted}>✓ Completed</span> : <span className={styles.statusUploading}>Uploading...</span>}
                    </div>

                    {item.status === 'uploading' && (
                      <div className={styles.progressRow}>
                        <div className={styles.progressTrack}>
                          <div className={styles.progressFill} style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className={styles.progressLabel}>{Math.round(item.progress)}%</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button className={styles.submitBtn} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export { Categories };
