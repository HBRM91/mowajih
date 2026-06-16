# Conformité CNDP — JAD2 TAWJIH
## Dossier opérationnel · 2 phases · Usage interne uniquement

> **Portail de dépôt :** https://portail.cndp.ma  
> **Loi de référence :** Loi n° 09-08 du 18 février 2009 relative à la protection des personnes physiques à l'égard des traitements des données à caractère personnel  
> **Décret d'application :** Décret n° 2-09-165 du 21 mai 2009

---

## Logique des 2 phases

JAD2 TAWJIH fonctionne en deux régimes de collecte distincts, contrôlés par un toggle dans l'admin (`Paramètres > Mode de collecte`). Chaque régime a sa propre base légale CNDP.

| | Phase 1 — Mode anonyme | Phase 2 — Mode complet |
|---|---|---|
| **Toggle admin** | `anonymous` (défaut actuel) | `full` |
| **Données collectées** | Filière, notes, région, budget uniquement | + Prénom, nom, email, téléphone, opt-in écoles |
| **Formulaire CNDP** | DS — Déclaration Simplifiée | A-GC — Autorisation Générale + T-HB |
| **Délai CNDP** | Récépissé immédiat (24 – 72 h) | 30 à 60 jours |
| **Déposer avant** | **17 juin 2026** (nuit des résultats Bac) | Avant d'activer le toggle `full` |
| **Référence légale** | Art. 18 Loi 09-08 (déclaration) | Art. 12 Loi 09-08 (autorisation préalable) |
| **N° récépissé** | DS – ___________________ | A-GC – ___________________ |
| **Date dépôt** | ___________________ | ___________________ |
| **Date approbation** | Immédiate (récépissé) | ___________________ |

> **Règle absolue :** Le toggle admin `full` ne doit **jamais** être activé avant réception du n° d'autorisation A-GC. La DS seule ne couvre pas la collecte de données personnelles.

---

## PHASE 1 — Déclaration Simplifiée (DS)

### Pourquoi une DS et non une absence de déclaration ?

Techniquement, des données purement anonymes (ne permettant pas d'identifier une personne) sont hors du champ de la Loi 09-08. Mais **déposer une DS présente trois avantages concrets** :

1. **Couverture officielle** — Le récépissé prouve la bonne foi auprès des écoles partenaires, des utilisateurs et d'éventuels contrôles.
2. **Obligation de déclaration pour les statistiques** — L'art. 18 exige une DS pour tout traitement à finalité statistique ou de recherche, même sur données anonymes agrégées.
3. **Prérequis implicite** — La CNDP attend un récépissé DS avant d'instruire une A-GC. Déposer simultanément la Phase 1 avant la Phase 2 est la bonne séquence.

### Éligibilité DS (Art. 18 Loi 09-08)

Cocher toutes les cases avant de déposer :

- [x] Finalité : statistiques ou recherche scientifique
- [x] Aucune donnée identifiante directe (nom, prénom, email, CIN, téléphone)
- [x] Pas de données sensibles (santé, religion, opinions politiques)
- [x] Destinataires : interne + statistiques agrégées uniquement

---

### Formulaire DS — Contenu exact (à copier-coller sur portail.cndp.ma)

**Rubrique : Responsable du traitement**
```
Dénomination : JAD2 Advisory — Division Éducation
Responsable légal : Hamza El Bouhali
Forme juridique : Auto-entrepreneur / Personne physique
Email DPO : jad2advisory@gmail.com
Téléphone : [VOTRE NUMÉRO]
Adresse siège : [VOTRE ADRESSE COMPLÈTE AU MAROC]
Site web : tawjih-web.pages.dev
```

**Rubrique : Dénomination du traitement**
```
Traitement statistique anonymisé des données d'orientation scolaire des bacheliers marocains
```

**Rubrique : Finalité**
```
Traitement statistique à des fins de recherche sur les tendances d'orientation académique
des lycéens marocains. Les données collectées, strictement non-identifiantes, servent à
améliorer les algorithmes de recommandation d'orientation de la plateforme JAD2 TAWJIH
et à produire des indicateurs agrégés sur les filières et profils académiques des bacheliers
en vue des résultats du Baccalauréat 2026.
```

**Rubrique : Description fonctionnelle**
```
JAD2 TAWJIH est une plateforme web d'orientation académique gratuite, destinée aux lycéens
marocains de Terminale. L'utilisateur renseigne sa filière Baccalauréat, ses notes par
matière, sa ville et région, et sa tranche de budget familial. Un algorithme calcule
instantanément des recommandations d'orientation personnalisées.

En mode de collecte statistique (Phase 1), aucune donnée permettant d'identifier
directement ou indirectement un individu n'est collectée ni stockée. Aucun nom, prénom,
email, numéro de téléphone, numéro de CIN ni adresse n'est demandé. Les recommandations
sont calculées dans le navigateur de l'utilisateur ; seul un profil anonyme est transmis
aux serveurs pour améliorer la qualité des recommandations.
```

**Rubrique : Catégories de données traitées**
```
1. Données académiques (non-identifiantes) :
   — Filière Baccalauréat (SM, PC, SVT, SE, SH, STI, L)
   — Notes par matière sur 20 (numériques)
   — Mention estimée (Passable, Assez Bien, Bien, Très Bien)

2. Données de localisation (non précise, non nominative) :
   — Région administrative parmi les 12 régions du Maroc
   — Ville parmi une liste déroulante prédéfinie (non géolocalisée)

3. Données socio-économiques anonymisées :
   — Tranche de budget familial mensuel (4 tranches : <3 000, 3 000–8 000,
     8 000–15 000, >15 000 MAD/mois)

DONNÉES NON COLLECTÉES EN PHASE 1 : prénom, nom, date de naissance, CIN,
adresse postale, email, numéro de téléphone, données biométriques, données de santé,
données de paiement.
```

**Rubrique : Catégories de personnes concernées**
```
Lycéens marocains en classe de Terminale (Baccalauréat), âge estimé 17–19 ans.
Utilisation volontaire, sans inscription ni création de compte.
```

**Rubrique : Destinataires**
```
— Équipe interne JAD2 Advisory exclusivement (accès administrateur restreint)
— Statistiques agrégées et anonymisées uniquement : établissements d'enseignement
  supérieur marocains partenaires à titre indicatif (ex. : "35 % des bacheliers SM
  de Casablanca visent l'ingénierie"). Aucune donnée individuelle transmise.
```

**Rubrique : Transfert hors Maroc**
```
OUI — Infrastructure technique hébergée par Cloudflare, Inc. (USA).

Données transférées : données académiques et socio-économiques anonymisées uniquement.
Mesures de sécurité :
  — Transmission de données anonymisées exclusivement (aucun identifiant)
  — Chiffrement TLS 1.3 en transit
  — Cloudflare certifié ISO 27001, SOC 2 Type II
  — Cloudflare adhère au Data Privacy Framework UE-US
  — Serveurs edge de la région Europe West pour les utilisateurs marocains

⚠ Déclaration de transfert T-HB déposée simultanément (voir ci-dessous).
```

**Rubrique : Durée de conservation**
```
24 mois maximum à compter de la date de soumission du formulaire d'orientation.
Suppression automatique par tâche planifiée (Cloudflare Workers Cron).
Suppression anticipée possible sur demande à jad2advisory@gmail.com.
```

**Rubrique : Mesures de sécurité (Art. 23 Loi 09-08)**
```
— Chiffrement en transit : HTTPS/TLS 1.3 (Cloudflare, obligatoire)
— Chiffrement au repos : Cloudflare KV / D1 (chiffrement natif)
— Accès administrateur : authentification par jeton sécurisé Bearer + 2FA
— Journal d'audit : enregistrement de tous les accès administrateurs aux données
— Cloisonnement des données : données statistiques séparées, aucune jointure PII possible
— Politique de rétention automatique : champ retentionExpiry en base de données D1
— Infrastructure : Cloudflare Workers — pas de serveur physique à gérer
```

---

### Formulaire T-HB (Phase 1) — Transfert hors Maroc (données anonymes)

À déposer **simultanément** avec la DS, en référençant le récépissé DS.

**Formulaire T-HB — Contenu**
```
Responsable du traitement : JAD2 Advisory — Hamza El Bouhali
Numéro dossier DS : [À COMPLÉTER après obtention du récépissé]

Destinataire du transfert : Cloudflare, Inc.
Pays de destination : États-Unis d'Amérique
Région de stockage effectif : Europe West (Union Européenne)

Nature des données transférées :
  Données académiques et socio-économiques anonymisées uniquement
  (filière, notes, région, budget — aucun identifiant personnel)

Finalité du transfert :
  Hébergement technique de l'infrastructure API, base de données D1 et KV

Garanties appropriées :
  — Cloudflare Data Privacy Framework UE-US (certification active)
  — Data Processing Addendum (DPA) Cloudflare signé
    (disponible sur cloudflare.com/cloudflare-customer-dpa)
  — ISO 27001, SOC 2 Type II
  — Données anonymisées : risque résiduel minimal pour les personnes concernées
```

---

## PHASE 2 — Autorisation Générale (A-GC) + T-HB amendé

> **⚠ Prérequis impératif :** N° de récépissé DS Phase 1 obtenu.  
> **⚠ Règle absolue :** Ne pas activer le toggle admin `full` avant réception du n° d'autorisation A-GC.

### Quel formulaire ?

**Formulaire A-GC** — "Autorisation Générale concernant les personnes physiques"

Applicable car :
- Traitement de données personnelles de résidents marocains (Art. 12)
- Personnes concernées potentiellement mineures (Art. 14 — lycéens 17-18 ans)
- Partage commercial avec des tiers (établissements partenaires) (Art. 13)
- Décisions algorithmiques (calculateur de probabilités d'admission) (Art. 7)

### Formulaire A-GC — Contenu exact (en plus de la DS)

**Reprendre toutes les informations de la DS, puis ajouter :**

**Rubrique : Données personnelles supplémentaires collectées**
```
En complément des données anonymes (Phase 1), collectées uniquement sur
consentement explicite et optionnel :

4. Données d'identification :
   — Prénom
   — Nom de famille

5. Données de contact :
   — Adresse email (pour réception du dossier personnalisé)
   — Numéro de téléphone WhatsApp (uniquement si opt-in écoles privées activé)
```

**Rubrique : Finalités supplémentaires**
```
1. Génération de dossiers de candidature personnalisés pour les établissements
   d'enseignement supérieur (si consentement fourni à l'étape 4/4 du formulaire)

2. Mise en relation entre le lycéen et des établissements d'enseignement supérieur
   partenaires de JAD2 Advisory, sur opt-in explicite et granulaire par établissement
   (case à cocher distincte, non pré-cochée, révocable à tout moment)

3. Communication des coordonnées du lycéen aux établissements partenaires
   contractuellement engagés pour les contacter à des fins de recrutement académique
```

**Rubrique : Base légale du traitement**
```
Consentement explicite de la personne concernée (Art. 3 et 4, Loi 09-08)

Modalités de recueil du consentement :
— Case à cocher obligatoire dans le formulaire d'orientation (Étape 4/4)
— Texte de consentement affiché intégralement avant validation
— Opt-in B2B distinct et granulaire : case séparée par établissement, non pré-cochée
— Enregistrement horodaté de chaque acte de consentement (champ consentAt en D1)
— Possibilité de retrait à tout moment sans justification via jad2advisory@gmail.com
— Exécution du retrait sous 72 heures maximum
```

**Rubrique : Personnes concernées — Mineurs (Art. 14)**
```
La cible principale inclut des lycéens âgés de 17-18 ans, potentiellement mineurs.

Mécanisme de consentement parental mis en place :
— Case à cocher spécifique pour les mineurs :
  "Je certifie que mon parent ou tuteur légal a été informé et a donné son accord
   pour que je fournisse mes coordonnées personnelles, conformément à l'Art. 14
   de la Loi 09-08."
— La simulation anonyme (Phase 1) reste accessible sans restriction d'âge.
— Aucune collecte de PII sans consentement parental certifié pour les mineurs.
```

**Rubrique : Destinataires des données personnelles**
```
1. JAD2 Advisory (responsable du traitement) — accès interne exclusif

2. Établissements d'enseignement supérieur partenaires (opt-in explicite uniquement) :
   — UM6P — Université Mohammed VI Polytechnique (Ben Guerir)
   — UIR — Université Internationale de Rabat
   — HEM Business School (Casablanca, Rabat, Marrakech, Fès)
   — Al Akhawayn University in Ifrane
   — Mundiapolis Université (Casablanca)

   Conditions contractuelles préalables à tout transfert :
   — Convention de partage de données signée (modèle ci-dessous)
   — Engagement de non-revente et de finalité unique (recrutement académique)
   — Vérification que l'établissement dispose de sa propre autorisation CNDP

3. Cloudflare, Inc. (sous-traitant technique) — DPA signé (voir T-HB)

4. Google LLC — Gemini API (sous-traitant IA) — texte des requêtes chatbot anonymisé
   Garanties : Google Cloud DPA, Data Privacy Framework, ISO 27001
```

**Rubrique : Décisions automatisées (Art. 7)**
```
OUI — Le calculateur de probabilités d'admission constitue techniquement une
décision automatisée.

Précisions obligatoires :
— Outil indicatif d'aide à la décision, non contraignant
— Aucun effet juridique sur l'orientation de l'élève
— L'élève garde le plein contrôle de ses choix
— Mention explicite dans la politique de confidentialité publiée
— Droit de demander une révision humaine via jad2advisory@gmail.com
```

**Rubrique : Droits des personnes concernées**
```
— Droit d'accès (Art. 7) : obtenir copie des données → jad2advisory@gmail.com, 30 jours
— Droit de rectification (Art. 8)
— Droit d'opposition (Art. 9)
— Droit à l'effacement : exécution sous 72 h, confirmation email
— Droit au retrait du consentement : sans justification, à tout moment
— Droit relatif aux décisions automatisées : révision humaine sur demande
```

**Rubrique : Durées de conservation (Phase 2)**
```
— Données dossier de candidature (nom, email) : 12 mois à compter de la génération
— Données de contact partenaires (téléphone + opt-in) : 6 mois maximum
— Données de consentement (log horodaté) : 3 ans (preuve de conformité)
— Purge automatique : Cron Cloudflare Workers (tâche journalière)
```

---

### Formulaire T-HB amendé (Phase 2) — Données personnelles

```
Référencer : DS n°________ + A-GC n°________

Données supplémentaires transférées vers Cloudflare :
  — Données d'identification : prénom, nom (si consentement fourni)
  — Données de contact : email, téléphone (si opt-in B2B activé)

Garanties supplémentaires :
  — Cloudflare Data Processing Addendum signé (cloudflare.com/cloudflare-customer-dpa)
  — Chiffrement TLS 1.3 en transit + chiffrement au repos Cloudflare D1
  — Accès aux données personnelles limité au responsable du traitement uniquement
```

---

## Textes de consentement à intégrer dans l'interface (Phase 2)

### Checkbox principale (Étape 4/4 du formulaire d'orientation)

**Pour majeurs (18 ans ou plus) :**
```
☐ J'accepte les conditions d'utilisation et je comprends que les résultats sont 
  indicatifs et non contractuels. Je consens au traitement de mon profil anonymisé 
  par JAD2 TAWJIH pour améliorer les recommandations. [Politique de confidentialité]
```

**Pour mineurs (<18 ans) — checkbox distincte :**
```
☐ Je certifie que mon parent ou tuteur légal a été informé et a donné son accord
  pour que je fournisse mes coordonnées personnelles à JAD2 TAWJIH, conformément
  à l'Article 14 de la Loi 09-08.
```

### Opt-in dossier personnalisé (Section optionnelle)
```
☐ J'autorise JAD2 TAWJIH à conserver mon nom et email pour générer et m'envoyer
  un dossier de candidature personnalisé. Données supprimées sur simple demande.
```

### Opt-in écoles privées (Section optionnelle séparée — NON pré-cochée)
```
☐ J'accepte que JAD2 TAWJIH transmette mon profil et mes coordonnées aux écoles 
  que je sélectionne ci-dessous, afin qu'elles puissent me contacter au sujet de 
  leurs formations. Je peux retirer ce consentement à tout moment via 
  jad2advisory@gmail.com.

  Sélectionnez les établissements :
  ☐ UM6P  ☐ UIR  ☐ HEM  ☐ Al Akhawayn  ☐ Mundiapolis
```

> **Règle absolue CNDP** : Aucune case ne doit être pré-cochée. Chaque établissement a sa propre case. L'accord pour un établissement ne vaut pas accord pour les autres.

---

## Convention de partage avec les établissements partenaires

> À signer **avant** tout transfert de données vers un partenaire. Sans cette convention, le partage est illicite même avec consentement de l'étudiant.

```
CONVENTION DE PARTAGE DE DONNÉES À CARACTÈRE PERSONNEL

Entre JAD2 Advisory (HBRM91), responsable de traitement initial,
Représenté par Hamza El Bouhali
N° autorisation CNDP A-GC : [À COMPLÉTER]

Et [NOM DE L'ÉTABLISSEMENT], co-destinataire,
Représenté par [NOM ET FONCTION]
N° autorisation CNDP de l'établissement : [À VÉRIFIER ET COMPLÉTER]

1. Données transmises : prénom, nom, email, téléphone, filière Bac, notes, région
2. Finalité exclusive : contact de l'étudiant au sujet des formations de l'établissement
3. Durée de conservation chez le destinataire : 6 mois maximum
4. Interdictions : revente à des tiers, utilisation à d'autres fins, sous-traitement non autorisé
5. Révocation : suppression dans les 5 jours ouvrés sur demande de JAD2 Advisory
6. Violation de données : notification à JAD2 Advisory sous 48 heures
```

---

## Obligations de notification CNDP (Art. 66)

En cas de violation de données (accès non autorisé, fuite, perte) :
- **72 heures** pour notifier la CNDP : contact@cndp.ma
- **Informer les personnes concernées** si la violation présente un risque élevé pour leurs droits
- **Documenter** l'incident dans le registre interne (nature, volume, mesures prises)

---

## Checklist opérationnelle

### Phase 1 — À faire avant le 17 juin 2026

- [ ] Créer un compte sur portail.cndp.ma
- [ ] Déposer le formulaire **DS** avec le contenu ci-dessus
- [ ] Déposer le formulaire **T-HB** Phase 1 simultanément
- [ ] Signer le DPA Cloudflare (Cloudflare Dashboard → Account → Legal)
- [ ] Conserver le récépissé DS → noter n° : `_______________________`
- [ ] Mettre à jour la privacy policy publiée avec le n° DS
- [ ] Déployer avant le 17 juin — **le toggle admin reste en mode `anonymous`**

### Phase 2 — Avant d'activer le mode "Collecte complète"

- [ ] Déposer le formulaire **A-GC** (référencer DS n°_______)
- [ ] Déposer le formulaire **T-HB** amendé pour les données personnelles
- [ ] Signer le DPA Google Gemini (Google Cloud Console)
- [ ] Réception de l'autorisation A-GC → noter n° : `_______________________`
- [ ] Signer les conventions avec chaque établissement partenaire
- [ ] Vérifier que chaque établissement a sa propre autorisation CNDP
- [ ] Mettre à jour la privacy policy avec le n° A-GC et les établissements
- [ ] Activer le toggle admin → `full` (Settings > Mode de collecte)
- [ ] Mettre en production le module dossier personnalisé + opt-in écoles

### En continu

- [ ] Répondre aux demandes de droits sous 30 jours (jad2advisory@gmail.com)
- [ ] Notifier la CNDP de toute violation sous 72 heures
- [ ] Purger les données expirées (Cron automatique — vérifier mensuellement)
- [ ] Réviser ce dossier à chaque évolution majeure de la plateforme
- [ ] Renouveler l'autorisation si la CNDP l'exige (vérifier annuellement)

---

## Registre des traitements (à tenir à jour)

| Traitement | Formulaire | N° CNDP | Date dépôt | Date approbation | Expiration |
|---|---|---|---|---|---|
| Stats anonymes (Phase 1) | DS | | | Immédiate | — |
| Transfert Cloudflare Phase 1 | T-HB | | | Immédiate | — |
| Données personnelles (Phase 2) | A-GC | | | | +5 ans |
| Transfert Cloudflare Phase 2 | T-HB | | | | +5 ans |

---

## Contacts

| | |
|---|---|
| **Portail CNDP** | https://portail.cndp.ma |
| **Site officiel CNDP** | https://www.cndp.ma |
| **Email CNDP** | contact@cndp.ma |
| **Téléphone CNDP** | +212 (0)5 37 57 89 89 |
| **Adresse CNDP** | Angle Av. Allal El Fassi et Av. Arabie Saoudite, Hay Ryad, Rabat |
| **DPO JAD2** | jad2advisory@gmail.com |
| **DPA Cloudflare** | cloudflare.com/cloudflare-customer-dpa |
| **DPA Google Cloud** | Google Cloud Console → IAM → Data Processing |

---

## Références légales

| Texte | Articles clés |
|---|---|
| **Loi 09-08** | Art. 3 (consentement) · Art. 5 (qualité des données) · Art. 7 (décisions auto.) · Art. 12 (autorisation) · Art. 13 (tiers) · Art. 14 (mineurs) · Art. 18 (déclaration simplifiée) · Art. 23 (sécurité) · Art. 43 (transferts) · Art. 66 (violations) |
| **Décret 2-09-165** | Formulaires DS, A-GC, T-HB |
| **Data Privacy Framework** | Base pour transfert Cloudflare / Google (US) |
| **Cloudflare DPA** | cloudflare.com/cloudflare-customer-dpa |

---

*Document interne JAD2 Advisory — Ne pas publier ni partager hors équipe.*  
*Ce document n'est pas un avis juridique. Faire valider par un conseil spécialisé en droit marocain des données avant dépôt officiel.*  
*Mise à jour : Juin 2026 · Prochaine révision recommandée : après réception de l'autorisation A-GC.*
