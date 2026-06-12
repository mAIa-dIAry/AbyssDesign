# Standard Abyss Design

## Spis tresci

- [Status i zakres](#status-i-zakres)
- [Zasady nadrzedne](#zasady-nadrzedne)
- [Skala spacingow](#skala-spacingow)
- [Hierarchia border radius](#hierarchia-border-radius)
- [Powierzchnie i warstwy](#powierzchnie-i-warstwy)
- [Matryca przyciskow](#matryca-przyciskow)
- [Recipes kompozycji](#recipes-kompozycji)
- [Do / Don't](#do--dont)
- [Referencyjne implementacje](#referencyjne-implementacje)
- [Powiazane pliki](#powiazane-pliki)

---

## Status i zakres

Ten dokument jest kanonicznym standardem stosowania Abyss Design w projekcie Maia. Opisuje nie tylko stan obecnych komponentow, ale takze twarde reguly dla nowych ekranow, nowych sekcji i dalszej rozbudowy design systemu.

Najwazniejsze zasady interpretacji:

- dla nowych ekranow ten dokument ma wyzszy priorytet niz lokalne nawyki z pojedynczych widokow,
- Storybook dokumentuje API komponentow i pokazuje przyklady, ale nie jest glownym miejscem decyzji systemowych,
- jezeli aktualny kod odbiega od tego dokumentu, traktuj to jako swiadomy dlug techniczny albo wyjatek do uzasadnienia, a nie jako nowa norme,
- dokument obejmuje spacing, border radius, role powierzchni, hierarchie tytulow i wybor wariantu przycisku,
- dokument nie zastępuje szczegolowego API komponentow ani nie wprowadza nowych tokenow bez zmiany implementacji systemowej.

---

## Zasady nadrzedne

1. Abyss jest warstwa pierwszego wyboru. Jezeli istnieje komponent z [src/components/ui](../../src/components/ui), uzywaj jego zamiast bezposrednio skladać Quasara.
2. Statyczne elementy interfejsu buduj przez polprzezroczyste powierzchnie, cienie i ramki, a nie przez pelne, nieprzezroczyste bloki koloru.
3. `backdrop-filter: blur()` jest zarezerwowany dla warstw tymczasowych nad trescia, takich jak dialogi, modale, menu i tooltipy. Nie stosuj blur na przyciskach, kartach, nawigacji i polach formularza.
4. Nie wprowadzaj lokalnych skal spacingu ani nowych promieni naroznikow tylko dla jednego widoku. Jezeli wartosc nie miesci sie w obecnym systemie, to jest sygnal do zmiany systemowej, a nie do lokalnego obejscia.
5. Kazdy kontener powinien miec jedna czytelna hierarchie akcji. Uzytkownik ma od razu widziec, ktora akcja jest glowna, ktora wspierajaca, a ktora tylko stanem.
6. Operacje destrukcyjne wyrazaj przede wszystkim przez kontekst powierzchni i copy, a nie przez tworzenie osobnego czerwonego wariantu przycisku. W Abyss sygnal ryzyka pochodzi z karty, informacji i ikonografii.
7. Nazwy wariantow przycisku sa semantyczne i musza pozostac spójne z API: `flat`, `current`, `toggled`, `special`, `fullWidth`, `size="small"`.

---

## Skala spacingow

Podstawowa skala spacingu Abyss opiera sie na pieciu stopniach. Nie dodawaj nowych podstawowych wartosci bez aktualizacji systemu.

| Wartosc | Rola                         | Uzywaj w                                                                                                   | Nie uzywaj do                                                     |
| ------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `4px`   | Mikro-odstep                 | drobne oddechy w gestych ukladach, rytm nawigacji, korekta ciasnych grup ikon                              | glownego rytmu formularza, paddingu kart, odstepu miedzy sekcjami |
| `8px`   | Odstep wewnatrz komponentu   | gapy w naglowkach, miedzy ikona i etykieta, wiersze pomocnicze, drobne grupy akcji                         | glownego stacku pol formularza i pionowych list sekcyjnych        |
| `12px`  | Standardowy stack interakcji | pionowy rytm formularzy, tresc dialogow, grupy akcji w jednej sekcji, odstep miedzy elementami decyzyjnymi | zewnetrznego paddingu kart i rozdzielania duzych sekcji           |
| `16px`  | Padding kontenera            | domyslny padding kart, dialogow i glownych blokow tresci                                                   | mikro-odstepow lub dekoracyjnego pompowania ciasnych komponentow  |
| `24px`  | Separacja sekcji             | odstep miedzy kartami, grupami tresci i wiekszymi blokami strony                                           | odstepow pomiedzy pojedynczymi polami w jednej formie             |

Reguly praktyczne:

- `16px` jest wartoscia zewnetrzna, `12px` wartoscia wewnetrznego stacku. Najczesciej oznacza to: karta ma `padding: 16px`, a pola i akcje wewnatrz niej ukladaja sie co `12px`.
- `8px` sluzy do lokalnych relacji w jednym komponencie, a nie do budowania glownej pionowej kompozycji calego bloku.
- `24px` oddziela rodzenstwo na poziomie sekcji. Jezeli dwa elementy należa do tej samej decyzji lub tej samej porcji formularza, to zwykle nie powinny byc rozsuniete o `24px`.
- Gdy uzywasz `AbyssButtonGroup`, nie buduj dodatkowego rytmu recznie. Komponent sam zarzadza ciasnym laczeniem przyciskow.
- Jezeli layout wymaga wiekszego oddechu niz `24px`, skladaj go z sekcji rozdzielonych systemowo, zamiast dokladac nowy token `20px`, `28px` lub `32px` lokalnie.

---

## Hierarchia border radius

System promieni naroznikow jest celowo waski. Dzieki temu powierzchnie z roznych czesci aplikacji pozostaja w jednej rodzinie wizualnej.

| Wartosc | Rola                | Stosuj dla                                                                                          | Nie stosuj dla                                                           |
| ------- | ------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `6px`   | Radius kompaktowy   | malych przyciskow, gestych toolbariow, drobnych kontrolek                                           | kart, dialogow i glownych CTA                                            |
| `8px`   | Radius domyslny     | przyciskow, kart, dialogow, formularzy i wiekszosci powierzchni systemu                             | tylko wtedy, gdy komponent ma wyraznie kompaktowa role                   |
| `12px`  | Radius ekspozycyjny | wyjatkowych, bardziej ekspozycyjnych powierzchni, elementow marketingowych albo kart ilustracyjnych | standardowych komponentow aplikacyjnych bez potrzeby dodatkowego akcentu |
| `50%`   | Ksztalt kolisty     | intencjonalnie kolowych affordancji i ikonograficznych akcentow                                     | zwyklych kart, przyciskow tekstowych i formularzy                        |

Reguly praktyczne:

- `8px` to domyslny promien Abyss. Jezeli nie masz bardzo konkretnego powodu, zaczynaj od niego.
- `6px` jest redukcja gestosci, a nie osobnym stylem wizualnym. Uzywaj go tylko tam, gdzie element rzeczywiscie ma byc mniejszy i bardziej narzedziowy.
- Nie dodawaj lokalnie wartosci takich jak `10px`, `14px` czy `18px`. To zwykle daje efekt elementu z innego systemu.
- W grupach przyciskow nie nadpisuj recznie pojedynczych naroznikow. Za ksztalt odpowiada `AbyssButtonGroup`.

---

## Powierzchnie i warstwy

### Podstawowe powierzchnie

| Element            | Rola                            | Uzywaj gdy                                                                         | Nie uzywaj gdy                                                                |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `AbyssCard`        | podstawowy kontener sekcji      | grupujesz powiazane pola, informacje lub akcje w jednej powierzchni                | potrzebujesz tylko pojedynczej etykiety lub malego hintu bez struktury sekcji |
| `AbyssDialog`      | warstwa tymczasowa nad trescia  | prosisz o decyzje, potwierdzenie albo skupione wprowadzenie danych                 | treść ma byc stale widoczna jako czesc ekranu                                 |
| `AbyssTitle`       | naglowek i separator hierarchii | chcesz nazwac sekcje, blok lub podrzedna grupe treści                              | potrzebujesz alertu, hintu lub tekstu pomocniczego                            |
| `AbyssInfo`        | nazwany komunikat kontekstowy   | chcesz pokazac neutralny, ostrzegawczy lub ryzykowny callout z wyraznym znaczeniem | tresc nie ma tytulu ani nie niesie osobnej semantyki komunikatu               |
| `AbyssButtonGroup` | ciasno zwiazany zestaw akcji    | budujesz toolbar, segment, steper lub zestaw rownorzednych przelaczalnych akcji    | akcje sa rozne semantycznie albo odlegle w hierarchii                         |

### Hierarchia tytulow

| Rozmiar | Rola                         | Typowe miejsce                                                |
| ------- | ---------------------------- | ------------------------------------------------------------- |
| `lg`    | tytul strony lub hero-sekcji | poczatek widoku, duzy blok otwierajacy                        |
| `md`    | standardowy tytul sekcji     | naglowek karty, naglowek dialogu, glowny blok wewnatrz strony |
| `sm`    | podsekcja lub mikro-naglowek | mniejsza grupa w karcie, lista, panel pomocniczy              |

Reguly praktyczne:

- `AbyssCard` jest podstawowa jednostka budowania sekcji. Ma domyslny `padding` kontentu `16px`, naglowek z rytmem `8px` i promien `8px`.
- `AbyssDialog` ma prawo do blur i mocniejszej separacji od tla, bo jest powierzchnia tymczasowa. Karta i przycisk takiego prawa nie maja.
- `AbyssInfo` stosuj tylko wtedy, gdy komunikat ma wyrazny tytul lub status. Sam krotki opis nie uzasadnia calloutu.
- `AbyssTitle` rozdziela semantyke naglowka od semantyki akcji. Nie zastępuj przycisku ani calloutu ozdobnym tytulem.

---

## Matryca przyciskow

### Warianty semantyczne

| Wariant   | Uzywaj gdy                                                          | Typowe miejsca                                                                                 | Nie uzywaj gdy                                                                               |
| --------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| domyslny  | to jest glowna akcja w danym bloku                                  | formularze, karty ustawien, dialogi, decyzje binarne                                           | akcja jest wyraznie poboczna, opcjonalna albo tylko zmienia lokalny stan                     |
| `flat`    | akcja ma nizszy priorytet niz glowna decyzja                        | akcje pomocnicze, wtórne rozwidlenie flow, opcjonalne potwierdzenie, niski priorytet w dialogu | akcja ma konkurowac z glownym CTA albo ma byc jedynym sygnalem na ekranie                    |
| `current` | element reprezentuje aktualnie aktywny kontekst lub wybrany cel     | aktywna nawigacja, aktualnie wybrany rekord lub route                                          | stan mozna wylaczyc tym samym kliknieciem, albo jest to tymczasowy toggle                    |
| `toggled` | element jest wlaczonym przełącznikiem, ale dalej pozostaje klikalny | toolbar formatowania, aktywne filtry, segmenty wyboru                                          | nawigacja, aktywny route, decyzje jednokrotne                                                |
| `special` | potrzebny jest pojedynczy, rzadki akcent premium lub motywiczny     | wyroznione CTA, akcja otwierajaca glowny kreator, miejsce swiadomie akcentowane kolorem        | wiecej niz jeden akcent w jednej sekcji, zwykle akcje formularzowe, wszystkie CTA na ekranie |

Reguly praktyczne:

- W jednym bloku tresci preferuj jedna glowna akcje. Jezeli widzisz trzy przyciski o tym samym wizualnym ciezarze, to znaczy, ze hierarchia jest nieczytelna.
- `current` i `toggled` nie sa zamienne. `current` oznacza aktualnie wybrany kontekst, `toggled` oznacza aktywny stan, ktory mozna od razu cofnac.
- `special` jest akcentem, nie codziennym wariantem. Jedna sekcja, jeden akcent, jeden powod.
- Operacja destrukcyjna nie potrzebuje osobnego czerwonego przycisku. Najpierw buduj kontekst ryzyka przez `AbyssCard`, `AbyssInfo`, ikonografie i copy.

### Modyfikatory ukladu i gestosci

| Modyfikator    | Uzywaj gdy                                                 | Typowe miejsca                                                  | Nie uzywaj gdy                                                       |
| -------------- | ---------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `fullWidth`    | przycisk jest samodzielna akcja blokowa w pionowym stacku  | ustawienia, dialogi, formularze, sekcje decyzji na mobile       | akcje tworza toolbar, rownorzędny pasek lub ciasna grupe sterowania  |
| `size="small"` | akcja ma charakter pomocniczy, narzedziowy albo ciasny     | toolbar, steper, nawigacja pomocnicza, kontrolki w naglowku     | glowny submit, glowne CTA sekcji, najwazniejsza decyzja w dialogu    |
| `icon-only`    | znaczenie jest oczywiste z kontekstu i nie trzeba etykiety | toolbar z dobrze znanymi ikonami, strzalki, przycisk zamkniecia | glowna akcja formularza albo akcja o zlozonych konsekwencjach        |
| `loading`      | akcja trwa i trzeba zablokowac ponowne klikniecie          | submit, import, eksport, zapis, dluzsze mutacje                 | krótki toggle lokalny, ktory nie ma osobnego cyklu oczekiwania       |
| `percentage`   | postep ma wartosc informacyjna dla uzytkownika             | dluższe operacje z realnym procentem wykonania                  | przypadki, gdzie procent jest sztuczny albo nic nie wnosi do decyzji |

Reguly praktyczne:

- Dla samotnej akcji w pionowym stacku preferuj `fullWidth`. To jest domyslny uklad w ustawieniach, dialogach i sekcjach decyzyjnych.
- `size="small"` redukuje gestosc, ale nie zmienia semantyki. Maly przycisk nadal nie powinien stawac sie glownym CTA ekranu.
- `icon-only` wymaga szczegolnej dyscypliny: ikona musi byc rozpoznawalna, a rola przycisku czytelna z otoczenia.
- Nie lacz semantycznie sprzecznych stanów. API pozwala na wizualne priorytety, ale standard zabrania projektowania przycisku jednoczesnie jako `current`, `toggled` i `flat`.

---

## Recipes kompozycji

### 1. Karta ustawien lub formularza

- Uzyj `AbyssCard` jako glownej powierzchni.
- Trzymaj zewnetrzny padding sekcji w rytmie `16px`.
- Pola, przełączniki i blokowe akcje ukladaj pionowo co `12px`.
- Glowna akcja zapisania lub przejscia dalej powinna byc jedna i najczesciej `fullWidth`.
- Jezeli karta ma komunikat kontekstowy, umiesc go blisko pola albo akcji, ktorej dotyczy, zamiast w osobnym odleglym calloucie.

### 2. Blok destrukcyjny

- Ryzyko buduj przez kontekst: karta o wyraznym charakterze, `AbyssInfo` z tytulem ostrzegawczym, ikona ryzyka.
- Sam przycisk destrukcyjny pozostaje w domyslnym wariancie, ale jest jednoznacznie opisany i osadzony w ostrzegajacej powierzchni.
- Nie tworz lokalnych czerwonych gradientow, nowych kolorow obramowan ani nowych glow dla przycisku tylko po to, by zaznaczyc ryzyko.

### 3. Dialog potwierdzenia lub skupionej akcji

- Uzyj `AbyssDialog`, bo jest to jedyna warstwa, ktora ma prawo do blur jako stalego srodka wyrazu.
- Tresc dialogu trzymaj w rytmie `12px`, a cialo w paddingu `16px`.
- Glowna akcja w dialogu moze byc domyslna i `fullWidth`, a akcja nizszego priorytetu powinna byc `flat` albo osobnym przyciskiem zamkniecia.
- Ikona zamkniecia nie zastępuje jawnej akcji anulowania tam, gdzie decyzja jest istotna lub nieodwracalna.

### 4. Toolbar albo segment przelaczany

- Do zestawow akcji narzedziowych uzywaj `AbyssButtonGroup`.
- Preferuj `size="small"` i, gdy potrzeba, `icon-only`.
- Aktywny stan narzedzia pokazuj przez `toggled`, a nie przez `current`.
- Nie grupuj w jednym `AbyssButtonGroup` akcji, ktore nie sa semantycznie rodzenstwem.

### 5. Sekcje rownorzedne na stronie

- Oddzielaj rodzenstwo sekcyjne `24px`, a nie dowolna lokalna wartoscia.
- Wewnatrz kazdej sekcji wracaj do rytmu `16px` na zewnatrz i `12px` wewnatrz.
- Jezeli jedna sekcja wymaga znacznie wiekszego oddechu niz inne, problemem zwykle jest kompozycja ekranu, a nie brak nowego tokenu spacingu.

---

## Do / Don't

### Do

- Uzywaj `8px` jako domyslnego border radius dla glownych powierzchni i przyciskow.
- Uzywaj `16px` dla paddingu kart i `12px` dla pionowego rytmu form i dialogow.
- Traktuj `flat` jako akcje wtórna, a nie jako losowy styl alternatywny.
- Traktuj `current` jako oznaczenie aktualnego kontekstu, a `toggled` jako aktywnego, nadal klikalnego stanu.
- Buduj ryzyko przez kontekst sekcji, nie przez wymyslanie nowego wariantu przycisku.
- Uzywaj `AbyssInfo` tylko dla nazwanych komunikatow.

### Don't

- Nie dokladaj blur do kart, przyciskow, stalej nawigacji i pol formularza.
- Nie wprowadzaj lokalnych wartosci `10px`, `14px`, `20px` i podobnych, jezeli system nie przewiduje takiego stopnia.
- Nie lacz kilku akcentow `special` w jednej sekcji lub jednym widoku.
- Nie uzywaj `current` do formatowania tekstu ani aktywnych filtrow wielokrotnego wyboru.
- Nie uzywaj `icon-only` dla akcji o niejasnej albo nieodwracalnej konsekwencji.
- Nie buduj recznie pseudo-grup przyciskow przez marginesy i lokalne radiusy, gdy istnieje `AbyssButtonGroup`.

---

## Referencyjne implementacje

- `AbyssButton` — [`src/components/ui/AbyssButton/AbyssButton.vue`](../../src/components/ui/AbyssButton/AbyssButton.vue)
  Definicja wariantow `flat`, `current`, `toggled`, `special`, rozmiarow i modyfikatorow.
- `AbyssButton` stories — [`src/components/ui/AbyssButton/AbyssButton.stories.ts`](../../src/components/ui/AbyssButton/AbyssButton.stories.ts)
  Opisy semantyki wariantow i ich intencji projektowej.
- `AbyssCard` — [`src/components/ui/AbyssCard/AbyssCard.vue`](../../src/components/ui/AbyssCard/AbyssCard.vue)
  Domyslny padding `16px`, promien `8px` i struktura sekcyjna karty.
- `AbyssDialog` — [`src/components/ui/AbyssDialog/AbyssDialog.vue`](../../src/components/ui/AbyssDialog/AbyssDialog.vue)
  Zasady warstw tymczasowych, blur, rytmu tresci i akcji modalnych.
- `AbyssTitle` — [`src/components/ui/AbyssTitle/AbyssTitle.vue`](../../src/components/ui/AbyssTitle/AbyssTitle.vue)
  Hierarchia `lg`, `md`, `sm`.

Przyklady uzycia w ekranach aplikacji Maia (konsument pakietu) znajduja sie w repozytorium `maia-app`.

---

## Powiazane pliki

- [`src/stories/AbyssDesign.mdx`](../../src/stories/AbyssDesign.mdx) — landing page w Storybooku, skrot i punkt wejscia.
- [`src/scss/helpers/variables.scss`](../../src/scss/helpers/variables.scss) — cienie, transition, breakpoints i globalne tokeny pomocnicze.
- [`docs/architecture/abyss-design.md`](./abyss-design.md) — ten dokument (kanoniczny standard systemowy).
