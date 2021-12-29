// let reformatButton = document.getElementById('reformatButton');
//
// reformatButton.addEventListener('click', async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: reformatPage,
//   });
// });
//
// Class and Id Constants
// Refers to the primary div for the text of a single civil code, ex.
// https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=65589.5
var CODE_CONTENT_ID = 'codeLawSectionNoHead';
// Refers to the primary div for the text of an article (grouping of codes),
// ex.
// https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=COM&division=7.&title=&part=&chapter=2.&article=
var ARTICLE_CONTENT_ID = 'manylawsections';
function isLowerCaseLetter(text) {
    // First rule out that the text is a Number.
    if (!isNaN(text))
        return false;
    return text.toLowerCase() == text;
}
function isNumber(text) {
    return !isNaN(text);
}
function isUpperCaseLetter(text) {
    if (!isNaN(text))
        return false;
    return text.toUpperCase() == text;
}
function isUpperCaseRomanNumeral(text) {
    var matches = text.match(/[MDCLXVI]+/g);
    if (matches && matches.length == 1) {
        return true;
    }
    return false;
}
// Matches headings like (i) but also (ia)
// We want ia to be treated like I.
function isLowerCaseRomanNumeral(text) {
    var matches = text.match(/[mdclxvi]+/g);
    if (matches && matches.length == 1) {
        return true;
    }
    return false;
}
function surroundedByParentheses(text) {
    if (text.length < 3)
        return false;
    return text[0] == '(' && text[text.length - 1] == ')';
}
function reformatPage() {
    console.log('weeeee');
    var content_div = document.getElementById(ARTICLE_CONTENT_ID);
    if (!content_div) {
        console.log("Couldn't find a div called manylawsections!");
        return;
    }
    console.log(content_div);
    // Returns a static collection, will not reflect DOM updates.
    var text_children_nodes = content_div.querySelectorAll('p');
    if (!text_children_nodes) {
        console.log('This section appears to have no paragraphs.');
        return;
    }
    // The order of the civil code nesting structure is
    // (a) (1) (A) (roman i)( roman I) (ia)
    // Parsing this is complicated by the collision between the first-level
    // lowercase letter (i) and the fourth-level (roman i) and the collision
    // between their capitalized versions. To add indentation based on the first
    // three levels would be trivial, but adding correct indentation for the
    // fourth and fifth requires keeping track of state.
    //
    // One heuristic we can use is the prior level of indentation. The last
    // heading must have reached at least (A) to treat the next (i) as a roman
    // numeral.
    // Level 0 corresponds to root, level 1 corresponds to at the top-level
    // indentation (a), and so on.
    // A single text element can descend multiple levels of indentation, for
    // example:
    // (e) (1) which is level 2, followed by
    // (2) (A) (i) which is level 4
    // If we can encounter an (i) or (II) while at level >=3, we can interpret
    // it as a roman numeral as opposed to a letter.
    var level = 0;
    var last_heading = '';
    for (var _i = 0, _a = Array.from(text_children_nodes); _i < _a.length; _i++) {
        var text_node = _a[_i];
        var text = text_node.textContent;
        if (text.length == 0) {
            continue;
        }
        console.log('-');
        console.log(text);
        // Remove non-breaking spaces.
        text = text.replace(/\u00a0/g, ' ');
        var words = text.split(' ');
        console.log(words);
        var i = 0;
        // Padding is determined by the first heading level encountered.
        // However level is set according to all headings on a line.
        var found_padding_level = false;
        var padding_level = 0;
        console.log("Considering word: ".concat(words[i]));
        while (surroundedByParentheses(words[i])) {
            console.log("found a heading ".concat(words[i]));
            var word = words[i];
            // Strip the parantheses.
            word = word.replace(/[()]/g, '');
            // Only check if current level is 3 or above, due to collisions.
            if ((isLowerCaseRomanNumeral(word) && level >= 4) ||
                (level == 3 && word == 'i')) {
                console.log('found a lower case roman numeral');
                level = 4;
                if (!found_padding_level) {
                    padding_level = 4;
                    found_padding_level = true;
                    last_heading = word;
                }
            }
            else if ((isUpperCaseRomanNumeral(word) && level >= 5) ||
                (level == 4 && word == 'I')) {
                console.log('found an upper case roman numeral');
                level = 5;
                if (!found_padding_level) {
                    padding_level = 5;
                    found_padding_level = true;
                    last_heading = word;
                }
            }
            else if (isLowerCaseLetter(word)) {
                console.log('found letter');
                level = 1;
                if (!found_padding_level) {
                    padding_level = 1;
                    found_padding_level = true;
                    last_heading = word;
                }
            }
            else if (isNumber(word)) {
                console.log('found number');
                level = 2;
                if (!found_padding_level) {
                    padding_level = 2;
                    found_padding_level = true;
                }
            }
            else if (isUpperCaseLetter(word)) {
                console.log('found an uppercase letter');
                level = 3;
                if (!found_padding_level) {
                    padding_level = 3;
                    found_padding_level = true;
                    last_heading = word;
                }
            }
            ++i;
        }
        found_padding_level = false;
        // Set padding based on padding level.
        var padding = padding_level * 25;
        var text_element = text_node;
        console.log("adding padding ".concat(padding));
        // text_element.style.padding = `0 0 0 ${padding}px`;
        text_element.style.margin = "0 0 0 ".concat(padding, "px");
        text_element.style.padding = "0 0 0 5px";
        text_element.style.display = 'block';
    }
}
// Probably do a chrome state thing "is enabled"
reformatPage();
