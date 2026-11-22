# ts. physikwerkstatt.

Eine browserbasierte Werkstatt von Tobias Schmidbauer für den Physikunterricht am bayerischen Gymnasium, Jahrgangsstufen 7–10. Lehrkräfte finden einen Versuch für das vorhandene Material und bereiten die Stunde vor. Schülerinnen und Schüler bringen eigene Messreihen mit und prüfen gemeinsam, welches Modell die Beobachtungen erklärt.

**[Physikwerkstatt öffnen](https://tjrschmidbauer.github.io/Physikwerkstatt/)** · [Versuchskatalog](https://tjrschmidbauer.github.io/Physikwerkstatt/#katalog-titel) · [Auswertungsraum](https://tjrschmidbauer.github.io/Physikwerkstatt/#studio)

## Der erste Versuch in fünf Minuten

*Drei Gruppen untersuchen dieselbe Feder. Bei gleicher Dehnung misst eine Gruppe durchweg eine größere Kraft. Bedeutet das, dass sie eine härtere Feder hatte?*

1. Öffne **Auswerten** und wähle **Beispiel mit drei Gruppen öffnen**. Die Beispieldaten sind synthetisch. Auf der horizontalen Achse steht die Dehnung in cm, auf der vertikalen die Kraft in N.
2. Wähle **Gerade**. Blende die Gruppen einzeln ein und vergleiche ihre Steigungen. Die Steigung gibt in dieser Darstellung die Federkonstante in N/cm an. Ein anderer Achsenabschnitt allein reicht als Beleg für eine härtere Feder nicht aus.
3. Blende alle Gruppen ein. Im Diagramm der **Residuen** entspricht jeder Punkt der gemessenen Kraft minus der vom gemeinsamen Modell berechneten Kraft. Liegen die Punkte einer Gruppe überwiegend oberhalb der Nulllinie, unterschätzt das Modell deren Messungen systematisch.
4. Wähle **Projizieren** und lass die Klasse eine Kontrollmessung vorschlagen. Ein möglicher erster Schritt am realen Aufbau ist, den Kraftmesser zu entlasten und seinen Nullpunkt zu prüfen. Die Verschiebung im Diagramm allein verrät ihre Ursache nicht.

## Eine eigene Stunde vorbereiten

| Bereich | Was du dort tun kannst |
| --- | --- |
| **Katalog** | 120 illustrierte Versuche nach Jahrgangsstufe und Material durchsuchen und anhand der Aufbauskizze die Vorbereitung planen. |
| **Planen** und **Unterrichten** | Eine Stunde zusammenstellen oder mit einem der acht vorbereiteten Unterrichtspakete einsteigen. |
| **Forschen** | Einen von vier Forschungsaufträgen starten. Die Gruppen entscheiden mit begrenztem Messbudget, welche Messung ihre Vermutung am besten prüft. |
| **Auswerten** | Eigene Gruppenmessungen zusammenführen, Modelle vergleichen und die Ergebnisse projizieren oder drucken. |

### Messwerte aus der Klasse übernehmen

Öffne unter **Auswerten → Sitzung verwalten** eine neue Sitzung. Beschrifte die Achsen einschließlich der Einheiten. Lege mit **+ Gruppe** die Messteams an und wähle vor jeder Eingabe das passende Team. Einzelwerte übernimmst du mit **Messpunkt eintragen**. Für eine ganze Reihe öffnest du **Messwerte einfügen oder importieren**.

Du kannst Zellen direkt aus Excel kopieren oder eine Textdatei mit Tabulatoren oder Semikolons einlesen. Die ersten beiden Spalten sind x und y. Optional folgen die Standardunsicherheit von y und eine Prüfmarkierung (0 oder 1). Dieses synthetische Beispiel lässt sich direkt einfügen.

```text
1,0;0,24;0,02;0
2,0;0,49;0,02;0
3,0;0,71;0,02;0
4,0;0,97;0,02;1
```

Wähle **An aktive Gruppe anhängen** und anschließend **Gerade**. Die ersten drei Zeilen bestimmen die Gerade. Die vierte prüft, wie gut sie die Kraft bei 4 cm Dehnung vorhersagt. Im Diagramm erscheinen die Fitpunkte als Kreise und der Prüfpunkt als Raute.

## Wie die Auswertung funktioniert

Die Werkstatt berechnet die Modellparameter im Browser mit der Methode der kleinsten Quadrate. Zur Auswahl stehen Gerade, Ursprungsgerade, Parabel, Quadratgesetz mit konstantem Offset und Kehrwertmodell mit konstantem Offset. Das Kehrwertmodell setzt x ≠ 0 voraus. Welche Beziehung physikalisch sinnvoll ist, hängt vom Aufbau und vom untersuchten Messbereich ab.

- **Messunsicherheiten:** Bei aktivierter Gewichtung zählt jede quadrierte Abweichung mit dem Faktor 1/σy². Ein Punkt mit halb so großer Standardunsicherheit hat damit das vierfache Gewicht. Berücksichtigt wird die Unsicherheit der y-Größe. Die x-Werte gelten bei dieser Rechnung als fest.
- **Vorhersage prüfen:** Als Prüfpunkte markierte Messungen bleiben bei der Anpassung außen vor. Die Wurzel aus der mittleren quadratischen Abweichung (RMSE) beschreibt die typische Größe der Abweichung in der Einheit von y. Die Anzeige trennt die Werte für Anpassung und Prüfung.
- **Gruppen vergleichen:** Bei der gruppenweisen Prüfung wird eine ganze Gruppe ausgelassen. Ihre Werte werden mit dem Modell aus den übrigen Gruppen vorhergesagt. So lässt sich untersuchen, ob sich das Ergebnis auf einen anderen Aufbau oder ein anderes Messteam überträgt.

## Technik, Speicherung und Offlinebetrieb

Die veröffentlichte Anwendung steckt in einer einzigen [index.html](./index.html). Sie enthält den Katalog, die Zeichenanweisungen, das Layout und den JavaScript-Code. Der Browser zeichnet Aufbauten und Diagramme auf Canvas und berechnet die Regression per QR-Zerlegung. GitHub Pages liefert die statische Datei aus dem Branch `gh-pages` aus. Für den Offlinebetrieb kannst du die Datei herunterladen und in einem Browser mit aktiviertem JavaScript öffnen.

Die Auswertung läuft auf dem jeweiligen Gerät. Die Sitzung wird im lokalen Browserspeicher abgelegt. Sichere sie vor einem Gerätewechsel oder vor dem Löschen der Browserdaten über **Sitzung verwalten → Sitzung sichern** als JSON-Datei. Auf dem Zielgerät kannst du sie mit **Sitzung öffnen** fortsetzen. Für die Zusammenarbeit an mehreren Geräten führt die Lehrkraft die Reihen per Dateiimport oder durch Einfügen in die jeweilige Gruppe zusammen.

## Entstehung und KI

Idee, Anforderungen und die Ausrichtung auf den Unterricht stammen von Tobias Schmidbauer. OpenAI Codex hat bei der Ausarbeitung der Versuchstexte, der Illustrationen und des Programmcodes mitgewirkt. Im Unterricht berechnet der veröffentlichte JavaScript-Code die Diagramme und Modellparameter direkt aus den eingegebenen Messwerten. Dafür wird kein KI-Dienst aufgerufen.

Die fünf Regressionsmodelle wurden mit bekannten mathematischen Zusammenhängen getestet. Für den Einsatz eines konkreten Versuchs prüft die Lehrkraft Aufbau, Messbereich, Modellannahmen und Sicherheit anhand der vorhandenen Geräte. Wenn dir ein fachlicher Fehler auffällt, helfen Versuchstitel, Eingabewerte und erwartetes Ergebnis beim Nachvollziehen. [Fehler melden](https://github.com/TJRSchmidbauer/Physikwerkstatt/issues)

## Live-Messung im Klassenzimmer

Im gleichen, vertrauenswürdigen Schulnetz können Gruppen vom eigenen Gerät aus Werte an den Beamer senden. Der Lehrkraftrechner übernimmt den Server. GitHub Pages liefert die öffentliche Werkstatt weiterhin statisch aus.

1. Lade das Repository als ZIP herunter und entpacke es. Öffne im Projektordner ein Terminal und starte mit Node.js 22 oder neuer `node live/server.mjs`. Es sind keine npm-Pakete erforderlich.
2. Öffne auf dem Lehrkraftrechner **http://127.0.0.1:8080** und wähle **Raum öffnen**. Zeige die Schulnetz-Adresse und den Raumcode am Beamer. Bei mehreren Adressen wähle die des mit der Klasse gemeinsam genutzten Netzes.
3. Die Gruppen öffnen diese Adresse, tragen Raumcode, Gruppennummer sowie x und y ein und wählen **Senden**. Vereinbare vorher die Einheiten. Neue Messpunkte erscheinen ungefähr alle zwei Sekunden oben in der Beamer-Tabelle. Die Geräte müssen sich im Schulnetz erreichen können (TCP-Port 8080).
4. Für eine Regression wähle vor dem Beenden **Messreihe für die Auswertung sichern**, dann **Auswertungsraum öffnen → Sitzung verwalten → Sitzung öffnen**. Ergänze im Auswertungsraum die Achsenbezeichnungen und Einheiten.
5. **Raum schließen** verwirft die Daten im Arbeitsspeicher. Beim Schließen oder Neuladen des Lehrkraft-Tabs sendet der Browser ein Endsignal. Bleibt es aus, sperrt der Server den Raum spätestens 30 Sekunden nach dem letzten Lebenszeichen. Das gilt auch beim Zuklappen des Rechners nach dem Wiederaufwachen. Eine ausdrücklich heruntergeladene Datei bleibt erhalten.

Der Live-Server ist für das lokale Schulnetz vorgesehen. Die LAN-Verbindung nutzt HTTP. Verwende Gruppennummern und öffne den Port ausschließlich für das benötigte Schulnetz. Lernende mit Raumcode können Messpunkte einreichen. Die Raumverwaltung ist an die Loopback-Adresse des Lehrkraftrechners und einen separaten, zufälligen Sitzungsschlüssel gebunden.
