<<<<<<< HEAD
const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Refund Policy</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              OSA Embroidery operates on a <strong>NO-REFUND policy</strong> for all digital embroidery design purchases. Since our products are digital downloadable files, they cannot be returned or exchanged in the traditional sense.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exceptions to No-Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Refunds are only available in the following exceptional cases:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
              <li>
                <strong>Duplicate Payment:</strong> If you are charged multiple times for the same order due to a technical error, we will refund the duplicate charge(s). Please contact us within 7 days of the duplicate charge with proof of payment.
              </li>
              <li>
                <strong>Failed Payment:</strong> If your payment was processed but the order was not created or you did not receive download access, we will refund the amount. Please contact us with your transaction ID and payment details.
              </li>
              <li>
                <strong>Technical Issues:</strong> If a file is corrupted, incomplete, or cannot be opened in embroidery software, please contact us for a replacement file. If the issue cannot be resolved, a refund may be provided after investigation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Cancellations After Order Placement</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              <strong>Once an order has been placed, cancellation is not allowed.</strong> This includes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Orders awaiting payment</li>
              <li>Orders with pending payment status</li>
              <li>Orders already downloaded</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Ensure you have selected the correct design and format before proceeding to checkout. Review your order carefully before completing the payment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refund Process</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              If you qualify for a refund under the exceptions listed above:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
              <li>Contact us at osaembroideryvizag@gmail.com with your order ID and payment details</li>
              <li>Provide proof of payment (screenshot, transaction ID, etc.)</li>
              <li>Include a clear description of the issue</li>
              <li>We will review your request within 5-7 business days</li>
              <li>If approved, the refund will be processed to your original payment method within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Security</h2>
            <p className="text-gray-600 leading-relaxed">
              All payments are processed securely through Razorpay, a trusted payment gateway in India. We do not store your card or UPI details directly. Razorpay handles all payment security and fraud protection. For payment-related disputes, you may also contact your bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why No-Refund Policy?</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Digital products have unique characteristics that make refunds impractical:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Files are instantly downloadable and cannot be recovered after purchase</li>
              <li>No physical inventory or restocking involved</li>
              <li>Designs remain as your intellectual property after download</li>
              <li>No way to verify the file has not been used or shared</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Before You Purchase</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              To avoid any issues, please:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Review product images and descriptions carefully</li>
              <li>Check the file formats available (DST, JEF, etc.)</li>
              <li>Verify your embroidery machine is compatible with the format</li>
              <li>Review your order summary before clicking "Proceed to Checkout"</li>
              <li>Ensure the design matches what you're looking for</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have questions about this Refund Policy or need to report an issue with your purchase:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> osaembroideryvizag@gmail.com
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Phone:</strong> +91 8985648864
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> D No: 4-43-16, Ground Floor, Lawsons Bay Colony, Pedawaltair, Visakhapatnam – 530017
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Policy Updates</h2>
            <p className="text-gray-600 leading-relaxed">
              This Refund Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. We reserve the right to modify this policy at any time. Changes will be posted on this page with an updated effective date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
=======
const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Refund Policy</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              OSA Embroidery operates on a <strong>NO-REFUND policy</strong> for all digital embroidery design purchases. Since our products are digital downloadable files, they cannot be returned or exchanged in the traditional sense.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exceptions to No-Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Refunds are only available in the following exceptional cases:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
              <li>
                <strong>Duplicate Payment:</strong> If you are charged multiple times for the same order due to a technical error, we will refund the duplicate charge(s). Please contact us within 7 days of the duplicate charge with proof of payment.
              </li>
              <li>
                <strong>Failed Payment:</strong> If your payment was processed but the order was not created or you did not receive download access, we will refund the amount. Please contact us with your transaction ID and payment details.
              </li>
              <li>
                <strong>Technical Issues:</strong> If a file is corrupted, incomplete, or cannot be opened in embroidery software, please contact us for a replacement file. If the issue cannot be resolved, a refund may be provided after investigation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Cancellations After Order Placement</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              <strong>Once an order has been placed, cancellation is not allowed.</strong> This includes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Orders awaiting payment</li>
              <li>Orders with pending payment status</li>
              <li>Orders already downloaded</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Ensure you have selected the correct design and format before proceeding to checkout. Review your order carefully before completing the payment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refund Process</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              If you qualify for a refund under the exceptions listed above:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
              <li>Contact us at osaembroideryvizag@gmail.com with your order ID and payment details</li>
              <li>Provide proof of payment (screenshot, transaction ID, etc.)</li>
              <li>Include a clear description of the issue</li>
              <li>We will review your request within 5-7 business days</li>
              <li>If approved, the refund will be processed to your original payment method within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Security</h2>
            <p className="text-gray-600 leading-relaxed">
              All payments are processed securely through Razorpay, a trusted payment gateway in India. We do not store your card or UPI details directly. Razorpay handles all payment security and fraud protection. For payment-related disputes, you may also contact your bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why No-Refund Policy?</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Digital products have unique characteristics that make refunds impractical:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Files are instantly downloadable and cannot be recovered after purchase</li>
              <li>No physical inventory or restocking involved</li>
              <li>Designs remain as your intellectual property after download</li>
              <li>No way to verify the file has not been used or shared</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Before You Purchase</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              To avoid any issues, please:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Review product images and descriptions carefully</li>
              <li>Check the file formats available (DST, JEF, etc.)</li>
              <li>Verify your embroidery machine is compatible with the format</li>
              <li>Review your order summary before clicking "Proceed to Checkout"</li>
              <li>Ensure the design matches what you're looking for</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have questions about this Refund Policy or need to report an issue with your purchase:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> osaembroideryvizag@gmail.com
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Phone:</strong> +91 8985648864
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> D No: 4-43-16, Ground Floor, Lawsons Bay Colony, Pedawaltair, Visakhapatnam – 530017
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Policy Updates</h2>
            <p className="text-gray-600 leading-relaxed">
              This Refund Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. We reserve the right to modify this policy at any time. Changes will be posted on this page with an updated effective date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
>>>>>>> 90c42162987c4e3cea6a537cf47863f0739dc0df
