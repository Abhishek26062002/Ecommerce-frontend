const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">About OSA Embroidery</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Power | Precision | Performance - At OSA Embroidery, we are dedicated to providing premium digital embroidery designs that empower creators and businesses to bring their visions to life with exceptional quality and detail.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We specialize in high-quality digitized embroidery designs across various categories including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Blouse Designs (Boat Necks, V Necks, U Necks, Deep Necks, High Necks)</li>
              <li>Saree Borders</li>
              <li>Kurthi Designs</li>
              <li>Kids Designs</li>
              <li>Logos and Branding</li>
              <li>Photo Embroidery</li>
              <li>Beads, Sequence, and Coding Designs</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Professional Quality</h3>
                <p className="text-sm text-gray-600">All designs are professionally digitized and tested on commercial machines.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Multiple Formats</h3>
                <p className="text-sm text-gray-600">Compatible formats (DST, JEF, PES) for various embroidery machines.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Instant Download</h3>
                <p className="text-sm text-gray-600">Get your designs immediately after purchase confirmation.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Unlimited Redownloads</h3>
                <p className="text-sm text-gray-600">Access your purchased designs anytime from your account.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Address:</strong> D No: 4-43-16, Ground Floor, Lawsons Bay Colony, Beside Venkateswara Swamy Temple, Pedawaltair, Visakhapatnam – 530017</p>
              <p><strong>Phone:</strong> +91 8985648864</p>
              <p><strong>Email:</strong> osaembroideryvizag@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
