import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What file formats do you provide?',
      answer: 'We provide designs in DST, JEF, and PES formats, compatible with most commercial embroidery machines.',
    },
    {
      question: 'How do I download my purchased designs?',
      answer: 'After purchase confirmation, you can instantly download your designs from your account dashboard. You also have unlimited redownload access.',
    },
    {
      question: 'Can I use these designs for commercial purposes?',
      answer: 'Yes, once purchased, you can use the designs for your commercial embroidery projects.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept payments through UPI, debit/credit cards, and digital wallets via our secure payment gateway.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Due to the digital nature of our products, we do not offer refunds. However, if you encounter any issues with a file, please contact us and we will assist you.',
    },
    {
      question: 'How do I place an order via WhatsApp?',
      answer: 'Add items to your cart, click "Order via WhatsApp", and you will be redirected to WhatsApp with your order details pre-filled. We will then confirm availability and share payment details.',
    },
    {
      question: 'Are the designs tested on actual machines?',
      answer: 'Yes, all our designs are professionally digitized and tested on commercial embroidery machines to ensure quality.',
    },
    {
      question: 'Can I request custom designs?',
      answer: 'Yes, we offer custom design services. Please contact us with your requirements and we will provide a quote.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Find answers to common questions about our products and services
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-red-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
