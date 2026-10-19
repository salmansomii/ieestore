const InfoPage = ({ title }) => {
  if (title === 'Return & Refund Policy') {
    return (
      <div className="container py-xxl" style={{ maxWidth: '800px' }}>
        <h1 className="text-3xl mb-xl font-bold">{title}</h1>
        <div className="text-lg" style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          <p className="mb-md">
            At <strong>Taicon Store</strong>, we strive to ensure our customers are fully satisfied with their purchases. We offer a comprehensive and straightforward A-to-Z Return and Refund Policy.
          </p>
          
          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>1. Return Window</h2>
          <p className="mb-md">
            You have <strong>30 days</strong> from the date you received your item to request a return. If 30 days have passed since your purchase was delivered, unfortunately, we cannot offer you a refund or exchange.
          </p>

          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>2. Eligibility for Returns</h2>
          <p className="mb-md">
            To be eligible for a return, your item must be unused, unworn, and in the exact same condition that you received it. It must also be in the original packaging with all tags attached. 
          </p>

          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>3. Non-Returnable Items</h2>
          <p className="mb-md">
            Several types of goods are exempt from being returned, including:
          </p>
          <ul className="mb-md" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            <li>Gift cards and downloadable software products.</li>
            <li>Intimate or sanitary goods, personal care items.</li>
            <li>Customized or personalized products.</li>
            <li>Items marked as "Final Sale".</li>
          </ul>

          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>4. The Refund Process</h2>
          <p className="mb-md">
            Once your return is received and inspected by our team, we will send you a notification confirming the approval or rejection of your refund. 
            If approved, your refund will be processed automatically to your original method of payment within <strong>5-7 business days</strong>.
          </p>

          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>5. Late or Missing Refunds</h2>
          <p className="mb-md">
            If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next, contact your bank. There is often some processing time before a refund is posted. If you’ve done all of this and you still have not received your refund, please contact us.
          </p>

          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>6. Exchanges</h2>
          <p className="mb-md">
            We only replace items if they are defective, damaged, or if the wrong item was shipped. If you need to exchange it for the same item, send us a message via WhatsApp or Email.
          </p>

          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>7. Shipping Costs</h2>
          <p className="mb-md">
            You will be responsible for paying for your own shipping costs for returning your item unless the product is defective or our team made an error. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>

          <h2 className="text-xl mb-sm font-bold text-primary mt-lg" style={{ color: 'var(--text-primary)' }}>8. How to Initiate a Return</h2>
          <p className="mb-md">
            To start a return, you can contact us directly via our live WhatsApp support at <strong>+92 327 4000155</strong>. Please provide your Order ID and the reason for the return, and our support team will guide you through the process step-by-step.
          </p>
        </div>
      </div>
    );
  }

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
