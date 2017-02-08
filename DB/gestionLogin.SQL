DROP SCHEMA public CASCADE;

CREATE SCHEMA public;

CREATE SEQUENCE public.pk_utilisateurs;
CREATE SEQUENCE public.pk_profils;
CREATE SEQUENCE public.pk_logiciels;


CREATE TABLE public.Profils (
	id_profil INTEGER PRIMARY KEY DEFAULT NEXTVAL ('public.pk_profils'), 
	nom VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE public.Utilisateurs (
	id_utilisateur INTEGER PRIMARY KEY DEFAULT NEXTVAL ('public.pk_utilisateurs'),
	matricule INTEGER UNIQUE,
	nom VARCHAR (255) NOT NULL,
	prenom VARCHAR(255) NOT NULL,
	mail VARCHAR(255) UNIQUE,
	type VARCHAR(255) NOT NULL CHECK(type LIKE 'Etudiant' OR type LIKE 'Prof' OR type LIKE 'Admin' OR type LIKE 'Invite'),
	login VARCHAR(255) UNIQUE NOT NULL,
	id_profil INTEGER NOT NULL REFERENCES public.Profils(id_profil)
);


CREATE TABLE public.Logiciels (
	id_logiciel INTEGER PRIMARY KEY DEFAULT NEXTVAL ('public.pk_logiciels'),
	nom VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE public.Profils_Logiciels (
	id_profil INTEGER NOT NULL REFERENCES public.Profils(id_profil),
	id_logiciel INTEGER NOT NULL REFERENCES public.Logiciels(id_logiciel),
	PRIMARY KEY (id_profil, id_logiciel)
);

CREATE TABLE public.Utilisateurs_Logiciels (
	id_utilisateur INTEGER NOT NULL REFERENCES public.Utilisateurs(id_utilisateur),
	id_logiciel INTEGER NOT NULL REFERENCES public.Logiciels(id_logiciel),
	mdp VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_utilisateur, id_logiciel)
);

/*******************
*		VUES       *
*******************/

-- VUE POUR CLAROLINE VERS CSV
CREATE VIEW public.clarolineVersCSV(nom, prenom, mail, mdp) AS 
	SELECT u.nom, u.prenom, u.mail, ul.mdp
	FROM public.Utilisateurs u, public.Utilisateurs_Logiciels ul, public.Profils p, public.Profils_Logiciels pl, public.Logiciels l
	WHERE l.nom LIKE 'Claroline' AND u.id_profil = p.id_profil AND p.id_profil = pl.id_profil 
	AND pl.id_logiciel = l.id_logiciel AND u.id_utilisateur = ul.id_utilisateur 
	AND ul.id_logiciel = l.id_logiciel AND u.type = 'Etudiant';	

-- VUE POUR WINDOWS VERS BAT
CREATE VIEW public.windowsVersBAT(nom, prenom, mdp) AS 
	SELECT u.nom, u.prenom, ul.mdp
	FROM public.Utilisateurs u, public.Utilisateurs_Logiciels ul, public.Profils p, public.Profils_Logiciels pl, public.Logiciels l
	WHERE l.nom LIKE 'Windows' AND u.id_profil = p.id_profil AND p.id_profil = pl.id_profil 
	AND pl.id_logiciel = l.id_logiciel AND u.id_utilisateur = ul.id_utilisateur 
	AND ul.id_logiciel = l.id_logiciel AND u.type = 'Etudiant';	

-- VUE POUR NUTRILOG VERS CSV
CREATE VIEW public.nutrilogVersCSV(id, nom, prenom, mdp) AS 
	SELECT u.id_utilisateur, u.nom, u.prenom, ul.mdp
	FROM public.Utilisateurs u, public.Utilisateurs_Logiciels ul, public.Profils p, public.Profils_Logiciels pl, public.Logiciels l
	WHERE l.nom LIKE 'Nutrilog' AND u.id_profil = p.id_profil AND p.id_profil = pl.id_profil 
	AND pl.id_logiciel = l.id_logiciel AND u.id_utilisateur = ul.id_utilisateur 
	AND ul.id_logiciel = l.id_logiciel AND u.type = 'Etudiant';



/*******************
*	 FONCTIONS     *
*******************/

/**
 * Inserer un logiciel
 * @Param nom
 *
 * @Return 0 si erreur lors de l'insertion
 * @Return >0 si insertion reussie
*/

CREATE OR REPLACE FUNCTION public.ajoutLogiciel(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_logiciel ALIAS FOR $1;
	id INTEGER := 0;
BEGIN
	INSERT INTO public.Logiciels (nom) VALUES (nom_logiciel) RETURNING id_logiciel INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;

/**
 * Supprimer un logiciel
 * @Param nom
 *
 * @Return 1
*/

CREATE OR REPLACE FUNCTION public.suppressionLogiciel(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_logiciel ALIAS FOR $1;
BEGIN
	DELETE FROM public.Profils_Logiciels pl USING public.Logiciels a WHERE a.id_logiciel = pl.id_logiciel AND a.nom LIKE nom_logiciel;
	DELETE FROM public.Utilisateurs_Logiciels ul USING public.Logiciels a WHERE a.id_logiciel = ul.id_logiciel AND a.nom LIKE nom_logiciel;
	DELETE FROM public.Logiciels l WHERE l.nom LIKE nom_logiciel;

  	RETURN 1;
END;

$$ LANGUAGE plpgsql;

/**
 * Modifier un profil
 * @Param nom
 *
 * @Return 0 si non trouve
 * @Return >0 si trouve
*/

CREATE OR REPLACE FUNCTION public.modifierLogiciel(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_logiciel ALIAS FOR $1;
	id_retour INTEGER := 0;
BEGIN
	UPDATE public.Logiciels
	SET nom = nom_logiciel
	WHERE nom = nom_logiciel RETURNING id_logiciel INTO id_retour;

	RETURN id_retour;
END;
$$ LANGUAGE plpgsql;


/**
 * Inserer un profil
 * @Param nom
 *
 * @Return 0 si erreur lors de l'insertion
 * @Return >0 si insertion reussie
*/

CREATE OR REPLACE FUNCTION public.insererProfil(VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	nom_profil ALIAS FOR $1;
	id INTEGER := 0;
BEGIN
	INSERT INTO public.Profils (nom) VALUES (nom_profil) RETURNING id_profil INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.insererUtilisateur(INTEGER, VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER) RETURNS INTEGER AS $$
DECLARE
	id INTEGER := 0;
	nomUser ALIAS FOR $1;
	prenomUser ALIAS FOR $2;
	typeUser ALIAS FOR $3;
	loginUser ALIAS FOR $4;
	idProfil ALIAS FOR $5;
BEGIN
	INSERT INTO public.Utilisateurs (nom, prenom, type, login, id_profil) VALUES (nomUser, prenomUser, typeUser, loginUser, idProfil) RETURNING id_utilisateur INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;

/**
 * Inserer un utilisateur
 * @Param matricule , nom, prenom, mail, type, login, id du profil lie
 *
 * @Return 0 si erreur lors de l'insertion
 * @Return >0 si insertion reussie
*/

CREATE OR REPLACE FUNCTION public.insererUtilisateur(INTEGER, VARCHAR(255), VARCHAR(255), VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER) RETURNS INTEGER AS $$
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
	INSERT INTO public.Utilisateurs (matricule, nom, prenom, mail, type, login, id_profil) VALUES (matriculeUser, nomUser, prenomUser, mailUser, typeUser, loginUser, idProfil) RETURNING id_utilisateur INTO id;
	RETURN id;
END;

$$ LANGUAGE plpgsql;


/**
 * Verifier la connexion d'un admin
 * @Param login , mot de passe
 *
 * @Return 0 si non trouve
 * @Return >0 si trouve
*/

CREATE OR REPLACE FUNCTION public.connexionAdmin(VARCHAR(255),VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	id_c INTEGER := 0;
	login_c ALIAS FOR $1;
	mdp_c ALIAS FOR $2;
BEGIN
	SELECT u.id_utilisateur INTO id_c FROM public.Utilisateurs u, public.Utilisateurs_Logiciels ul, public.Logiciels l 
				WHERE u.id_utilisateur = ul.id_utilisateur AND ul.id_logiciel = l.id_logiciel
					AND u.login LIKE login_c AND ul.mdp LIKE mdp_c
					AND l.nom LIKE 'GLOBAL';
	RETURN id_c;
END;
$$ LANGUAGE plpgsql;

/**
 * Renvoyer les informations de l'etudiant
 * @Param matricule de l'etudiant
 *
 * @Return null si matricule inexistant
 * @Return matricule,nom,prenom,mail,profil,login,logic1,mdp1,logic2,mdp2, ...
*/

CREATE OR REPLACE FUNCTION public.informationEtudiant(INTEGER) RETURNS text as $$
DECLARE
	matricule_c ALIAS FOR $1;
	retour text;
	profil_c VARCHAR(255);
	info_u record;
	info_l RECORD;
	retour_vide VARCHAR(255) := 'null';
BEGIN
	
	SELECT u.matricule, u.nom, u.prenom, u.mail, u.login INTO info_u FROM public.Utilisateurs u, public.Profils p 
			WHERE u.matricule = matricule_c AND u.id_profil = p.id_profil;
	SELECT p.nom INTO profil_c FROM public.Utilisateurs u, public.Profils p 
			WHERE u.matricule = matricule_c AND u.id_profil = p.id_profil;

	-- Si matricule non trouve
	IF (info_u IS NULL) THEN
		RETURN retour_vide;
	END IF;

	retour := info_u.matricule || ',' || info_u.nom || ',' || info_u.prenom || ',' || info_u.mail || ',' || profil_c || ',' || info_u.login;
	
	FOR info_l IN (SELECT l.nom , ul.mdp FROM public.Utilisateurs u, public.Profils p, public.Logiciels l, 
											public.Profils_Logiciels pl, public.Utilisateurs_Logiciels ul 
										WHERE p.id_profil = u.id_profil AND p.id_profil = pl.id_profil
										AND l.id_logiciel = pl.id_logiciel AND u.id_utilisateur = ul.id_utilisateur
										AND l.id_logiciel = ul.id_logiciel AND u.matricule = matricule_c) LOOP
		retour := retour || ',' || info_l.nom || ',' || info_l.mdp;

	END LOOP;

	RETURN retour;

END;
$$ LANGUAGE plpgsql;



