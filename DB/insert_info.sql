INSERT INTO gestionLogin.Logiciels VALUES (DEFAULT, 'Windows');
INSERT INTO gestionLogin.Logiciels VALUES (DEFAULT, 'Claroline');
INSERT INTO gestionLogin.Logiciels VALUES (DEFAULT, 'Nutrilog');
INSERT INTO gestionLogin.Logiciels VALUES (DEFAULT,'GLOBAL');


INSERT INTO gestionLogin.Profils VALUES (DEFAULT, '3BIN');
INSERT INTO gestionLogin.Profils VALUES (DEFAULT, 'Admin');

INSERT INTO gestionLogin.Profils_Logiciels VALUES (1,1);
INSERT INTO gestionLogin.Profils_Logiciels VALUES (1,2);
INSERT INTO gestionLogin.Utilisateurs VALUES (DEFAULT, 123, 'degreve','olivier','degreveolivier@hotmail.com','Etudiant','odegreve',1);
INSERT INTO gestionLogin.Utilisateurs (matricule, nom, prenom, type, login, id_profil)
VALUES (1111,'Cor', 'Corentin','Admin', 'ccorentin',2);

INSERT INTO gestionLogin.Utilisateurs_Logiciels VALUES (2,4,'admin');

INSERT INTO gestionLogin.Utilisateurs_Logiciels VALUES (1,1,'mdpWindows');
INSERT INTO gestionLogin.Utilisateurs_Logiciels VALUES (1,2,'mdpJquery');

--SELECT gestionLogin.informationEtudiant(123);

SELECT gestionLogin.connexionAdmin('ccorentin','admin');