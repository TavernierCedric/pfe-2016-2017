INSERT INTO public.Logiciels VALUES (DEFAULT, 'Windows');
INSERT INTO public.Logiciels VALUES (DEFAULT, 'Claroline');
INSERT INTO public.Logiciels VALUES (DEFAULT, 'Nutrilog');
INSERT INTO public.Logiciels VALUES (DEFAULT,'GLOBAL');


INSERT INTO public.Profils VALUES (DEFAULT, '3BIN');
INSERT INTO public.Profils VALUES (DEFAULT, 'Admin');

INSERT INTO public.Profils_Logiciels VALUES (1,1);
INSERT INTO public.Profils_Logiciels VALUES (1,2);
INSERT INTO public.Utilisateurs VALUES (DEFAULT, 123, 'degreve','olivier','degreveolivier@hotmail.com','Etudiant','odegreve',1);
INSERT INTO public.Utilisateurs (matricule, nom, prenom, type, login, id_profil)
VALUES (1111,'Cor', 'Corentin','Admin', 'ccorentin',2);

INSERT INTO public.Utilisateurs_Logiciels VALUES (2,4,'admin');

INSERT INTO public.Utilisateurs_Logiciels VALUES (1,1,'mdpWindows');
INSERT INTO public.Utilisateurs_Logiciels VALUES (1,2,'mdpJquery');

--SELECT public.informationEtudiant(123);

SELECT public.connexionAdmin('ccorentin','admin');