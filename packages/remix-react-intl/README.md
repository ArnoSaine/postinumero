# @postinumero/vite-plugin-remix-react-intl

FormatJS (react-intl) & Remix integration

## Setup

```js
import reactIntl from "@postinumero/vite-plugin-remix-react-intl";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths(), reactIntl],
});
```

```
virtual:@postinumero/remix-react-intl/routeId


  try-catch:iin useLoaderData, virtual-modulesta default-lang, EB:ssä messaget routen perusteella
  eb ei voi käyttää loaderia
  layout voi käyttää loaderia vain jos ei eb
    scriptitagilla oletustekstit bundleen? kieli?
      ei, pitää olla html:ssä, ja ei haluta flash of another language content (FOALC)
  extract
    routen formaatin konvertointi, root --> / jne.

      --> oletuksena levylle, konffilla palvelimelle
  compile
      json-tiedostoiksi loadereille
      koonti
        custom optio, jolla riippuvuuksien lang-kansioista haetaan tekstit commoniin/libiin
      ssr
        true
          viedään lähdekoodien kansioon
        false
          viedään public:iin
contextista parent-messaget pohjaksi
selaimen kielen tunnistus headerista tai clientilla jostain
pseudo-localet optioista
clientLoaderissa cache
tarjotaan route josta tekstit voi ladata ja muokata
kielen vaihto, vastaavan routen tunnistus
markdown
sivustovariantit
vaihtoehtoisen kielen sisällön näyttäminen osassa sivua
locales ja fallbackLocale manifest-tiedostosta, jotta toimii ilman buildia
```
