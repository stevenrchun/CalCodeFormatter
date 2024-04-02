
# CalCodeFormatter
_A code formatter but not in that way!_

## Supersedingly Important Notice
https://leginfo.legislature.ca.gov now has native indentation. If you want to
read about how that came to be, [see here](https://blog.stevenchun.me/2022/07/When-You-Try-to-Make-A-Christmas-Present-and-End-Up-Reformatting-the-Official-California-Legal-Code/). This repo solves
a problem that no longer exists, hooray! If you have this installed as a chrome
extension, you can uninstall it and the behavior is now weird since there's
already indentation.


### Important User Notice
This software exists to make the California Civil Code easier to read. It works
in most cases. However, the indentation it provides is not and cannot be 100%
accurate. Always manually verify the structure of the relevant paragraphs/clauses/subclauses/etc.

### Usage
Open the extension by clicking on the puzzle piece icon in Chrome, then click on the
CalCodeFormatter icon. This will open the extension controls. Clicking the
on/off button will enable/disable the formatter.

Navigate to your favorite California law, for example [The Housing
Elements](https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=GOV&division=1.&title=7.&part=&chapter=3.&article=10.6.).
If the formatter is on, you should see the new formatting applied. If you wish
to turn it off, simply turn off formatting in the controls and refresh the page.

### How It Works

As it exists, the California Civil Code is difficult to read because of its
extensive use of structured headings and disdain for indentation.

The codes follow a heading structure of, from top-level to bottom-level:
`(a) (1) (A) (roman i)(roman I) (ia)`

It's possible there are lower level headings, but I have no encountered them and
there seems to be no reference manual.

For humans and computers alike, this ordering system fails to provide sufficient
information to identify the correct heading level in all cases. There's no typographic
distinction between the lower case `i` in the top-level heading and the roman numeral `i`.

Consider the case
``````
(h) (1) (A) This heading starts as a top-level but then descends two
levels of heading.
(i) This heading is indeterminate. It could be the next top-level heading, or it
could be a descendant of (h) (1) (A).
``````

Additional information could be provided by the next heading, be it `(ii)` or `(j)`,
but there's not always an additional heading.

This extension follows reasonable heuristics to attain nearly correct
indentation. Any headings below `(I)` will be left at the same indentation level,
since they are rather rare and would complicate the code quite a bit.

1. If the prior level of heading was `(i)` or lower `(I or ia)`, treat `(i)` as a roman
   numeral. If the prior level of heading was `(A)`, only treat `(i)` as a roman
   numeral, but not subsequent other numerals (ex: `ii or iv`) since
   dropping down a heading level must start with the first symbol of the new
   level, whereas going up a heading level can resume an arbitrarily long
   sequence of headings.

2. Same as 1. but shifted for heading level `(I)`: Treat as a roman numeral if the
   prior level of heading was `(I)` or lower. Only treat as a roman numeral if the
   prior level of heading was `(i)` and the new symbol is literally `(I)`, the first
   of the new level.

Quite often we'll have something like:
``````
(b) Well, Seymour, I made it... Despite your directions.
(1) (A) (i) Ahhh, Superintendent Chalmers! Welcome! I hope you're prepared for an unforgettable luncheon.
(c) c is a valid roman numeral, so we must validate that ordinality is preserved
(e.g. 100 does not come after 1, so this must not be a roman numeral).
``````
Meaning we need

3. If we encounter a roman numeral at a heading level where we'd plausibly find
   a roman numeral, only treat it as a roman numeral if its integer
   representation is 1 more than the prior roman numeral's integer
   reprsentation.

This will work correctly in many cases, but will not resolve indeterminate
cases.

### Development
In order to support Chrome (which uses manifest V3) and Firefox (which uses
manifest V2), we utilize `make` to generate complete extension directories from
the typescript source and distinct manifests.

`make chrome` will produce the chrome/ directory and zip file.
`make firefox` will do the same for firefox.
`make build` will compile the typescript code.
`make all` builds both firefox and chrome.
`make clean` to get rid of any generated code.

This all works on macOS Big Sur, but hasn't been tested on anything else.

### Bugs

If, in your perusal of the letter of the law, you notice a case of incorrect
indentation that is not already mentioned above, please either file an issue on
this repo (if you're comfortable with that) or write the author at
schunchicago@gmail.com, ideally with a reference to the legal section that is
broken, the current behavior, and the desired behavior.
