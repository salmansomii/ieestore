const InfoPage = ({ title }) => {
  return (
    <div className="container py-xxl" style={{ maxWidth: '800px' }}>
      <h1 className="text-3xl mb-xl font-bold">{title}</h1>
      
      <div className="text-lg" style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <p className="mb-md">
          This is a demo page for <strong>{title}</strong>. In a live production environment, this page would contain the complete legal text, policies, or detailed information relevant to the section.
        </p>
        <p className="mb-md">
          All terms, conditions, policies, and information presented on this demo store are for illustrative purposes only to demonstrate the premium e-commerce structure and layout.
        </p>
        {title === 'Contact Us' && (
          <div className="mt-xl bg-secondary p-lg" style={{ padding: '2rem', borderRadius: 'var(--border-radius)' }}>
            <h2 className="text-xl mb-md text-primary font-bold">Get in Touch</h2>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-md">
              <input type="text" placeholder="Your Name" className="input" />
              <input type="email" placeholder="Your Email" className="input" />
              <textarea placeholder="Your Message" className="input" rows={5} style={{ resize: 'vertical' }}></textarea>
              <button className="btn btn-primary">Send Message</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPage;
