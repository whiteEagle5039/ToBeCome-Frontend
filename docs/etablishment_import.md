
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
      "role": "ELEVE_COLLEGE"
    }
  ]
}
```

La route accepte aussi `rows` au lieu de `eleves`.

Ce qui est créé pour chaque élève :
- un `matricule`
- un `user`
- un `eleveProfile`

Réponse attendue :

```json
{
  "imported": 1,
  "results": [
    {
      "success": true,
      "matricule": "ABC12345",
      "userId": "..."
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
      "role": "ELEVE_COLLEGE"
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
