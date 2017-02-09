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

/**
 * Modifier les logiciels liés à un profil
 * @Param nomProfil,nomLogiciel1,nomLogiciel2, ...
 *
 * @Return 0 si profil inexistant 
 * @Return 1 si reussite
 * Ne devrait jamais renvoyer 0 normalement
*/

CREATE OR REPLACE FUNCTION public.modificationProfilLogiciel(text) RETURNS INTEGER as $$
DECLARE
	chaine ALIAS FOR $1;
	nom_profil text;
	id_p INTEGER := 0;
	nom_logiciel VARCHAR(255);
	info_id RECORD;
	logiciel_p RECORD;
	i INTEGER := 2;
	j INTEGER := 2;
BEGIN
	nom_profil := split_part(chaine, ',', 1);


	SELECT p.id_profil INTO id_p FROM public.Profils p WHERE lower(p.nom) LIKE lower(nom_profil);
	
	IF (id_p IS NULL) THEN
		RETURN 0;
	END IF;

	WHILE (i > 1) LOOP
		nom_logiciel := split_part(chaine, ',', i);


		i := i + 1;
		
			-- S'il existe je ne fais rien mais je dois tester !
		IF EXISTS (SELECT p.id_profil, l.id_logiciel FROM public.Profils p, public.Logiciels l, public.Profils_Logiciels pl
					WHERE p.id_profil = pl.id_profil AND l.id_logiciel = pl.id_logiciel AND l.nom LIKE nom_logiciel AND p.nom LIKE nom_profil) THEN
					continue; -- je ne fais rien
		ELSE
			-- Si il n'existe pas et que le nom logiciel n'est pas vide, je l'ajoute
			IF (nom_logiciel <> '') THEN 
				SELECT l.id_logiciel INTO info_id FROM public.Logiciels l WHERE lower(l.nom) LIKE lower(nom_logiciel);
				INSERT INTO public.Profils_Logiciels VALUES (id_p, info_id.id_logiciel);
				continue ;
			END IF;
		END IF;

		-- sinon le nom du logiciel est d'office vide, je sors de la boucle

		i := 0;
	END LOOP; -- Fin du WHILE 

	-- On doit maintenant verifier que les logiciels d'avant soient toujours present !

	FOR logiciel_p IN (SELECT l.id_logiciel, l.nom FROM public.Logiciels l, public.Profils p, public.Profils_Logiciels pl
						WHERE p.id_profil = pl.id_profil AND l.id_logiciel = pl.id_logiciel AND p.id_profil = id_p) LOOP 

		while (j > 1) LOOP
			nom_logiciel := split_part(chaine, ',', j);

			j := j + 1;

				-- Si bien present je quitte la boucle while
			IF (nom_logiciel LIKE logiciel_p.nom) THEN
				j := 2;
				EXIT;
			END IF;
			
			-- Si le nom logicile est null alors il a d'office ete supprime dans la checkbox
			IF (nom_logiciel = '') THEN
				DELETE FROM public.Profils_Logiciels WHERE id_logiciel = logiciel_p.id_logiciel;
				j := 2;
				EXIT;
			END IF;

		END LOOP;
	END LOOP; -- Fin du FOR

	RETURN 1;
END;
$$ LANGUAGE plpgsql;

/**
 * Insere un mot de passe pour chaque logiciel correspondant au profil
 * @Param id_utilisateur, id_profil, mdp
 *
 * @Return 0 si erreur lors de l'insert ou profil non lie a l'etudiant
 * @Return 1 si reussite
*/

CREATE OR REPLACE FUNCTION public.insererMotDePasse(INTEGER, INTEGER, VARCHAR(255)) RETURNS INTEGER AS $$
DECLARE
	id_uti ALIAS FOR $1;
	id_prof ALIAS FOR $2;
	mot_de_passe ALIAS FOR $3;
	id_logic INTEGER := 0;
BEGIN

	IF NOT EXISTS (SELECT * FROM public.Utilisateurs u WHERE u.id_utilisateur = id_uti AND u.id_profil = id_prof) THEN
		RETURN 0; -- Utilisateur non lie a ce profil !
	END IF;

	FOR id_logic IN (SELECT pl.id_logiciel FROM public.Profils p , public.Profils_Logiciels pl WHERE p.id_profil = pl.id_profil AND p.id_profil = id_prof ) LOOP

		INSERT INTO public.Utilisateurs_Logiciels VALUES (id_uti, id_logic, mot_de_passe);	

		IF NOT FOUND THEN
			RETURN 0;
		END IF;

	END LOOP;

	RETURN 1;

END;

$$ LANGUAGE plpgsql;



