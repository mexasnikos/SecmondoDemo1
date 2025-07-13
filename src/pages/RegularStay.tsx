import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RegularStay.css';

const RegularStay: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="regular-stay">
      <div className="container">
        <div className="page-header">
          <h1>Regular Stay Travel Insurance</h1>
          <p className="page-subtitle">Cost effective option if you want paired down cover for one trip a year</p>
          <div className="key-points">
            <ul>
              <li>Trip durations from 1 to 60 days</li>
              <li>For people aged up to 84</li>
            </ul>
          </div>
          <Link to="/quote" className="btn btn-primary btn-large">Get a Quote</Link>
        </div>

        <div className="content-sections">
          <nav className="section-nav">
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#covered">What's covered</a></li>
              <li><a href="#geographical">Geographical limits</a></li>
              <li><a href="#policy">Policy Wording</a></li>
            </ul>
          </nav>

          <section id="overview" className="content-section">
            <h2>What is Regular Stay Travel Insurance?</h2>
            <p>
              Globelink Regular Travel Insurance is available to people living anywhere in the EU and designed for 
              travellers who want paired-down cover for a reasonable price. This option provides essential medical 
              and repatriation cover, whilst also providing baggage and personal effects cover. This policy is 
              designed for all age groups up to 84 years.
            </p>
            <p>
              If you need a longer trip duration or higher levels of cover, then opt for our Comprehensive policies.
            </p>
            <p>
              Globelink Regular Stay travel insurance is available to people who are living in the EU and EEA 
              countries including Iceland, Liechtenstein and Norway.
            </p>
            <div className="price-highlight">
              <p><strong>The cheapest regular stay policy is €37.96</strong> (based on 1 adult aged up to 50 travelling in Europe for up to 5 days).</p>
            </div>
          </section>

          <section className="benefits-section">
            <h2>Regular Stay Travel Insurance Key Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h3>Emergency Medical and Repatriation cover</h3>
                <p>€5,000,000</p>
              </div>
              <div className="benefit-item">
                <h3>Adventure Activities</h3>
                <p>Over 100 Adventure Activities covered as standard</p>
              </div>
              <div className="benefit-item">
                <h3>Age Coverage</h3>
                <p>Available for people aged up to 84</p>
              </div>
              <div className="benefit-item">
                <h3>Pre-existing Conditions</h3>
                <p>50 pre-existing medical conditions covered for free</p>
              </div>
              <div className="benefit-item">
                <h3>Customizable</h3>
                <p>We help you to customise your travel insurance policy, so it suits all your needs</p>
              </div>
              <div className="benefit-item">
                <h3>Quick Purchase</h3>
                <p>Purchasing Travel Insurance online takes a few minutes</p>
              </div>
            </div>
          </section>

          <section id="covered" className="content-section">
            <h2>What's Covered</h2>
            <div className="coverage-list">
              <ul>
                <li>Emergency medical expenses up to €5,000,000</li>
                <li>Emergency repatriation and evacuation</li>
                <li>Personal baggage and effects</li>
                <li>Trip cancellation and curtailment</li>
                <li>Travel delay compensation</li>
                <li>Personal liability cover</li>
                <li>Over 100 adventure activities included</li>
                <li>24/7 emergency assistance</li>
              </ul>
            </div>

            <div className="schedule-table">
              <h3>Schedule of Cover Regular</h3>
              <p className="table-subtitle">Schedule of Cover and Limits of Indemnity per Insured Person</p>
              
              <div className="table-responsive">
                <table className="coverage-table">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Cover</th>
                      <th>Maximum Sums Insured Per Person</th>
                      <th>Excess Per Claim</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="section-code">A</td>
                      <td>Cancellation or Curtailment</td>
                      <td>Up to €2,000 in total</td>
                      <td>€100</td>
                    </tr>
                    <tr>
                      <td className="section-code">B</td>
                      <td>Emergency Medical & Other Expenses<br /><span className="sub-item">(including Dental Treatment)</span></td>
                      <td>Up to €5,000,000 in total<br /><span className="sub-item">Up to €100 in total</span></td>
                      <td>€100<br /><span className="sub-item">€40</span></td>
                    </tr>
                    <tr>
                      <td className="section-code">B1</td>
                      <td>Hospital Confinement Benefit</td>
                      <td>Up to €10 per 24 hours up to a maximum of €500 in total</td>
                      <td>Nil</td>
                    </tr>
                    <tr>
                      <td className="section-code">C</td>
                      <td>Personal Accident<br />
                        <span className="sub-item">• Death</span><br />
                        <span className="sub-item">• Loss of Limb or Eye</span><br />
                        <span className="sub-item">• Permanent Total Disablement</span>
                      </td>
                      <td>Up to €10,000 in total*<br />
                        <span className="sub-item">Up to €10,000 in total*</span><br />
                        <span className="sub-item">Up to €10,000 in total*</span><br />
                        <span className="note">*(€1,500 if under 18 or over 69)</span>
                      </td>
                      <td>Nil</td>
                    </tr>
                    <tr>
                      <td className="section-code">D1</td>
                      <td>Missed Departure</td>
                      <td>Up to €500 in total</td>
                      <td>€40</td>
                    </tr>
                    <tr>
                      <td className="section-code">E</td>
                      <td>Baggage<br />
                        <span className="sub-item">• Single Article/Pair/Set Limit</span><br />
                        <span className="sub-item">• Total Valuable Limit</span><br />
                        <span className="sub-item">• Spectacles/Sunglasses Limit</span>
                      </td>
                      <td>Up to €1,000 in total<br />
                        <span className="sub-item">Up to €150 in total</span><br />
                        <span className="sub-item">Up to €150 in total</span><br />
                        <span className="sub-item">Up to €150 in total</span>
                      </td>
                      <td>€40<br />
                        <span className="sub-item">€40</span><br />
                        <span className="sub-item">€40</span><br />
                        <span className="sub-item">€40</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="section-code">F</td>
                      <td>Personal Money<br />
                        <span className="sub-item">• Cash limit per Insured Person</span><br />
                        <span className="sub-item">• Passport & Documents</span>
                      </td>
                      <td>Up to €250 in total* (*€125 if aged under 18)<br />
                        <span className="sub-item">€125* (*€50 if under 18 yrs)</span><br />
                        <span className="sub-item">Up to €100 in total</span>
                      </td>
                      <td>€40<br />
                        <span className="sub-item">€40</span><br />
                        <span className="sub-item">€40</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="section-code">H</td>
                      <td>Personal Liability<br />
                        <span className="sub-item">(including Rental Accommodation Limit)</span>
                      </td>
                      <td>Up to €2,000,000 in total<br />
                        <span className="sub-item">Up to €100,000 in total</span>
                      </td>
                      <td>€250<br />
                        <span className="sub-item">€250</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="section-code">I</td>
                      <td>Legal Expenses & Assistance</td>
                      <td>Up to €7,000 in total</td>
                      <td>€250</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

export default RegularStay;
