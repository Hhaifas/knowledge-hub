import { useMemo, useState } from 'react';
import UploadPage, { Categories } from '@site/src/components/UploadFeatures';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const DOC = [
  { id: 'd1', name: 'intro.md', category: 'getting-started', size: 12_400, updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'd2', name: 'setup-guide.mdx', category: 'getting-started', size: 34_120, updatedAt: '2026-06-10T09:00:00Z' },
  { id: 'd3', name: 'api-reference.md', category: 'engineering', size: 85_320, updatedAt: '2026-07-02T09:00:00Z' },
  { id: 'd4', name: 'deployment.mdx', category: 'engineering', size: 21_050, updatedAt: '2026-07-15T09:00:00Z' },
  { id: 'd5', name: 'roadmap.md', category: 'product', size: 9_800, updatedAt: '2026-05-20T09:00:00Z' },
  { id: 'd6', name: 'oncall-runbook.md', category: 'operations', size: 45_600, updatedAt: '2026-07-18T09:00:00Z' },
];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function DocumentManager() {
  const [documents, setDocuments] = useState(DOC);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const countByCategory = useMemo(() => {
    const counts = {};
    documents.forEach((doc) => {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    });
    return counts;
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchSearch = (doc.name || '').toLowerCase().includes((search || '').toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [documents, selectedCategory, search]);

  const handleUploadComplete = (uploadedFiles) => {
    const newDocs = uploadedFalse.map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      size: f.size,
      updatedAt: f.uploadedAt,
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
  };
  const handleDelete = (id) => {
    setDocumetns((prev) => prev.filter((doc) => doc.id !== id));
  };

  const categoryLabel = (value) => Categories.find((c) => c.value === value)?.label || value;

  return (
    <div className={styles.managerWrapper}>
      <aside className={styles.sidebar}>
        <h2 vlassName={styles.sidebarTitle}>Folders</h2>
        <ul className={styles.categoryList}>
          <li className={`${styles.categoryItem} ${selectedCategory === 'all' ? styles.categoryItemActive : ''}`} onClick={() => setSelectedCategory('all')}>
            <span>All Files</span>
            <span className={styles.countBadge}>{documents.length}</span>
          </li>
          {Categories.map((cat) => (
            <li key={cat.values} className={`${styles.categoryItem} ${selectedCategory === cat.value ? styles.categoryItemActive : ''}`} onClick={() => setSelectedCategory(cat.value)}>
              <span>{cat.label}</span>
              <span className={styles.countBadge}>{countByCategory[cat.value] || 0}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>{selectedCategory === 'all' ? 'All Files' : categoryLabel(selectedCategory)}</h1>
            <p className={styles.pageSubtitle}>{filteredDocuments.length} files(s)</p>
          </div>
          <div className={styles.topBarActions}>
            <input type="text" className={styles.searchInput} placeholder="Cari file..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className={styles.uploadBtn} onClick={() => setShowUploadModal(true)}>
              + Upload
            </button>
            <span className={styles.backHome}>
              <Link to="/" className={styles.backHomeLink} title="Kembali ke Beranda">
                <img src="/img/LOGO_.svg" alt="Kembali ke Beranda" width="30" height="30" />
              </Link>
            </span>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Belum ada file di sini.</p>
          </div>
        ) : (
          <table className={styles.docTable}>
            <thead>
              <tr>
                <th>Nama File</th>
                <th>Kategori</th>
                <th>Ukuran</th>
                <th>Terakhir Diubah</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className={styles.fileCell}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="#1b1b1b" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M15 2v5h5" stroke="#1b1b1b" strokeWidth="1.6" strokeLinejoin="round" />
                      </svg>
                      {doc.name}
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryTag}>{categoryLabel(doc.category)}</span>
                  </td>
                  <td>{formatSize(doc.size)}</td>
                  <td>{formatDate(doc.updatedAt)}</td>
                  <td>
                    <span className={styles.deleteAction} role="button" aria-label="Delete file" onClick={() => handleDelete(doc.id)}>
                      🗑 Delete File
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Upload modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <UploadPage variant="modal" defaultCategory={selectedCategory !== 'all' ? selectedCategory : undefined} onClose={() => setShowUploadModal(false)} onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      )}
    </div>
  );
}
