const paragraphs = Array.from(document.getElementsByTagName('p'))
                           .concat(Array.from(document.getElementsByTagName('h4')))
                           .concat(Array.from(document.getElementsByTagName('ol')))
                           .concat(Array.from(document.getElementsByTagName('ul')));

console.log(paragraphs.map(x => x.innerText));