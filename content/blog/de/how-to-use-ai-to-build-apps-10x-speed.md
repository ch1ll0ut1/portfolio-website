# Mit KI Apps 10× schneller bauen

![Jemand am Laptop, umgeben von einem Chat-Assistenten, einem UI-Wireframe und Code](how-to-use-ai-to-build-apps-10x-speed.webp)

Apps zu bauen ist heute etwas anderes als früher.  
Ich weiß noch, wie schnell sich ein „Prototyp in einer Woche“ einmal anfühlte. Mit dem richtigen KI-Setup schaffe ich das heute an einem Tag – **wenn ich die Tools geschickt kombiniere**.

Das hier ist kein Hype-Artikel. Es ist mein eigener Workflow, mit allem, was gut läuft, was schlecht läuft, und den Momenten, in denen ich mich frage, warum die KI alles gerade *schlimmer* macht.

---

## 1. Mein KI-Stack

Ich habe viele KI-Tools ausprobiert. Die meisten sind entweder in einer Sache stark oder wollen alles können und scheitern daran.  
Dieses Setup funktioniert für mich.

### ChatGPT – schnelle Antworten und Brainstorming

ChatGPT ist für mich wie jemand vom Fach im Freundeskreis, dem ich nachts um eins schreiben kann: „Wie funktioniert diese Library noch mal?“

- Ich nutze es für Texte, für Code-Erklärungen und für schnelle Antworten auf kleine Probleme.
- Zum Programmieren ist es nicht mein erster Ansprechpartner. Aber wenn ich bei einer Kleinigkeit festhänge, hilft es mir schnell weiter.

**Beispiel-Prompt:**

```bash
Help me define the brand persona and archetype and create a BRAND.md
```

> *Damit habe ich früh im Projekt eine klare Tonalität für die Marke gefunden. So passt später alles zusammen, von den Marketingtexten bis zur Sprache der Oberfläche.*

---

### v0 – eine UI-Grundlage in Rekordzeit

v0 ist ideal für *den ersten Tag*. Ich beschreibe meine App, und v0 liefert mir ein funktionierendes Gerüst für die Oberfläche.  
Allerdings:

- Nach diesem ersten Tag kommt v0 mit wachsender Komplexität schlecht zurecht. Mit Libraries, die ich vorgebe, kann es wenig anfangen, und eine Codestruktur, die auch später noch trägt, bekommt es nicht hin.
- Ich bin damit schon in Reparaturschleifen geraten: Die KI versucht immer wieder, ihr eigenes Chaos aufzuräumen … und schafft es nicht.

Deshalb nehme ich heute nur noch das erste Layout mit, das es quasi gratis gibt, committe es und mache weiter.

> *Einmal habe ich eine Stunde lang versucht, v0 zu einer bestimmten Library zu überreden. Es hat sich geweigert. Ich habe aufgegeben, das Layout exportiert und den Rest in 20 Minuten in Cursor fertig gebaut.*

---

### Claude Code – Architektur und zweites Paar Hände

Claude ist für mich so etwas wie die erfahrene Stimme im Team:

- Claude hilft mir, Architekturen zu planen, technische Dokumentation zu schreiben und Coding-Richtlinien aufzustellen.
- Statt „Jetzt dieses Feature bauen“ lasse ich mir **zuerst mehrere Ansätze vorschlagen**. Dann wähle ich einen aus.
- Wenn ich noch keine Coding-Richtlinien habe, schreibt Claude sie mir gern (und fragt sogar nach meinen Vorlieben).

**Beispiel-Prompt:**

```bash
Help me plan the architecture and folder structure, ask me questions and propose solutions
```

> *Das funktioniert gut, weil Claude zuerst Kontext sammelt und dann mehrere Ansätze anbietet. Ich wähle einen aus, bevor die erste Zeile Code entsteht.*

---

### Cursor IDE – hier kommt alles zusammen

In Cursor schreibe ich den eigentlichen Code, mit einem KI-Chat direkt im Editor.

- Stilregeln, Coding-Vorlieben und sogar Notizen nach dem Muster „So nie wieder“ speichere ich direkt in den Rules und Memories von Cursor.
- Wenn Ihr Budget knapp ist, ist Cursor das einzige kostenpflichtige Tool, das ich empfehle. Sie können darin ChatGPT nutzen, ohne separates Abo.

> *Die „So nie wieder“-Regel in Cursor hat mich einmal vor einem Namenschaos bei React-Komponenten bewahrt. Jeden Cent wert.*

---

## 2. Der Workflow, mit dem es funktioniert

KI ohne festen Ablauf zu nutzen ist wie Sportwagenfahren im ersten Gang: immer noch schneller als zu Fuß, aber weit unter dem, was möglich wäre.

Diesen Zyklus wiederhole ich für jedes Feature:

1. **Planen** – Claude Ansätze vorschlagen lassen und mich für einen entscheiden.
2. **Umsetzen** – mit Cursor und Claude Code programmieren.
3. **Testen und reparieren** – Claude Code die Tests ausführen und die Bugs beheben lassen.

Das mache ich bei *jedem* Feature und jedem Änderungswunsch.  
Wenn ich die Planung überspringe, verliere ich am meisten Zeit. Nichts kostet mich mehr.

> *Früher habe ich die Planung ausgelassen und der KI gleich den Auftrag gegeben: einfach bauen. Drei Stunden später hatte ich etwas, das richtig aussah, unter der Haube aber völlig falsch war.*

---

## 3. Bugs beheben: Erwartungen runterschrauben

Beim Beheben von Bugs ist die KI eine Wundertüte:

- Manchmal grenzt es an Zauberei, und das Problem ist sofort gelöst.
- Manchmal ändert sie wahllos Dinge, die nichts bewirken.
- Manchmal muss ich *noch einmal* fragen, nur etwas anders formuliert.

Wenn das passiert, google ich die Lösung wie früher und lasse sie dann von der KI einbauen.  
So spare ich trotzdem Zeit, ohne mich im Kreis zu drehen.

> *Einmal habe ich 40 Minuten lang versucht, die KI einen Bug beheben zu lassen … und dann die Antwort in einem sieben Jahre alten Beitrag auf Stack Overflow gefunden. Die Korrektur dauerte 30 Sekunden.*

---

## 4. Die KI auf Kurs halten

Am meisten gebracht hat mir eine **Gedächtnisdatei fürs Projekt**:

- In Cursor: Rules und Memories anlegen, damit sich die KI an meinen Stil erinnert.
- In Claude: eine `CLAUDE.md` mit Coding-Richtlinien und getroffenen Entscheidungen führen.
- In Git: die Richtlinien committen, damit das ganze Team sie nutzen kann.

So bleiben mir Momente erspart wie: „Seit wann steht in einem React-Projekt plötzlich snake_case?“

> *Als die KI zum ersten Mal mitten im Projekt den Coding-Stil gewechselt hat, war mir klar: Ich muss ihr die Dinge aufschreiben. Behandeln Sie die KI wie jemanden im Praktikum, der alles wieder vergisst.*

---

## 5. Kleines Praxisbeispiel – ein Feature an einem Tag

Vor Kurzem habe ich für ein Kundenprojekt ein Dashboard-Widget in weniger als 24 Stunden gebaut:

1. **UI-Grundlage** – in 10 Minuten mit v0 generiert.
2. **Architekturplan** – Claude hat drei Ansätze vorgeschlagen, ich habe einen ausgewählt.
3. **Umsetzung** – 80 % des Codes hat Cursor geschrieben, die Sonderfälle habe ich von Hand gelöst.
4. **Bugfixes** – Einen Bug hat die KI gelöst, die Lösung für einen anderen fand ich auf Stack Overflow.  
Gesamtzeit: rund 7 Stunden. Auf dem klassischen Weg wären es 2–3 Tage gewesen.

> *Das Beste daran? Auf Kundenseite dachte man, ich hätte eine Woche daran gearbeitet.*

---

## 6. Fazit

KI wird so bald niemanden ersetzen, der gut entwickelt. Aber wer gut entwickelt, wird mit ihr *enorm* produktiv.  
Worauf es ankommt:

- Jedes Tool für das nutzen, was es am besten kann.
- In kurzen, geplanten Iterationen arbeiten.
- Die eigenen Vorlieben aufschreiben, damit die KI sie nicht vergisst.

So arbeite ich **zehnmal so schnell**, ohne auszubrennen oder in KI-Fehlern zu versinken.

Features zu bauen ist allerdings nur ein Teil der Arbeit. Wie KI im restlichen Zyklus hilft, von der Planung über Code Reviews bis zum Deployment, beschreibe ich in [10 KI-Workflows für Entwicklungsteams](/de/blog/10-ai-workflows-every-developer-should-know-2025).

---

*Wenn Sie diesen Workflow ausprobieren, erzählen Sie mir gern, wie es gelaufen ist. Ich feile selbst noch an meinem, und je mehr Erfahrungen aus der Praxis zusammenkommen, desto besser.*
