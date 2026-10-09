# Pet dorada – 9. listopada 2026.

## Sto je promijenjeno

- 48 JPEG fotografija: najdulja stranica do 1800 px, kvaliteta 78, uz zadrzavanje izvorne datoteke kada bi nova bila veca. Prije: 68.37 MB; nakon popravka: 16.66 MB.
- Slicice do 480 px u public/gallery/thumbnails (2.18 MB) za timeline i polaroide. Originali prije kompresije su u sigurnosnoj kopiji, izvan projekta i objave.
- Uklonjeno ucitavanje svih timeline fotografija pri montiranju. Preload se pokrece za odabrani datum pri hoveru/fokusu i za sljedecu sliku pri gledanju galerije. Polaroidi ucitavaju vecu sliku pri hoveru/fokusu.
- Ispravljene klase ms:px-6, trasition, shirnk-0, sirina min(), jedinica 280ms i tocka u .memory-gallery--closing.
- Dodana uputa za pomicanje timelinea, horizontalno povlacenje fotografija prstom, status ucitavanja i greske s ponovnim pokusajem u obje galerije.
- Tipkovnicke strelice koriste isti smjer animacije kao gumbi. Escape koristi animirano zatvaranje u obje galerije. Timeri zatvaranja se ciste pri uklanjanju komponente.

## Datoteke

Izmijenjene: src/Components/main/MemoryTimeline.tsx, src/Components/main/PolaroidGallery.tsx, src/index.css i fotografije u public/gallery.
Dodane: src/Components/elements/GalleryImage.tsx, src/utils/images.ts, src/data/thumbnail-files.json, public/gallery/thumbnails i ovaj dokument.

Tvoje postojece izmjene datuma, opisa i LoveReasons nisu ponistene. Tocke 6 i 7 iz pregleda nisu dio ove dorade.
Nove fotografije koje kasnije dodas rade i bez slicica: helper koristi original dok naziv nije u thumbnail-files.json. Za novu slicicu treba izraditi smanjenu kopiju istog imena u thumbnails i dodati ime u taj popis.

## Povrat na staro

Sigurnosna kopija: /Users/jakovklobucar/Documents/Programing/React-projects/birthday-card-backup-2026-10-09-improvements
Sadrzi before.zip, manifest.json s SHA-256 provjerama i restore.py. Kopija obuhvaca stanje neposredno prije ove dorade, ukljucujuci tvoje necommitane izmjene u datotekama koje mijenjam.

Provjera bez izmjena:

```sh
python3 "/Users/jakovklobucar/Documents/Programing/React-projects/birthday-card-backup-2026-10-09-improvements/restore.py"
```

Povrat:

```sh
python3 "/Users/jakovklobucar/Documents/Programing/React-projects/birthday-card-backup-2026-10-09-improvements/restore.py" --apply
```

Ako si nakon dorade dodatno mijenjao zahvacene datoteke, skripta ce stati umjesto da prebrise novije izmjene. Ostale datoteke ne dira. Nakon povrata ponovno pokreni build ako koristis produkcijski pregled; dist je generirani izlaz.

## Popravak crnih fotografija

Prvotni sips postupak stvorio je 17 crnih fotografija i njihovih slicica. Ponovno su izradene iz sigurnosne kopije pomocu Pillow, uz ispravljanje EXIF orijentacije i pretvorbu ICC profila u sRGB. Velike slike imaju do 1800 px i JPEG kvalitetu 82, a slicice do 480 px i kvalitetu 78. Provjeren je slikovni sadrzaj, a ne samo uspjesno ucitavanje. Izvorni before.zip nije promijenjen; manifest za povrat azuriran je za popravljene datoteke.
