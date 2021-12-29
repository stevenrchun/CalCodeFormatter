# CalCodeFormatter
A code formatter but not in that way.
---
As it exists, the California Civil Code is difficult to read because of its
extensive use of structured headings and disdain for indentation.

The codes follow a heading structure of, from top-level to bottom-level:
`(a) (1) (A) (roman i)(roman I) (ia)`

It's possible there are lower level headings, but I have no encountered them and
there seems to be no reference.

For both humans and computers, this ordering system does not provide sufficient
information to identify the correct heading level. There's no typographic
distinction between the lower case `i` in the top-level heading and the roman
numeral `i`.

Consider the case
``````
(h) (1) (A) This common heading starts as a top-level but then descends two
levels of heading.
(i) This heading is indeterminate. It could be the next top-level heading, or it
could be a descendant of (h) (1) (A).
``````

Additional information could be provided by the next heading, be it (ii) or (j),
but there's not always an additional heading.

This extension follows reasonable heuristics to attain nearly correct
indentation.

1. If the prior level of heading was (i) or lower (I or ia), treat (i) as a roman
   numeral. If the prior level of heading was (A), only treat (i) as a roman
   numeral, but not any other headings at the same level (ex: ii or iv) since
   dropping down a heading level must start with the first symbol of the new
   level, whereas going up a heading level can resume an arbitrarily long
   sequence of headings.

2. Same as 1. but shifted for heading level (I): Treat as a roman numeral if the
   prior level of heading was (I) or lower. Only treat as a roman numeral if the
   prior level of heading was (i) and the new symbol is literally (I), the first
   of the new level.

This will work correctly for

But will not resolve indeterminate cases like
