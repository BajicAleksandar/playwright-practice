# E2E Test Automation

Ovaj projekat sadrži End-to-End (E2E) testove koji su organizovani u dve grupe: smoke i regression testove. E2E fajl se sastoji od grupe testova koji su sortirani i označeni odgovarajućim tagovima kako bi se omogućilo selektivno pokretanje testova u zavisnosti od potrebe.

Smoke testovi predstavljaju osnovnu proveru ključnih funkcionalnosti aplikacije i koriste se za brzu validaciju da li je aplikacija stabilna za dalje testiranje ili deployment.

Regression testovi obuhvataju širu i detaljniju proveru sistema i koriste se za kompletnu validaciju aplikacije pre release-a.

# Pokretanje testova

Za pokretanje smoke testova koristi se sledeća komanda:

npm run test:smoke

Ova komanda pokreće samo testove označene sa @smoke tagom.

Za pokretanje regression testova koristi se sledeća komanda:

npm run test:regression

Ova komanda pokreće sve testove označene sa @regression tagom.

# Generisanje izveštaja

Nakon pokretanja testova automatski se generiše HTML izveštaj. Izveštaj sadrži detaljan pregled svih testova, njihov status (Passed ili Failed), kao i screenshot-ove za svaki test koji nije prošao.

HTML report omogućava lakše praćenje rezultata testiranja i brže pronalaženje uzroka grešaka.

Izveštaj se može otvoriti komandom:

npx playwright show-report

Ili ručnim otvaranjem fajla playwright-report/index.html u browser-u.

# Screenshot podrška

Za svaki test koji ne prođe automatski se generiše screenshot. Screenshot je dostupan unutar HTML izveštaja i koristi se za lakše debugovanje i analizu problema.

# Napomena

Pre prvog pokretanja testova potrebno je instalirati sve dependencies komandom:

npm install

Takođe je potrebno instalirati Playwright browsere ukoliko već nisu instalirani:

npx playwright install
