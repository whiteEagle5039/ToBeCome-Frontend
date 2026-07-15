
## Importation des élèves et génération de matricules

Toutes les routes ci-dessous sont accessibles via le préfixe `/api/etablissement` et nécessitent une authentification JWT pour un utilisateur de rôle `ETABLISSEMENT`.

### 1) Import d'élèves

`POST /api/etablissement/eleves/import`

Payload attendu :

```json
{
  "eleves": [
    {
      "prenom": "Jean",
      "nom": "Dupont",
      "dateNaissance": "2009-05-12",
      "classeId": "id-de-la-classe",
      "parents": [
        {
          "prenom": "Paul",
          "nom": "Dupont",
          "email": "paul.dupont@example.com",
          "telephone": "+229 90 00 00 00",
          "lienParente": "Père"
        },
        {
          "prenom": "Marie",
          "nom": "Dupont",
          "email": "marie.dupont@example.com",
          "telephone": "+229 91 00 00 00",
          "lienParente": "Mère"
        }
      ]
    }
  ]
}
```

La route accepte aussi `rows` au lieu de `eleves`.
Le champ `role` devient facultatif. Quand `classeId` est renseigné, le rôle de l'élève est déduit automatiquement à partir du niveau de la classe.

Ce qui est créé pour chaque élève :
- un `matricule`
- un `user`
- un `eleveProfile`
- un ou plusieurs comptes parents si les informations sont fournies
- une association automatique entre l'élève et chaque parent

Si un parent existe déjà avec le même email, le compte n'est pas recréé. L'élève est simplement rattaché à ce parent, ce qui permet à un même parent d'avoir plusieurs enfants dans le même établissement.

Réponse attendue :

```json
{
  "imported": 1,
  "results": [
    {
      "success": true,
      "matricule": "ABC12345",
      "userId": "...",
      "role": "ELEVE_COLLEGE",
      "parents": [
        {
          "email": "paul.dupont@example.com",
          "userId": "...",
          "parentId": "...",
          "created": true,
          "temporaryPassword": "Parent@a1b2c3d4"
        }
      ]
    }
  ]
}
```

En cas d'erreur sur un élève, l'élément renvoyé contient `success: false`, le `name` et `error`.

### 2) Création groupée d'élèves

`POST /api/etablissement/eleves`

Payload attendu :

```json
{
  "eleves": [
    {
      "prenom": "Marie",
      "nom": "Durand",
      "dateNaissance": "2008-09-20",
      "classeId": "id-de-la-classe",
      "parents": [
        {
          "prenom": "Aline",
          "nom": "Durand",
          "email": "aline.durand@example.com",
          "telephone": "+229 92 00 00 00",
          "lienParente": "Mère"
        }
      ]
    }
  ]
}
```

Réponse similaire à l'import, avec les `matricule` générés pour chaque élève.

### 3) Génération de matricules en groupe

`POST /api/etablissement/matricules`

Payload attendu :

```json
{
  "count": 10
}
```

Réponse attendue :

```json
{
  "matricules": [
    {"code": "ABC12345", "id": "..."},
    {"code": "DEF67890", "id": "..."}
  ]
}
```

Cette route crée des matricules valides pour un établissement sans créer directement d'élèves.
