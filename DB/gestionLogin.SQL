DROP SCHEMA gestionLogin CASCADE;

CREATE SCHEMA gestionLogin;

CREATE SEQUENCE gestionLogin.pk_utilisateurs;
CREATE SEQUENCE gestionLogin.pk_profils;
CREATE SEQUENCE gestionLogin.pk_logiciels;


CREATE TABLE gestionLogin.Profils (
	id_profil INTEGER PRIMARY KEY DEFAULT NEXTVAL ('gestionLogin.pk_profils'), 
	nom VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE gestionLogin.Utilisateurs (
	id_utilisateur INTEGER PRIMARY KEY DEFAULT NEXTVAL ('gestionLogin.pk_utilisateurs'),
	matricule INTEGER UNIQUE,
	nom VARCHAR (255) NOT NULL,
	prenom VARCHAR(255) NOT NULL,
	mail VARCHAR(255) UNIQUE,
	type VARCHAR(255) NOT NULL CHECK(type LIKE 'Etudiant' OR type LIKE 'Prof' OR type LIKE 'Admin' OR type LIKE 'Invite'),
	login VARCHAR(255) UNIQUE NOT NULL,
	id_profil INTEGER NOT NULL REFERENCES gestionLogin.Profils(id_profil)
);


CREATE TABLE gestionLogin.Logiciels (
	id_logiciel INTEGER PRIMARY KEY DEFAULT NEXTVAL ('gestionLogin.pk_logiciels'),
	nom VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE gestionLogin.Profils_Logiciels (
	id_profil INTEGER NOT NULL REFERENCES gestionLogin.Profils(id_profil),
	id_logiciel INTEGER NOT NULL REFERENCES gestionLogin.Logiciels(id_logiciel),
	PRIMARY KEY (id_profil, id_logiciel)
);

CREATE TABLE gestionLogin.Utilisateurs_Logiciels (
	id_utilisateur INTEGER NOT NULL REFERENCES gestionLogin.Utilisateurs(id_utilisateur),
	id_logiciel INTEGER NOT NULL REFERENCES gestionLogin.Logiciels(id_logiciel),
	mdp VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_utilisateur, id_logiciel)
);

-- VUE POUR CLAROLINE VERS CSV
CREATE VIEW gestionLogin.clarolineVersCSV(nom, prenom, mail, mdp) AS 
	SELECT u.nom, u.prenom, u.mail, ul.mdp
	FROM gestionLogin.Utilisateurs u, gestionLogin.Utilisateurs_Logiciels ul, gestionLogin.Profils p, gestionLogin.Profils_Logiciels pl, gestionLogin.Logiciels l
	WHERE l.nom LIKE 'Claroline' AND u.id_profil = p.id_profil AND p.id_profil = pl.id_profil 
	AND pl.id_logiciel = l.id_logiciel AND u.id_utilisateur = ul.id_utilisateur 
	AND ul.id_logiciel = l.id_logiciel AND u.type = 'Etudiant';	

-- VUE POUR WINDOWS VERS BAT
CREATE VIEW gestionLogin.windowsVersBAT(nom, prenom, mdp) AS 
	SELECT u.nom, u.prenom, ul.mdp
	FROM gestionLogin.Utilisateurs u, gestionLogin.Utilisateurs_Logiciels ul, gestionLogin.Profils p, gestionLogin.Profils_Logiciels pl, gestionLogin.Logiciels l
	WHERE l.nom LIKE 'Windows' AND u.id_profil = p.id_profil AND p.id_profil = pl.id_profil 
	AND pl.id_logiciel = l.id_logiciel AND u.id_utilisateur = ul.id_utilisateur 
	AND ul.id_logiciel = l.id_logiciel AND u.type = 'Etudiant';	

-- VUE POUR NUTRILOG VERS CSV
CREATE VIEW gestionLogin.nutrilogVersCSV(id, nom, prenom, mdp) AS 
	SELECT u.id_utilisateur, u.nom, u.prenom, ul.mdp
	FROM gestionLogin.Utilisateurs u, gestionLogin.Utilisateurs_Logiciels ul, gestionLogin.Profils p, gestionLogin.Profils_Logiciels pl, gestionLogin.Logiciels l
	WHERE l.nom LIKE 'Nutrilog' AND u.id_profil = p.id_profil AND p.id_profil = pl.id_profil 
	AND pl.id_logiciel = l.id_logiciel AND u.id_utilisateur = ul.id_utilisateur 
	AND ul.id_logiciel = l.id_logiciel AND u.type = 'Etudiant';

-- Gestion des Logiciels

-- AJOUT D'UN LOGICIEL

CREATE OR REPLACE FUNCTION gestionLogin.ajoutLogiciel(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_logiciel ALIAS FOR $1;
	id INTEGER := 0;
BEGIN
	INSERT INTO gestionLogin.Logiciels (nom) VALUES (nom_logiciel) RETURNING id_logiciel INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;

-- SUPPRESSION D'UNE APPLICATION

CREATE OR REPLACE FUNCTION gestionLogin.suppressionLogiciel(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_logiciel ALIAS FOR $1;
BEGIN
	DELETE FROM gestionLogin.Profils_Logiciels pl USING gestionLogin.Logiciels a WHERE a.id_logiciel = pl.id_logiciel AND a.nom LIKE nom_logiciel;
	DELETE FROM gestionLogin.Utilisateurs_Logiciels ul USING gestionLogin.Logiciels a WHERE a.id_logiciel = ul.id_logiciel AND a.nom LIKE nom_logiciel;
	DELETE FROM gestionLogin.Logiciels l WHERE l.nom LIKE nom_logiciel;

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

CREATE OR REPLACE FUNCTION gestionLogin.insererUtilisateur(INTEGER, VARCHAR(255), VARCHAR(255), VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER) RETURNS INTEGER AS $$
DECLARE
	id INTEGER := 0;
	matriculeUser ALIAS FOR $1;
	nomUser ALIAS FOR $2;
	prenomUser ALIAS FOR $3;
	mailUser ALIAS FOR $4;
	typeUser ALIAS FOR $5;
	loginUser ALIAS FOR $6;
	idProfil ALIAS FOR $7;
BEGIN
	INSERT INTO gestionLogin.Utilisateurs (matricule, nom, prenom, mail, type, login, id_profil) VALUES (matriculeUser, nomUser, prenomUser, mailUser, typeUser, loginUser, idProfil) RETURNING id_utilisateur INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;

<<<<<<< HEAD
/**
 * @Return 0 si non trouve
 * @Return >0 si trouve
*/

=======
>>>>>>> origin/master
CREATE OR REPLACE FUNCTION gestionLogin.connexionAdmin(VARCHAR(255),VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	id_c INTEGER := 0;
	login_c ALIAS FOR $1;
	mdp_c ALIAS FOR $2;
BEGIN
	SELECT u.id_utilisateur INTO id_c FROM gestionLogin.Utilisateurs u, gestionLogin.Utilisateurs_Logiciels ul, gestionLogin.Logiciels l 
				WHERE u.id_utilisateur = ul.id_utilisateur AND ul.id_logiciel = l.id_logiciel
					AND u.login LIKE login_c AND ul.mdp LIKE mdp_c
					AND l.nom LIKE 'GLOBAL';
	RETURN id_c;
END;
$$ LANGUAGE plpgsql;

<<<<<<< HEAD
/**
 * @Return null si matricule inexistant
 * @Return nom,prenom,profil,appli1,mdp1,appli2,mdp2, ...
*/

CREATE OR REPLACE FUNCTION gestionLogin.informationEtudiant(INTEGER) RETURNS text as $$
DECLARE
	matricule_c ALIAS FOR $1;
	retour text;
	profil_c VARCHAR(255);
	test record;
	inutile RECORD;
	retour_vide VARCHAR(255) := 'null';
BEGIN
	
	SELECT u.nom, u.prenom INTO test FROM gestionLogin.Utilisateurs u, gestionLogin.Profils p 
			WHERE u.matricule = matricule_c AND u.id_profil = p.id_profil;
	SELECT p.nom INTO profil_c FROM gestionLogin.Utilisateurs u, gestionLogin.Profils p 
			WHERE u.matricule = matricule_c AND u.id_profil = p.id_profil;

	-- Si matricule non trouve
	IF (test IS NULL) THEN
		RETURN retour_vide;
	END IF;

	retour := test.nom || ',' || test.prenom || ',' || profil_c;
	
	FOR inutile IN (SELECT l.nom , ul.mdp FROM gestionLogin.Utilisateurs u, gestionLogin.Profils p, gestionLogin.Logiciels l, 
											gestionLogin.Profils_Logiciels pl, gestionLogin.Utilisateurs_Logiciels ul 
										WHERE p.id_profil = u.id_profil AND p.id_profil = pl.id_profil
										AND l.id_logiciel = pl.id_logiciel AND u.id_utilisateur = ul.id_utilisateur
										AND l.id_logiciel = ul.id_logiciel AND u.matricule = matricule_c) LOOP
		retour := retour || ',' || inutile.nom || ',' || inutile.mdp;

	END LOOP;

	RETURN retour;

END;
$$ LANGUAGE plpgsql;
=======
>>>>>>> origin/master




