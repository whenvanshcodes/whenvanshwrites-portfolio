const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
// Exercise the real mode switch, including DOM reparenting. A footer attached
// to body escapes both the shared village styles and React's hidden view.
class Node{constructor(parent=null){this.parentElement=parent;this.hidden=false;this.inert=false;this.classList={toggle(){}};}appendChild(child){child.parentElement=this;return child;}focus(){}setAttribute(){}contains(child){for(let n=child;n;n=n.parentElement)if(n===this)return true;return false;}}
const body=new Node(),wrapper=new Node(body),root=new Node(wrapper),footer=new Node(root),professional=new Node(root),slot=new Node(professional),map=new Node(root),profile=new Node(root);
const ids={'portfolio-root':root,'word-footer':footer,'pro-footer-slot':slot,'footer-mode':new Node(root),'skip-content':new Node(root)};
const source=fs.readFileSync('public/portfolio.js','utf8'),ast=ts.createSourceFile('portfolio.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),fn=ast.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name.text==='setPortfolioMode');
const sandbox={portfolioMode:'fun',driving:false,dialog:{open:false},professionalView:professional,wordFooter:footer,welcomeChoice:{open:false},view:{x:0,y:0,zoom:1},viewport:new Node(),document:{body,getElementById:id=>ids[id],querySelector:s=>s==='.profile'?profile:map},window:{scrollTo(){},dispatchEvent(event){if(event.type==='lab:navigate')wrapper.hidden=event.detail==='professional';}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}},sessionStorage:{setItem(){}},requestAnimationFrame(fn){fn()},renderWordGarden(){},resize(){},loadWordGarden(){}};
vm.createContext(sandbox);vm.runInContext(fn.getText(ast),sandbox);
sandbox.setPortfolioMode('fun');assert(root.contains(footer),'The complete footer must stay inside the themed village');assert.equal(footer.parentElement,root);
// Legacy standalone view still supports moving the footer into and out of work.
sandbox.setPortfolioMode('professional');assert(slot.contains(footer));sandbox.setPortfolioMode('fun');assert.equal(footer.parentElement,root);
sandbox.__portfolioEntryManaged=true;sandbox.setPortfolioMode('professional');assert(wrapper.hidden);assert(root.contains(footer),'Switching to React work must hide all village content, including the footer');
wrapper.hidden=false;sandbox.setPortfolioMode('fun');assert(root.contains(footer));
console.log('PASS footer stays within the themed village and hides with it across repeated view switches');
