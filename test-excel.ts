import { generateTimesheet, saveTimesheet } from "./src/lib/excel";

async function run() {
  const buf = await generateTimesheet([], 2026, 2, {
    submitterName: "Test",
    submitterDate: "2026-03-01",
    submitterSignature: null,
    approverName: "Test",
    approverDate: "2026-03-01"
  });
  await saveTimesheet(buf, 2026, 2);
  console.log("Done");
}

run().catch(console.error);