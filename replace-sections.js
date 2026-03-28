const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const headerStart = '<div className="mb-8 flex items-start justify-between">';
const headerEndString = '              </svg>\n            )}\n          </button>\n        </div>\n      </div>\n';

const sigStart = '<div className="mt-6">';
const sigEndString = '              </span>\n            )}\n          </div>\n        </div>\n      </div>\n    </div>\n';

let newContent = content;

// Replace Header
const headerIndex = newContent.indexOf(headerStart);
if (headerIndex !== -1) {
  // find end
  const nextSectionStart = newContent.indexOf('<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">', headerIndex);
  if (nextSectionStart !== -1) {
    const toReplace = newContent.substring(headerIndex, nextSectionStart);
    newContent = newContent.substring(0, headerIndex) + `<Header 
          t={t}
          isDark={isDark}
          lang={lang}
          toggleLanguage={toggleLanguage}
          toggleTheme={toggleTheme}
          setShowWelcomeGuide={setShowWelcomeGuide}
        />\n\n        ` + newContent.substring(nextSectionStart);
    console.log("Header replaced.");
  } else {
    console.log("Could not find end of Header.");
  }
}

// Replace Signature Section
const sigIndex = newContent.indexOf(sigStart);
if (sigIndex !== -1) {
  const nextSectionStart = newContent.indexOf('<div className="mt-8 flex gap-4">', sigIndex);
  if (nextSectionStart !== -1) {
    const toReplace = newContent.substring(sigIndex, nextSectionStart);
    newContent = newContent.substring(0, sigIndex) + `<SignatureSection
            t={t}
            isDark={isDark}
            submitterName={submitterName}
            setSubmitterName={setSubmitterName}
            submitterDate={submitterDate}
            setSubmitterDate={setSubmitterDate}
            approverName={approverName}
            setApproverName={setApproverName}
            approverDate={approverDate}
            setApproverDate={setApproverDate}
            submitterSignature={submitterSignature}
            setSubmitterSignature={setSubmitterSignature}
            signatureRef={signatureRef}
            handleSignatureUpload={handleSignatureUpload}
            year={year}
            month={month}
            getTodayStr={getTodayStr}
            getLastDayStr={getLastDayStr}
          />\n\n          ` + newContent.substring(nextSectionStart);
    console.log("Signature section replaced.");
  } else {
    console.log("Could not find end of Signature.");
  }
}

fs.writeFileSync(file, newContent);
console.log('Done.');
