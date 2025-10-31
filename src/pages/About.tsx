import React, { useEffect } from 'react';

interface AboutProps {
  onNavigate?: (page: string) => void;
}

const About: React.FC<AboutProps> = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white py-12 px-6 sm:py-16 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Secmondo
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Your trusted partner for travel insurance worldwide
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Mission Section */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 text-justify">
              At Secomondo, we believe that travel should be about creating memories, 
              not worrying about what might go wrong. Since 2020, we've been providing 
              comprehensive travel insurance solutions to millions of travelers worldwide.
            </p>
          </section>

          {/* Why Choose Us Section */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Award-Winning Service
                </h3>
                <p className="text-gray-600">
                  Recognized for excellence in customer service and claims processing
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Global Coverage
                </h3>
                <p className="text-gray-600">
                  Protection in over 200 countries and territories worldwide
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Fast Claims
                </h3>
                <p className="text-gray-600">
                  Average claim processing time of just 48 hours
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Competitive Rates
                </h3>
                <p className="text-gray-600">
                  Best value coverage with transparent pricing
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Team
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 text-justify">
              Our experienced team of travel insurance experts is dedicated to providing 
              you with the best possible service. With decades of combined experience in 
              the insurance industry, we understand what travelers need and deliver 
              solutions that work.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
