import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSalary } from '../features/salary/salarySlice';

const SalaryCard = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.salary);

  useEffect(() => {
    const profileHeader = document.querySelector('.pv-text-details__left-panel');

    let jobTitle = '';
    let company = '';
    let location = '';
    let allProfileData = [];

    function waitForElement(selector, callback) {
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          callback(el);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    async function extractAllProfileSections() {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 4000));

      const elements = document.querySelectorAll('[data-view-name="profile-component-entity"]');
      if (elements.length > 0) {
        allProfileData = Array.from(elements).map((el) => el.innerText.trim());
        console.log("📄 Observed Sections Loaded:", allProfileData);

        // --- Extract meaningful job data ---
        const experienceBlock = allProfileData.find((text) =>
          /(Engineer|Developer|Manager|Designer|Analyst|Intern|Lead)/i.test(text)
        );

        if (experienceBlock) {
          const lines = experienceBlock.split("\n").map((l) => l.trim()).filter(Boolean);
          console.log("🔍 Parsed Lines:", lines);

          // Guess job title (first line that looks like a position)
          jobTitle = lines.find((l) =>
            /(Engineer|Developer|SDE|Manager|Designer|Analyst|Intern|Lead)/i.test(l)
          ) || '';

          // Guess company (often appears right before job title)
          const potentialCompanies = lines.filter(
    (l) =>
      /^[A-Z][A-Za-z\s&.-]+$/.test(l) && // Looks like a name (starts uppercase, words only)
      !/(Engineer|Developer|Manager|Designer|Analyst|Intern|Lead)/i.test(l)
  );
  company = potentialCompanies.length > 0 ? potentialCompanies[0] : "";

          // Guess location (usually contains a city or 'Remote')
          location =
            lines.find((l) =>
              /(India|Remote|Karnataka|Delhi|Mumbai|Hyderabad|Bangalore|Bengaluru|Chennai|Pune)/i.test(l)
            ) || '';
        }
      }
    }

    // Observe profile sections
    const sectionObserver = new MutationObserver(() => {
      const elements = document.querySelectorAll('[data-view-name="profile-component-entity"]');
      if (elements.length > 0) {
        allProfileData = Array.from(elements).map((el) => el.innerText.trim());
        console.log("📄 Observed Sections Loaded:", allProfileData);
        sectionObserver.disconnect();
        extractAllProfileSections(); // parse as soon as data appears
      }
    });
    sectionObserver.observe(document.body, { childList: true, subtree: true });

    if (profileHeader) {
      waitForElement('div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold', () => {
        jobTitle = document.querySelector(
          'div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]'
        )?.innerText.trim();
        console.log('💼 Job Title:', jobTitle);
      });

      const companyEl = document.querySelector('a[data-field="experience_company_logo"] span[aria-hidden="true"]');
      const locationEl = profileHeader.querySelector('.WDGUhcwelCtrWPJplAEvyFThIlpRS');

      if (companyEl) company = companyEl.innerText.trim();
      if (locationEl) location = locationEl.innerText.trim();
    }

    // Final dispatch after waiting a few seconds for scraping
    setTimeout(() => {
      const titleToUse = jobTitle || 'Unknown Role';
      const companyToUse = company || 'Unknown Company';
      const locationToUse = location || 'Unknown Location';

      console.log('🚀 Final Extracted:', { titleToUse, companyToUse, locationToUse });

      dispatch(
        fetchSalary({
          job_title: titleToUse.split(' at ')[0].trim(),
          company: companyToUse,
          location: locationToUse.split(',')[0].trim(),
        })
      );
    }, 5000);
  }, [dispatch]);

  let content;
  if (status === 'loading') {
    content = <p>Loading salary insights...</p>;
  } else if (status === 'succeeded' && data && data.low) {
    content = (
      <div>
        <h4>Estimated Salary</h4>
        <strong>
          ₹{data.low.toLocaleString('en-IN')} - ₹{data.high.toLocaleString('en-IN')}
        </strong>
        <p>per year (via AmbitionBox/Glassdoor)</p>
      </div>
    );
  } else if (status === 'failed') {
    content = <p>Error: {error}</p>;
  } else {
    content = <p>Could not find salary data for this role.</p>;
  }

  const cardStyle = {
    padding: '16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginTop: '16px',
  };

  return (
    <div style={cardStyle}>
      <h3>BKL Insights 💸</h3>
      {content}
    </div>
  );
};

export default SalaryCard;