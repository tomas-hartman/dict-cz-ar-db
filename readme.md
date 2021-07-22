# README

Návrh slovníkové tabulky (relační)

| cz | ar | root_lat | root_ar | transcription | a | a | a |
|:-- | --:| --- | --- | --- | --- | --- | --- |

---

### Arabic words table

__Sloupce:__
- id (unique primary key)
- ar (arabský význam)
- cz (český význam)
- norm (normalizovaný fulltext, podle kterého se bude vyhledávat)
- cat_id (id kategorie, slovní druh)
- root_id (id kořene, kořen)
- stem (číslo kmene)
- stem_vowel (prostřední vokál ve slovese)
- plural
- masdar
- val (valence, předložka, se kterou se pojí, případně typ vazby)
- transcription
- variant (očíslované významy)
- synonyme_ids (id synonym)
- tags (@todo dospecifikovat)
- examples_ids (id přidružených příkladů)
- source_ids (id týkající se zdroje slovíčka, AR_gramatika_1 apod.) vlastní tabulka
- disabled (true | false, zablokovaná položka, která se nemá propsat do Db)
- t_synonym (temporary string with synonym from synonym field)
- t_example (temporary string with example from example field)

| id  | word | cz_id | cat_id | plural | stem_form | stem  | masdar | transcription | example_id | valency | root_id | meaning_variant |
| --- | ---: | :---: | :---:  | ---:   | ---:      | :---: | ---:   | ---           | ---        | ---     | :---:   | :---: |
| 1   | مكتبةٌ | 1 | 2 | ات ; مَكَاتِبُ | null | null | null | maktabatun | null | --- | 1 | 1 |
| 2   | كَتَبَ | 2 | 1 | null | ـُ | I | كِتَابَة ; كِتبَة ; كَتب | kataba jaktubu | null | --- | 1 | 1 |
| 3   | إعجاب | 3 | 2 | át | null | IV | null | i3džábun | null | bi | 4 | 1 |


---

### Czech words table: todo

V první řadě nebude zvlášť, pokud ji budu chtít zvlášť, možno dodělat.

| id | word | ar_id | ??? |
| --- | --- | --- | --- | 
| 1 | knihovna, knihkupectví, nakladatelství | 1 | ??? |
| 2 | psát | 2 | ??? |
| 3 | obdiv (k) | 3 | ??? |

---

### Roots table

| id  | root_norm | root_ar | root_lat | 
| --- | ---       | :---:   | ---      |
| 1   | k-t-b     | كتب     | ktb      |
| 2   | ch-S-S    | خصص     | ḫṣṣ       |
| 3   | k-b-r     | كبر     | kbr      |
| 4   | ...       | ...     |          |

---

### Examples table

| id | phrase_ar | phrase_cz  | ??? |
| --- | --- | --- | --- | 
| 1 | --- | --- | ??? |

---

### Categories

sloveso, substantivum, adjektivum, adverbium, prepozice, spojka, částice, číslovka, fráze

1. substantivum
2. adjektivum
3. zájmeno
4. číslovka
5. sloveso
6. předložka
7. spojka
8. citoslovce
9. částice
10. fráze

(masdar, participium    )

| id  | name        | title         |
| --- | ---         | ---           |
| 1   | verb        | Sloveso       |
| 2   | noun        | Podstatné jméno |
| 3   | adjective   | Adjektivum    |
| 4   | masdar      | Maṣdar        | ?
| 5   | participle  | Participium   |
| 6   | phrase      | Fráze         |
| 7   | preposition | Předložka     |
| 8   | ???         | ???           |
----

Tabulky vedlejší:

- témata
- source

----
Originální kolekce:

- ar (singulár, plurál, slovesný kmen, prostřední slabika [vzor, nepravidelný tvar], masdar)
- vazba
- cz
- root (latinka, ar) -> lze podle něj vyhledávat
- synonyma? optional
- příklad?
- transkripce?
- tagy
- source ((balíček))

## Analýza dat
Surová data (raw) je třeba nejprve zanalyzovat a opravit. Aby byla oprava co nejefektivnější, je potřeba udělat několik kroků:

1. zajistit, že jsou správně uvedené kořeny (nemají zakázané znaky nebo nejsou chybějící)
2. zajistit, aby v arabském textu pokud možno nebyla latinka
3. najít a zredukovat duplicity
4. @todo: zajistit slovní druhy
 - slovesa musí mít kmeny
 - odchytit chybějící slova bez slovních druhů a opravit

## Generování dat @todo
Konverze ze surových dat na čistá data

1. konverze na správnou tabulkovou strukturu
2. vygenerování tabulky kořenů
3. pročištění textu (odstranění dvojitých mezer nebo přebytečných taTwílů)
4. ...
n. konverze do csv a import do db

## Run

1. analyze -> generates logs that show bugs that need to be fixed in anki
2. prepare -> creates files with roots, tags, categories etc.

- after prepare!

3. transform -> transforms raw data (that should be fixed after analyzation) into csv file suitable for db



## Rethinking flow:

1. proccess raw data
2. analyze raw data and fix them                                                --> analyze
3. prepare index data = roots, tags, categories, synonyms, examples, sources    --> extract attributes (transform)
  - extract all roots, tags+, synonyms+examples, stems
  - analyze and fix them
  - convert them to db                                                          --> convert attributes
4. convert words to db                                                          --> convert vocabulary
  - convertToCsv --> find indexes in db

## Example queries

__Get all nouns:__

```sql
SELECT * 
FROM vocabulary 
WHERE id in (
  SELECT vocabulary_id 
  FROM has_category 
  WHERE category_id in 
    (
      SELECT id 
      FROM categories 
      WHERE category = 'cat_substantiva'
    )
)
```

__Return all rows with all categories, tags, sources, root info and stems:__
It does not return source since source is only a parsed value in db.

@todo implement usage for is_disabled = 0: vocabulary, roots, stems
```sql
SELECT
  v.id, v.ar, v.cs, v.plural, v.masdar, v.valency, v.ar_variant, v.norm, v.ar_transcription, v.stem_vowel,
  c.tags,
  t.categories,
  r.root_lat, r.root_ar,
  st.stem
FROM
  vocabulary AS v

LEFT JOIN
(
  SELECT has_tag.*, group_concat(tags.tag) as `tags`
  FROM has_tag
  JOIN tags 
  ON tags.id = has_tag.category_id
  WHERE has_tag.is_disabled = 0 AND tags.is_disabled = 0
  GROUP BY vocabulary_id
) as c
ON c.vocabulary_id = v.id

LEFT JOIN
(
  SELECT has_category.*, group_concat(categories.category) as `categories`
  FROM has_category
  JOIN categories 
  ON categories.id = has_category.category_id
  WHERE has_category.is_disabled = 0 AND categories.is_disabled = 0
  GROUP BY vocabulary_id
) as t
ON t.vocabulary_id = v.id

LEFT JOIN 
roots as r 
ON r.id = v.root_id

LEFT JOIN 
stems as st
ON st.id = v.stem_id

-- WHERE v.id=256 OR v.id=1024
GROUP BY v.id
```

## Folder structure

- `db`: this folder hosts the most recent version of database
- `experimental`: used to host various experiments build on db data
- `preprocess`: folder that hosts raw data and scripts used to convert raw data to db
- `src`: source of scripts that can be used universally
- `client`: TODO
- `server`: TODO
- `dist`: TODO
