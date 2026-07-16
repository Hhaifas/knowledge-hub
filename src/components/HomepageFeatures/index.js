import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const CategoryList = [
  {
    title: 'Database',
    image: '/img/just-little.svg',
    description: <>Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly.</>,
    link: '/docs/category/database',
  },
  {
    title: 'Cost Management',
    image: '/img/just-little.svg',
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
    link: '/docs/category/cost',
  },
  {
    title: 'Azure Resources',
    image: '/img/just-little.svg',
    description: <>Extend or customize your website layout by reusing React. Docusaurus can be extended while reusing the same header and footer.</>,
    link: '/docs/category/storage',
  },
  {
    title: 'Security',
    image: '/img/just-little.svg',
    description: <>Extend or customize your website layout by reusing React. Docusaurus can be extended while reusing the same header and footer.</>,
    link: '/docs/category/security',
  },
];

function Feature({ image, title, description, link }) {
  return (
    <div className="category">
      <div className="nb-card">
        <img src={image} className="nb-card-img" alt={title} />
        <div className="nb-card-content">
          <Heading as="h4" className="nb-card-title">
            {title}
          </Heading>
          <p className="nb-card-text">{description}</p>
          <div className="nb-card-actions">
            <Link className="nb-buttons" to={link}>
              See Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className="padding-vert--lg homepage-features">
      <div className="container">
        <div className="row" style={{ justifyContent: 'center' }}>
          {CategoryList.map((props, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <Feature {...props} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
