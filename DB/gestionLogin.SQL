DROP SCHEMA gestionLogin CASCADE;

CREATE SCHEMA gestionLogin;

CREATE SEQUENCE gestionLogin.pk_profils;
CREATE SEQUENCE gestionLogin.pk_applications;


CREATE TABLE gestionLogin.Profils (
	id_profil INTEGER PRIMARY KEY DEFAULT NEXTVAL ('gestionLogin.pk_profils'), 
	nom VARCHAR(255) NOT NULL
);

CREATE TABLE gestionLogin.Utilisateurs (
	id_utilisateur INTEGER PRIMARY KEY,
	nom VARCHAR (255) NOT NULL,
	prenom VARCHAR(255) NOT NULL,
	mail VARCHAR(255) NOT NULL UNIQUE,
	type VARCHAR(255) NOT NULL CHECK(type LIKE 'Etudiant' OR type LIKE 'Prof' OR type LIKE 'Admin' OR type LIKE 'Visiteur'),
	id_profil INTEGER NOT NULL REFERENCES gestionLogin.Profils(id_profil)
);


CREATE TABLE gestionLogin.Applications (
	id_application INTEGER NOT NULL PRIMARY KEY DEFAULT NEXTVAL ('gestionLogin.pk_applications'),
	nom VARCHAR(255) NOT NULL
);

CREATE TABLE gestionLogin.Profils_Applications (
	id_profil INTEGER NOT NULL REFERENCES gestionLogin.Profils(id_profil),
	id_application INTEGER NOT NULL REFERENCES gestionLogin.Applications(id_application),
	PRIMARY KEY (id_profil, id_application)
);

CREATE TABLE gestionLogin.Utilisateurs_Applications (
	id_application INTEGER NOT NULL REFERENCES gestionLogin.Applications(id_application),
	id_utilisateur INTEGER NOT NULL REFERENCES gestionLogin.Utilisateurs(id_utilisateur),
	mdp VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_utilisateur, id_application)
);

-- VUE POUR CLAROLINE VERS CSV
CREATE VIEW gestionLogin.clarolineVersCSV(nom, prenom, mail, mdp) AS 
	SELECT u.nom, u.prenom, u.mail, ua.mdp
	FROM gestionLogin.Utilisateurs u, gestionLogin.Utilisateurs_Applications ua, gestionLogin.Profils p, gestionLogin.Profils_Applications pa, gestionLogin.Applications a
	WHERE a.nom LIKE 'Claroline' AND u.id_profil = p.id_profil AND p.id_profil = pa.id_profil 
	AND pa.id_application = a.id_application AND u.id_utilisateur = ua.id_utilisateur 
	AND ua.id_application = a.id_application AND u.type = 'Etudiant';	

-- VUE POUR WINDOWS VERS BAT
CREATE VIEW gestionLogin.windowsVersBAT(nom, prenom, mdp) AS 
	SELECT u.nom, u.prenom, ua.mdp
	FROM gestionLogin.Utilisateurs u, gestionLogin.Utilisateurs_Applications ua, gestionLogin.Profils p, gestionLogin.Profils_Applications pa, gestionLogin.Applications a
	WHERE a.nom LIKE 'Windows' AND u.id_profil = p.id_profil AND p.id_profil = pa.id_profil 
	AND pa.id_application = a.id_application AND u.id_utilisateur = ua.id_utilisateur 
	AND ua.id_application = a.id_application AND u.type = 'Etudiant';	

-- VUE POUR NUTRILOG VERS CSV
CREATE VIEW gestionLogin.nutrilogVersCSV(id, nom, prenom, mdp) AS 
	SELECT u.id_utilisateur, u.nom, u.prenom, ua.mdp
	FROM gestionLogin.Utilisateurs u, gestionLogin.Utilisateurs_Applications ua, gestionLogin.Profils p, gestionLogin.Profils_Applications pa, gestionLogin.Applications a
	WHERE a.nom LIKE 'Nutrilog' AND u.id_profil = p.id_profil AND p.id_profil = pa.id_profil 
	AND pa.id_application = a.id_application AND u.id_utilisateur = ua.id_utilisateur 
	AND ua.id_application = a.id_application AND u.type = 'Etudiant';

-- Gestion des Logiciels

-- AJOUT D'UN LOGICIEL

CREATE OR REPLACE FUNCTION gestionLogin.ajoutApplication(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_application ALIAS FOR $1;
	id INTEGER := 0;
BEGIN
	INSERT INTO gestionLogin.Applications (nom) VALUES (nom_application) RETURNING id_application INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;

-- SUPPRESSION D'UNE APPLICATION

CREATE OR REPLACE FUNCTION gestionLogin.suppressionApplication(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_application ALIAS FOR $1;
BEGIN
	DELETE FROM gestionLogin.Profils_Applications pa USING gestionLogin.Applications a WHERE a.id_application = pa.id_application AND a.nom = nom_application;
	DELETE FROM gestionLogin.Utilisateurs_Applications ua USING gestionLogin.Applications a WHERE a.id_application = ua.id_application AND a.nom = nom_application;
	DELETE FROM gestionLogin.Applications a WHERE a.nom = nom_application;

  	RETURN 1;
END;

$$ LANGUAGE plpgsql;

-- MODIFIER LOGICIEL



-- INSERTION PROFIL

CREATE OR REPLACE FUNCTION gestionLogin.insererProfil(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_profil ALIAS FOR $1;
	id INTEGER := 0;
BEGIN
	INSERT INTO gestionLogin.Profils (nom) VALUES (nom_profil) RETURNING id_profil INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;

-- INSERTION UTILISATEUR

CREATE OR REPLACE FUNCTION gestionLogin.insererUtilisateur(INTEGER, VARCHAR(255), VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER) RETURNS INTEGER AS $$
DECLARE
	id INTEGER := 0;
	idUser ALIAS FOR $1;
	nomUser ALIAS FOR $2;
	prenomUser ALIAS FOR $3;
	mailUser ALIAS FOR $4;
	type ALIAS FOR $5;
	idProfil ALIAS FOR $6;
BEGIN
	INSERT INTO gestionLogin.Utilisateurs (id_utilisateur, nom, prenom, mail, type, id_profil) VALUES (idUser, nomUser, prenomUser, mailUser, type, idProfil) RETURNING id_utilisateur INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;





