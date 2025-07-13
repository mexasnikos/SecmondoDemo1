import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AnnualMultiTrip.css';

const AnnualMultiTrip: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="annual-multitrip">
      <div className="container">
        <div className="page-header">
          <h1>Annual Travel Insurance</h1>
          <p className="page-subtitle">Perfect for travel more than once a year</p>
          <div className="key-points">
            <ul>
              <li>Individual trips up to 120 days at a time</li>
              <li>No 'maximum days abroad' restrictions</li>
              <li>Available for people aged up to 79</li>
              <li>Cruise Cover FREE</li>
              <li>Get 17 days Winter Sports Cover FREE with 45 days plus options</li>
            </ul>
          </div>
          <Link to="/quote" className="btn btn-primary btn-large">Get a Quote</Link>
        </div>

        <div className="content-sections">
          <nav className="section-nav">
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#geographical">Geographical limits</a></li>
              <li><a href="#policy">Policy Wording</a></li>
            </ul>
          </nav>

          <section id="overview" className="content-section">
            <h2>What is an Annual Travel Insurance Policy?</h2>
            <p>
              An Annual policy is designed for Individuals (from €99.34), Couples or Families (from €165.76 per Family) 
              who take more than one trip within a 12 months period. Take as many trips as you wish and be covered all year long. 
              We recommend that you select an immediate start date as this will ensure that you are covered for the cancellation 
              of any pre-booked holiday.
            </p>

            <h3>Can I get Annual Holiday Insurance Now?</h3>
            <p>
              You can with Globelink! It's essential to make an informed choice about where you travel based on your Government 
              advice and that of your destination. Its also essential to stay protected with annual travel insurance if you have 
              any booked trips. Buying year-long will cover you for certain Cancellation risks even before you travel - like injury 
              or illness (including catching Covid within 14 days of travel, or while you're away), accidents, death, jury service, 
              redundancy. We recommend that you select an immediate start date if you have pre-booked trips to protect.
            </p>
            
            <div className="highlight-box">
              <h3>Top Tip</h3>
              <p>
                The current travel situation means there's a higher risk of your trip dates changing - with annual policy you 
                don't have to amend your travel insurance if your dates change - as long as you're still travelling within the 
                policy cover period and your geographical area hasnt changed; and your trip length is within your chosen policy 
                maximum duration.
              </p>
            </div>

            <h3>Can I buy now with a future Start Date?</h3>
            <p>
              Unlike most other Travel Insurance providers, you can buy a Globelink Annual Multi Trip Travel insurance policy 
              up 4 MONTHS in advance! Most other major companies only allow you to buy up to one or two months ahead at most.
            </p>
            <p>
              What's the benefit? You lock in todays price and avoid future price increases or changes in terms and conditions.
            </p>
            
            <div className="highlight-box">
              <h3>Top Tip</h3>
              <p>
                Buy now and set your Start date up to 4 months in advance when you are likely to be travelling more (as long as 
                you don't have any booked trips to protect as you wont get the benefit of Cancellation Cover until your policy starts).
              </p>
            </div>

            <div className="price-highlight">
              <h3>SPECIAL OFFER</h3>
              <p>
                <strong>* Kids go free on Annual Family Policies.</strong> Up to 4 kids aged 17 or under, plus infants under 2yrs old – 
                all for free when travelling with two insured adults!
              </p>
              <p>
                <strong>* Couples get an automatic discount</strong> when you buy an annual travel policy.
              </p>
            </div>

            <h3>Can I get Coronavirus Cover?</h3>
            <p>
              ALL Globelink Annual Insurance Plans include Emergency Medical, Repatriation and Cancellation & Curtailment cover 
              if you contract Coronavirus within 14 days of travel or while you are away - provided your Government legally permits 
              you to travel and does not advise against travel due to Coronavirus.
            </p>
            <p>
              Should you travel to a country that your Government advises against travel due to Covid-19 - you can still buy 
              insurance and your cover remains valid for all insured events that are NOT Covid related. So if you need to cancel 
              or curtail your trip, or have a medical emergency that is not related to Coronavirus - you have the peace of mind 
              that cover is in place to protect you. You cant claim for costs associated with Coronavirus where your Government 
              advises against travel to your destination (unless you have an exception, or legally permitted reason to travel).
            </p>
            
            <div className="highlight-box">
              <h3>Top Tip</h3>
              <p>
                Always check your Government advice and those of the location you plan to visit before booking and travelling. 
                There will probably be additional Covid related steps to complete before you are permitted to travel.
              </p>
            </div>

            <p>
              Please note, Claims related to a Positive Covid-19 test result can only be considered when certified by an independent 
              authority. Examples of this are: a private Covid testing provider's official certificate, or the medical report of a 
              Doctor's administered Covid-19 test result. The written confirmation must include the name of the person for whom the 
              test relates to, the date of the test and the test result. The insurer will not accept photographs of a Lateral Flow 
              test taken at home unless it has been independently verified.
            </p>

            <h3>Globelink Covid Cover Includes:</h3>
            <ul className="pricing-factors">
              <li>Cancellation Cover (positive test within 14 days of travel)</li>
              <li>Curtailment Cover (positive test on your trip)</li>
              <li>Additional accommodation and travel costs where authorised by the 24 hr Assistance Service</li>
              <li>Emergency Medical Costs and Medical Repatriation (always contact the 24 hr Multi-lingual Assistance Service)</li>
              <li>Compulsory Quarantine Cover (resulting from your personal medical condition on Dr's advice - not area restrictions)</li>
            </ul>

            <h3>What Cover do you get with Annual Insurance?</h3>
            <p>
              Globelink annual multi-trip policies provide our Comprehensive level of protection. Unlike many of our competitors - 
              we don't advertise a basic price and then expect you to pay extra for certain benefits like COVID Protection; Cruise Cover; 
              or Multi-Destination surcharges. We provide individual trip durations betwen 17 - 120 days and we don't set a 'maximum days 
              abroad' like our competitors. Travel as many times as you like in 12 months, as long as each trip is within your chosen trip destination.
            </p>

            <h3>Globelink year-long policy covers:</h3>
            <ul className="pricing-factors">
              <li>€10 Million Medical and Repatriation Expenses</li>
              <li>up to 120 day trip durations</li>
              <li>Free Cruise Cover</li>
              <li>Kids go free</li>
              <li>Cancellation and Cutting your trip short</li>
              <li>€2 Million in Personal Liability Cover</li>
              <li>17 days Winter Sports Cover Free with 45-day + trip durations (Excludes cover for Winter Sports in the United States of America.)</li>
              <li>End Supplier Failure Cover</li>
              <li>€25,000 Personal Accident Cover (conditions apply)</li>
            </ul>

            <h3>Can I change my Travel Insurance Policy after I purchase?</h3>
            <p>You can with Globelink:</p>
            <ul className="pricing-factors">
              <li>If you change your mind about your purchase, you can cancel your policy and receive a full refund within 14 days of your purchase date.</li>
              <li>If you decide to travel to a different Geographical Area from the one you purchased; or fancy a couple of longer trips than your maximum trip duration - just contact us as soon as you know and we will provide a quote so you can upgrade your policy immediately.</li>
              <li>If you need to add a child to your policy, or have an address change; country change or name change - get in touch and we will arrange an amended Certificate for you straight away.</li>
            </ul>

            <h3>Government Advice</h3>
            <p>
              Travel advice can change with little notice, so it's important to keep aware of current information. For EU residents 
              you will need to check your local Government advice. For UK residents it's the FCDO advice - check here for full details. 
              The FCDO have announced a new traffic light system for categorising international travel risks and the rules for exiting 
              and entering the country. Other EU countries have similar systems and rules. Before you travel, check your Government 
              advice and that of the location you are travelling to and follow the rules.
            </p>

            <div className="price-highlight">
              <p>
                <strong>The cheapest annual holiday insurance policy is €99.34</strong> (based on 1 adult aged up to 50 travelling in Europe for up to 17 days per trip).
              </p>
            </div>

            <h3>Annual Trip Insurance Top Benefits</h3>
            <ul className="pricing-factors">
              <li>Trip durations up to 120 days at a time (under 65s)</li>
              <li>Couples Discounts and kids 17yrs or younger go free (up to 4 kids, plus infants under 2yrs per Policy)</li>
              <li>No hidden costs - CRUISE Cover included</li>
              <li>24-hour 365 Multi-Lingual Assistance Service</li>
              <li>Available to people living in the EU or EEA Countries</li>
              <li>End Supplier Insolvency Insurance cover as standard</li>
              <li>Chose and add any Extras</li>
              <li>No maximum trip days abroad</li>
            </ul>

            <div className="highlight-box">
              <h3>⚠️ Attention!</h3>
              <p>
                The European Health Insurance Card (EHIC) / Global Health Insurance Card (GHIC) provides some emergency healthcare 
                within the EU, but it does not cover Repatriation costs, or a doctor or nurse escort home; nor lost or stolen property. 
                You need Travel Insurance for that.
              </p>
            </div>

            <div className="price-highlight">
              <h3>Important Recommendation</h3>
              <p>
                We recommend that you select an immediate start date as this will ensure that you are covered for certain 
                Cancellation risks for any pre-booked trips. You can select a future start date as long as you know that if 
                you have to cancel your trip before your policy Start Date, you wont be covered.
              </p>
            </div>
          </section>

          <section id="geographical" className="content-section">
            <h2>Geographical Limits</h2>
            <p>
              This policy is available for residents of EU and EEA countries including Iceland, 
              Liechtenstein and Norway. Coverage applies worldwide for your travel destinations.
            </p>

            <div className="geographical-definitions">
              <h3>Geographical Limits - Area Definitions</h3>
              
              <div className="area-definition">
                <h4>Europe</h4>
                <p>
                  Albania, Andorra, Armenia, Austria, Azerbaijan, Belgium, Belarus, Bosnia-Herzegovina, 
                  Bulgaria, Channel Islands, Croatia, Cyprus, Czech Republic, Denmark, Egypt, Estonia, 
                  Finland, France (including Corsica), Georgia, Germany, Gibraltar, Greece (including 
                  Greek Islands), Hungary, Iceland, Ireland, Italy (including Aeolian Islands, Sardinia 
                  & Sicily), Latvia, Liechtenstein, Lithuania, Luxembourg, Macedonia, Malta, Moldova, 
                  Monaco, Montenegro, Morocco, Netherlands, Norway, Poland, Portugal (including Azores 
                  & Madeira), Romania, Russia (West of the Ural Mountains), San Marino, Serbia (including 
                  Kosovo), Slovakia, Slovenia, Spain (including Balearic and Canary Islands), Sweden, 
                  Switzerland, Tunisia, Turkey, Ukraine, United Kingdom and Vatican City.
                </p>
              </div>

              <div className="area-definition">
                <h4>Worldwide (Excluding)</h4>
                <p>
                  Worldwide, excluding Australia, United States of America, Canada and all islands in 
                  the Caribbean Sea and the Bahamas, Costa Rica, Japan, New Zealand, Mexico and Thailand. 
                  (Also includes cover for Europe).
                </p>
              </div>

              <div className="area-definition">
                <h4>Worldwide (All countries)</h4>
                <p>
                  Worldwide including Australia, United States of America, Canada and all islands in 
                  the Caribbean Sea and the Bahamas, Costa Rica, Japan, New Zealand, Mexico and Thailand. 
                  (Also includes cover for Europe).
                </p>
              </div>
            </div>
          </section>

          <section id="policy" className="content-section">
            <h2>Policy Wording</h2>
            <div className="policy-wording-content">
              <h3>Travel Insurance</h3>
              <p>
                Please read your Policy Wording carefully to ensure that it meets with your precise 
                requirements. View and download the relevant Policy Wording* from the links below. 
                If you purchased a Globelink policy previously while you were a UK RESIDENT, or you 
                need to view the Policy Wording we issue to UK Residents, please 
                <button className="uk-link" onClick={() => window.open('https://www.globelink.co.uk', '_blank')}> click here to visit our Globelink UK site</button>.
              </p>
              <p className="policy-note">
                *If you purchased your Travel Insurance policy prior to 1st October 2022, you can 
                view your policy wording by reviewing your Globelink Travel Insurance Purchase email, 
                or obtain a copy by contacting 
                <a href="mailto:globelink@globelink.eu" className="email-link"> globelink@globelink.eu</a> 
                with your name and address details.
              </p>

              <div className="policy-downloads">
                <div className="download-item">
                  <div className="download-info">
                    <h4>📄 Policy Wording for Policies issued to EU residents (living outside the UK) from 12th March 2025 onwards.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_V2_07.03.2025.pdf"
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>

                <div className="download-item">
                  <div className="download-info">
                    <h4>📄 Policy Wording for Policies issued to EU residents (living outside the UK) from 29th November to 11th March 2025.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_Nov2024_Mar2025.pdf"
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>

                <div className="download-item">
                  <div className="download-info">
                    <h4>📄 Policy Wording for Policies issued to EU Residents (living outside the UK) from 1st November 2023 to 28th November.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_Nov2023_Nov2024.pdf"
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>

                <div className="download-item">
                  <div className="download-info">
                    <h4>📄 Policy Wording for Policies issued to EU Residents (living outside the UK) from 20th March 2023 to 31st October 2023.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_Mar2023_Oct2023.pdf"
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>

                <div className="download-item">
                  <div className="download-info">
                    <h4>📄 Policy Wording for Policies issued to EU residents (living outside the UK) from 1st October 2022 to 19th March 2023.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_Oct2022_Mar2023.pdf"
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnnualMultiTrip;
