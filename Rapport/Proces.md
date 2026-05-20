Procesrapport – Pokemon-Statle
Projektbeskrivelse
Projektet handler om udviklingen af et webbaseret spil inspireret af Statle, hvor spilleren skal bruge sin viden om Pokémon til at opnå en samlet score på mindst 600 base stats. Spilleren får vist én Pokémon ad gangen og skal vælge den stat, de tror er bedst. Når alle stats er brugt, afsluttes spillet, og spilleren får sin samlede score.
Projektet er udviklet som en fullstack webapplikation med frontend i React/Next.js, backend i C#, samt PostgreSQL database via Neon.

Arbejdsproces
Dag 1 – Idé og planlægning
Første dag blev brugt på at finde en idé til projektet og planlægge arbejdet. Jeg valgte at lave et Pokémon-baseret spil, fordi jeg gerne ville lave noget interaktivt med strategi og brugerinput.
Jeg lavede:
•	Casebeskrivelse 
•	Kravspecifikation 
•	Tidsplan for projektet 
Dette gav et overblik over funktioner og hjalp med at strukturere arbejdet.

Dag 2 – Opsætning af projekt
Jeg satte projektet op med:
•	React og Next.js til frontend 
•	C# backend 
•	PostgreSQL database 
Jeg lavede også et databasediagram for at planlægge tabeller og relationer.
Derudover udviklede jeg:
•	Logik til at hente tilfældige Pokémon med stats 
•	Selve spillogikken 
•	Regler så samme stat ikke kunne vælges flere gange 
•	API endpoints til test i Swagger 
Dette var vigtigt, fordi backend-logikken er grundlaget for hele spillet.

Dag 3-11 – Udvikling af grundfunktioner
I denne periode arbejdede jeg videre med:
•	Frontend design 
•	API kommunikation 
•	Brugerlogin 
•	Scoreberegning 
•	Visning af Pokémon 
•	Håndtering af spilrunder 
Jeg arbejdede også med at forbinde frontend og backend korrekt, så spillet kunne fungere dynamisk.

Dag 12 – Pokédex system
Jeg implementerede et Pokédex-system.
Systemet gemmer Pokémon-navne i databasen, så brugeren kan følge hvilke Pokémon de har mødt og vundet med.
Jeg lavede:
•	Pokédex side til logged-in brugere 
•	Farvesystem: 
o	Sort = ikke set 
o	Grå = set i spil 
o	Farve = vundet med Pokémon 
Dette gjorde spillet mere motiverende og gav spilleren progression.

Dag 13 – Filtrering og statistik
Jeg implementerede:
•	Sortering mellem generationer 
•	Oversigt over hvor mange Pokémon spilleren har samlet 
Dette gjorde Pokédex-systemet mere overskueligt og brugervenligt.

Dag 14 – LocalStorage og UI forbedringer
Jeg tilføjede:
•	LocalStorage til håndtering af flere spil samtidig 
•	Lys og mørk tilstand 
•	Nyt ikon og beskrivelse på hjemmesiden 
LocalStorage blev brugt for at undgå konflikter mellem spil og forbedre brugeroplevelsen.

Dag 15 – Leaderboard forbedringer
Jeg ændrede databasen, så Pokémon-navne blev gemt sammen med games.
For at gøre dette slettede jeg eksisterende games i databasen, da strukturen skulle ændres.
Jeg implementerede:
•	Visning af Pokémon-hold på leaderboard 
•	Mere detaljerede resultater 
Dette gjorde leaderboardet mere interessant og personligt.

Udfordringer under projektet
Jeg oplevede flere udfordringer under udviklingen:
Databaseændringer
Da jeg senere ville gemme Pokémon-navne i games-tabellen, skulle databasen ændres. Det betød, at tidligere data måtte slettes.
Frontend og backend kommunikation
Det tog tid at få API og frontend til at arbejde korrekt sammen, især med state management og håndtering af spillets data.
Spillogik
Det var vigtigt at sikre:
•	At stats ikke kunne vælges flere gange 
•	At score blev beregnet korrekt 
•	At spillet afsluttede korrekt efter alle valg 

Hvad jeg har lært
Gennem projektet har jeg lært:
•	Hvordan man udvikler en fullstack webapplikation 
•	Hvordan frontend og backend kommunikerer via API 
•	Hvordan databaser bruges til at gemme brugerdata 
•	Hvordan man arbejder med React/Next.js og C# 
•	Hvordan man planlægger og udvikler et større projekt over kort tid 
Jeg har også fået erfaring med:
•	Fejlfinding 
•	Database design 
•	UI/UX forbedringer 
Konklusion
Projektet blev en funktionel webapplikation med både backend, frontend og database. Jeg fik udviklet de vigtigste funktioner og skabt et spil, der fungerer som planlagt.
Der er stadig muligheder for videreudvikling, blandt andet:
•	Daily challenges 
•	Flere gamemodes 
•	Bedre statistik 
•	Flere sociale funktioner 
