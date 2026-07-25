const fs = require('fs');
const path = require('path');

const dirToTraverse = ['app', 'components'];

const replacements = [
    // Opacity variants first so they don't get partially matched
    { regex: /bg-\[#E3755D\]\/10/g, replacement: 'bg-orange-500/10' },
    { regex: /bg-\[#E3755D\]\/20/g, replacement: 'bg-orange-500/20' },
    { regex: /text-\[#E3755D\]\/50/g, replacement: 'text-orange-500/50' },

    // Backgrounds (Gradient replacements)
    { regex: /bg-gradient-to-[a-z]+ from-\[#E3755D\] to-\[#C8634D\]/g, replacement: 'bg-gradient-to-b from-orange-500 to-orange-600' },
    { regex: /from-\[#E3755D\] to-\[#C8634D\]/g, replacement: 'from-orange-500 to-orange-600' },
    { regex: /from-\[#E3755D\] to-\[#1B3A64\]/g, replacement: 'from-orange-500 to-[#1B3A64]' },
    
    // Hover Gradients
    { regex: /hover:from-\[#C8634D\] hover:to-\[#B65640\]/g, replacement: 'hover:from-orange-600 hover:to-orange-700' },
    
    // Backgrounds
    { regex: /bg-\[#E3755D\]/g, replacement: 'bg-gradient-to-b from-orange-500 to-orange-600' },
    { regex: /bg-\[#FF5F24\]/g, replacement: 'bg-gradient-to-b from-orange-500 to-orange-600' },
    
    // Hover Backgrounds
    { regex: /hover:bg-\[#C8634D\]/g, replacement: 'hover:from-orange-600 hover:to-orange-700' },
    { regex: /hover:bg-\[#D3654D\]/g, replacement: 'hover:from-orange-600 hover:to-orange-700' },
    
    // Text
    { regex: /text-\[#E3755D\]/g, replacement: 'text-orange-500' },
    { regex: /text-\[#FF5F24\]/g, replacement: 'text-orange-500' },
    
    // Hover Text
    { regex: /hover:text-\[#C8634D\]/g, replacement: 'hover:text-orange-600' },
    { regex: /hover:text-\[#FF5F24\]/g, replacement: 'hover:text-orange-600' },
    
    // Borders
    { regex: /border-\[#E3755D\]/g, replacement: 'border-orange-500' },
    { regex: /border-\[#FF5F24\]/g, replacement: 'border-orange-500' },
    { regex: /border-\[#FF9B70\]/g, replacement: 'border-orange-400' },
    
    // Ring/Focus
    { regex: /ring-\[#E3755D\]/g, replacement: 'ring-orange-500' },
    { regex: /focus:border-\[#E3755D\]/g, replacement: 'focus:border-orange-500' },
    { regex: /focus:ring-\[#E3755D\]/g, replacement: 'focus:ring-orange-500' },
    
    // Fill
    { regex: /fill-\[#E3755D\]/g, replacement: 'fill-orange-500' },
    { regex: /fill="#E3755D"/g, replacement: 'fill="#f97316"' },
    
    // SVG stroke and stopColor
    { regex: /stroke="#E3755D"/g, replacement: 'stroke="#ea580c"' },
    { regex: /stopColor="#E3755D"/g, replacement: 'stopColor="#f97316"' },
    { regex: /stopColor="#F2A085"/g, replacement: 'stopColor="#ea580c"' },

    // Inline Hex
    { regex: /'#E3755D'/g, replacement: "'#ea580c'" },
    { regex: /'#FF5F24'/g, replacement: "'#ea580c'" },
    { regex: /"#E3755D"/g, replacement: '"#ea580c"' },
    { regex: /"#FF5F24"/g, replacement: '"#ea580c"' },
];

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            traverseDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const r of replacements) {
                if (r.regex.test(content)) {
                    content = content.replace(r.regex, r.replacement);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

dirToTraverse.forEach(dir => traverseDirectory(path.join(__dirname, dir)));
console.log('Replacement complete.');
