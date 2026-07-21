import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Knowledge Hub EDM Documentation</span>
          <Heading as="h1" className={styles.heroTitle}>
            Knowledge Hub
          </Heading>
          <Heading as="h2" className={styles.heroSubtitle}>
            Data Architecture
          </Heading>
          <p className={styles.heroDescription}>Make your documents more accessible. Manage, search, and share markdown documentation your team on one site.</p>
          <div className={styles.buttons}>
            <Link className={styles.primaryBtn} to="/admin/documents">
              Start Your Md | Mdx
            </Link>
            <Link className={styles.secondaryBtn} to="/docs/perkenalan-knowledge-hub">
              See Documentation
            </Link>
          </div>
        </div>

        <div className={styles.heroImageWrapper}>
          <div className={styles.heroImageFrame}>
            <img src="/img/first-page.png" alt="Knowledge Hub illustration" className={styles.heroImage} width={1180} height={1920} />
          </div>
          <div className={styles.heroImageAccent} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
