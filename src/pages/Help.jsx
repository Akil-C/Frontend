import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FAQS = [
  { q: 'How do I place an order?', a: 'To place an order, select a restaurant, add dishes to your cart, click Proceed to Checkout, select your delivery address and payment option, and click confirm.' },
  { q: 'What is the average delivery time?', a: 'Our delivery partners average a 30-minute delivery time from ordering, depending on your distance from the restaurant and order preparation complexity.' },
  { q: 'Can I cancel my order?', a: 'Orders can only be cancelled within 60 seconds of placing them. After that, the restaurant begins preparing the food and cancellations cannot be issued.' },
  { q: 'How do I apply a coupon code?', a: 'Go to your Cart page. Under the items list, you will find the Apply Coupon input box. Type the code and press Apply to update your bill total.' },
  { q: 'Do you support contactless delivery?', a: 'Yes! All deliveries are contactless by default. Our delivery executive will place the package at your door and notify you when it arrives.' },
];

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page-enter">
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        padding: '4rem 0', color: '#fff', textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            We're Here to Help
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.0625rem' }}>
            Find answers to frequently asked questions or get in touch with support.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: 800 }}>
        {/* FAQs */}
        <section aria-labelledby="faq-title" style={{ marginBottom: '3.5rem' }}>
          <h2 id="faq-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600,
                    textAlign: 'left', color: 'var(--color-text)', cursor: 'pointer'
                  }}
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  {openFaq === i ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section aria-labelledby="contact-title" style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
          <h2 id="contact-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Still Need Assistance?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
            Our customer care team is available 24/7 to solve your problems.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }} aria-hidden="true">✉️</div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>Email Support</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>support@delivery.com</p>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }} aria-hidden="true">📞</div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>Phone Helpline</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>+1 (800) 555-FOOD</p>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }} aria-hidden="true">📍</div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>Office Address</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Bangalore, KA, India</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;
