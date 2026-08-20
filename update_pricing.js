const fs = require('fs');
const file = 'c:/wamp64/www/gosiratfull/gosriatdashboard/app/dashboard/pricing/new/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove bottom buttons block
const regexBottom = /<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 mt-auto">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
// Wait, the bottom block is:
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 mt-auto">
//                     <Button type="button" variant="outline" className="gap-2 bg-white" onClick={() => window.history.back()}>
//                         <X className="h-4 w-4" /> Cancel
//                     </Button>
//                     <Button type="button" className="gap-2 bg-brand hover:bg-brand-dark text-white" onClick={handleSubmit}>
//                         <Save className="h-4 w-4" /> Create Pricing Rule
//                     </Button>
//                 </div>
//             </div>
//         </div>
content = content.replace(/<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 mt-auto">[\s\S]*?<\/div>/, '');

// Replace top header block
const regexTop = /<div className="flex items-center gap-4 mb-6">[\s\S]*?<\/div>\s*<\/div>/;
const replacementTop = `<div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <BackButton fallbackUrl="/dashboard/pricing" />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Pricing Rule</h1>
                        <p className="text-sm text-gray-500">Define the foundational cost structure and base pricing.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" className="gap-2 bg-white" onClick={() => window.history.back()}>
                        <X className="h-4 w-4" /> Cancel
                    </Button>
                    <Button type="button" className="gap-2 bg-brand hover:bg-brand-dark text-white" onClick={handleSubmit}>
                        <Save className="h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>`;
content = content.replace(regexTop, replacementTop);

fs.writeFileSync(file, content);
console.log("Dashboard pricing page updated successfully!");
