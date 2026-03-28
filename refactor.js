const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '{/* Usage Guide Modal */}';
const endMarker = '    </div>\n  );\n}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.lastIndexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + `      {/* Modals extracted to components */}
      <WelcomeGuideModal
        show={showWelcomeGuide}
        onClose={() => setShowWelcomeGuide(false)}
        t={t}
        isDark={isDark}
      />

      <NotepadHelpModal
        show={showNotepadHelp}
        onClose={() => setShowNotepadHelp(false)}
        t={t}
      />

      <SetupHelpModal
        show={showSetupHelp}
        onClose={() => {
          setIsAutoPopup(false);
          setShowSetupHelp(false);
        }}
        t={t}
      />

      <FileSystemBrowserModal
        show={fsOpen}
        onClose={() => setFsOpen(false)}
        t={t}
        fsMode={fsMode as "file" | "directory"}
        fsPath={fsPath}
        fsLoading={fsLoading}
        fsEntries={fsEntries}
        loadDir={loadDir}
        confirmSelection={confirmFileBrowserSelection}
        getIconForFile={getIconForFile}
      />
` + content.substring(endIndex);

  fs.writeFileSync(file, newContent);
  console.log('Successfully replaced modals with components.');
} else {
  console.log('Failed to find markers.', { startIndex, endIndex });
}
