import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="page-enter">
      {/* Cover */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        padding: '5rem 0', color: '#fff', textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
            About DeliverY
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Connecting hungry customers with their favourite local restaurants since 2026.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '5rem', maxWidth: 800 }}>
        {/* Story */}
        <section aria-labelledby="story-title" style={{ marginBottom: '4rem' }}>
          <h2 id="story-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Our Story
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            DeliverY started with a simple idea: what if you could order from any restaurant in your city and get the food delivered within 30 minutes, piping hot and fresh?
          </p>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Over the years, we have grown from a small startup delivering in a single neighborhood to one of the leading food tech platforms in the country, connecting millions of customers with over 500 partner restaurants and employing thousands of delivery executives.
          </p>
        </section>

        {/* Mission */}
        <section aria-labelledby="mission-title" style={{ marginBottom: '4rem' }}>
          <h2 id="mission-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Our Mission
          </h2>
          <div style={{ background: 'var(--color-primary-bg)', borderLeft: '4px solid var(--color-primary)', padding: '1.5rem', borderRadius: '0 8px 8px 0', fontSize: '1.0625rem', fontStyle: 'italic', color: 'var(--color-text)' }}>
            "To make local food accessible and convenient to everyone, everywhere, while fostering growth for our partner restaurants and providing reliable earning opportunities for our delivery associates."
          </div>
        </section>

        {/* Stats */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { count: '500+', label: 'Active Restaurants' },
            { count: '30 min', label: 'Average Delivery Time' },
            { count: '10K+', label: 'Daily Shipments' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{s.count}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default About;
