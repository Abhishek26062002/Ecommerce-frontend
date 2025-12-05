const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Terms & Conditions</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using OSA Embroidery website, you accept and agree to be bound by the terms and conditions outlined in this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Digital Products</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              All designs are digital downloadable products. Once purchased:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>You receive instant access to download the files</li>
              <li>Files are provided in specified formats (DST, JEF, PES)</li>
              <li>You are granted unlimited redownloads from your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Usage Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              Upon purchase, you are granted the right to use the designs for personal and commercial embroidery projects. You may not resell, redistribute, or share the digital files themselves.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. No Refunds Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              Due to the nature of digital products, all sales are final. We do not offer refunds. However, if you experience technical issues with a file, please contact us for support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Payment</h2>
            <p className="text-gray-600 leading-relaxed">
              All prices are in Indian Rupees (INR) and include applicable taxes. Payment must be completed before files are accessible for download.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All designs remain the intellectual property of OSA Embroidery. Purchase grants usage rights but not ownership of the designs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these terms, please contact us at osaembroideryvizag@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
