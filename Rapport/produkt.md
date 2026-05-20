Produktrapport – Pokemon-Statle
Produktbeskrivelse
Pokemon-Statle er et webbaseret spil inspireret af spil som Statle og andre quiz- og strategispil. Formålet med spillet er at teste spillerens viden om Pokémon og deres stats.
Spilleren får vist én Pokémon ad gangen uden at kunne se dens stats. Spilleren skal vælge én stat pr. Pokémon, og værdien bliver lagt til den samlede score. Målet er at opnå mindst 600 point, før alle stats er brugt.
Projektet er udviklet som en fullstack webapplikation med:
•	Frontend i React/Next.js 
•	Backend i C# 
•	PostgreSQL database via Neon 

Formål med produktet
Formålet med produktet er at skabe:
•	Et underholdende og strategisk spil 
•	En lærerig oplevelse for Pokémon-fans 
•	En webapplikation med login, statistik og progression 
Spillet skal være nemt at forstå, men samtidig kræve strategi og erfaring for at opnå høje scores.

Målgruppe
Målgruppen for produktet er primært:
•	Pokémon-fans 
•	Spillere der kan lide quiz- og strategispil 
•	Brugere der ønsker korte og hurtige spiloplevelser 
Produktet er designet til både casual spillere og mere erfarne Pokémon-spillere.

Systemets opbygning
Frontend
Frontend er udviklet i React og Next.js.
Frontendens opgaver er:
•	Vise brugerinterface 
•	Håndtere brugerinteraktion 
•	Vise Pokémon og spilinformation 
•	Håndtere mørk og lys tilstand 
•	Vise leaderboard og Pokédex 
Brugeren interagerer kun med frontend, mens data hentes fra backend via API.

Backend
Backend er udviklet i C#.
Backendens opgaver er:
•	Håndtere spillogik 
•	Generere tilfældige Pokémon 
•	Beregne score 
•	Validere spillerens valg 
•	Håndtere login og brugerdata 
•	Kommunikation med databasen 
Backend fungerer som forbindelsen mellem frontend og databasen.

Database
Projektet bruger PostgreSQL via Neon.
Databasen gemmer:
•	Brugere 
•	Games 
•	Scores 
•	Pokémon spilleren har mødt 
•	Pokémon spilleren har vundet med 
Databasen gør det muligt at:
•	Gemme progression 
•	Vise leaderboard 
•	Gemme Pokédex-data 

Spilfunktioner
Login system
Brugeren kan:
•	Oprette konto 
•	Logge ind 
•	Gemme progression 

Gameplay
Spillet fungerer ved:
1.	Spilleren starter et game 
2.	En tilfældig Pokémon vises 
3.	Spilleren vælger en stat 
4.	Point tilføjes til scoren 
5.	Den valgte stat låses 
6.	Processen gentages 
7.	Spillet afsluttes efter alle stats er brugt 
Spilleren vinder ved at opnå over 600 point.

Pokédex system
Pokédex-systemet giver spilleren progression.
Farvesystem:
•	Sort = ikke set 
•	Grå = set i spil 
•	Farve = vundet med Pokémon 
Brugeren kan:
•	Se alle Pokémon 
•	Filtrere generationer 
•	Se hvor mange Pokémon der er samlet 

Leaderboard
Leaderboardet viser:
•	Spillernes score 
•	Pokémon-hold brugt i spillet 
Dette gør det muligt at sammenligne resultater med andre spillere.

UI funktioner
Produktet indeholder:
•	Lys og mørk tilstand 
•	Responsive sider 
•	Ikoner og branding 
•	Brugervenligt design 






Teknologier brugt i projektet
Teknologi	Formål
React	Frontend
Next.js	Web framework
C#	Backend
ASP.NET API	API udvikling
PostgreSQL	Database
Neon	Hosting af database
Swagger	API test
LocalStorage	Midlertidig lagring


Sikkerhed og datahåndtering
Login og brugerdata
Brugere logger ind med:
•	Brugernavn 
•	Password 
Brugerdata gemmes sikkert i databasen.

Datahåndtering
Pokémon-data gemmes i lokale JSON-filer, fordi:
•	Data ændrer sig ikke 
•	Det gør systemet hurtigere 
•	Reducerer databasebelastning 
Dynamiske data som scores og brugere gemmes i databasen.

Produktets styrker
Strategisk gameplay
Spillet kræver viden og strategi fremfor held.
Progression
Pokédex-systemet giver motivation til at fortsætte.
Social funktion
Leaderboard gør spillet mere konkurrencedygtigt.
Brugervenlighed
UI er simpelt og nemt at forstå.

Mulige forbedringer
Produktet kan videreudvikles med:
•	Daily challenges 
•	Flere gamemodes 
•	Animationer 
•	Flere statistikker 
•	Multiplayer 
•	Achievement system 

Konklusion
Pokemon-Statle er et funktionelt webspil med både frontend, backend og databaseintegration. Produktet kombinerer strategi, progression og Pokémon-viden i en interaktiv oplevelse.
Projektet demonstrerer:
•	Fullstack udvikling 
•	API kommunikation 
•	Databasehåndtering 
•	Brugerautentifikation 
•	UI/UX design 
Produktet fungerer som planlagt og har gode muligheder for videreudvikling i fremtiden.

