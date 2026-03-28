const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
const imports = `import ConfigurationSection from "../components/sections/ConfigurationSection";
import StorageSection from "../components/sections/StorageSection";
`;
content = content.replace('import SignatureSection from "../components/sections/SignatureSection";', 'import SignatureSection from "../components/sections/SignatureSection";\n' + imports);

// Replace ConfigurationSection (Left Column)
const confStart = '<div className="space-y-6">';
const confEndString = '                  </button>\n                )}\n              </div>\n            </div>\n          )}\n        </div>\n      </div>\n    </div>';

const confIndex = content.indexOf(confStart);
if (confIndex !== -1) {
  // Find where Right Column starts
  const storageStart = '{/* Right Column: Storage */}';
  const storageIndex = content.indexOf(storageStart, confIndex);
  
  if (storageIndex !== -1) {
    content = content.substring(0, confIndex) + `<ConfigurationSection
              t={t}
              isDark={isDark}
              month={month}
              handleMonthChange={handleMonthChange}
              year={year}
              handleYearChange={handleYearChange}
              dataSource={dataSource}
              setDataSource={setDataSource}
              setIsAutoPopup={setIsAutoPopup}
              setShowSetupHelp={setShowSetupHelp}
              setShowNotepadHelp={setShowNotepadHelp}
              notionApiKey={notionApiKey}
              setNotionApiKey={setNotionApiKey}
              showApiKey={showApiKey}
              setShowApiKey={setShowApiKey}
              pageId={pageId}
              setPageId={setPageId}
              searchPages={searchPages}
              searching={searching}
              pages={pages}
              csvData={csvData}
              setCsvData={setCsvData}
              csvFileName={csvFileName}
              setCsvFileName={setCsvFileName}
              handleCsvUpload={handleCsvUpload}
              csvInputRef={csvInputRef}
            />\n\n            ` + content.substring(storageIndex);
    console.log("Replaced ConfigurationSection.");
  }
}

// Read content again to replace StorageSection
const storageStart = '{/* Right Column: Storage */}';
const storageIndex2 = content.indexOf(storageStart);
if (storageIndex2 !== -1) {
  // StorageSection ends where SignatureSection starts
  const sigStart = '<SignatureSection';
  const sigIndex = content.indexOf(sigStart, storageIndex2);
  
  if (sigIndex !== -1) {
    // Find the end of the StorageSection div just before SignatureSection
    const endOfStorage = content.lastIndexOf('</div>', sigIndex);
    // Actually, SignatureSection is rendered OUTSIDE the grid.
    // The grid is closed with `</div>` before `<SignatureSection`.
    // Let's replace everything from storageStart up to the `</div>\n          </div>\n\n          <SignatureSection` part.
    
    content = content.substring(0, storageIndex2) + `{/* Right Column: Storage */}
            <StorageSection
              t={t}
              isDark={isDark}
              useCustomTemplate={useCustomTemplate}
              setUseCustomTemplate={setUseCustomTemplate}
              templatePath={templatePath}
              setTemplatePath={setTemplatePath}
              outputDir={outputDir}
              setOutputDir={setOutputDir}
              outputFilenameFormat={outputFilenameFormat}
              setOutputFilenameFormat={setOutputFilenameFormat}
              openFileBrowser={openFileBrowser}
            />
          </div>\n\n          ` + content.substring(sigIndex);
    console.log("Replaced StorageSection.");
  }
}

fs.writeFileSync(file, content);
